/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcPatientNetworkHelper, js front-end helper for HcPatientNetwork component.
 * @since 198
 */
({
    // shared variables to persist during component instance
    PATIENT_ID: null,
    CASE_ID: null,

    context: {
        "width": 0,
        "height": 0,
        "force": null,
        "forceSim": null,
        "zoom": null,
        "networkContainer": null,
        "linkContainer": null,
        "nodeContainer": null,
        "nodes": [],
        "links": [],
        "d3NodeSelection": null,
        "nodeElements": null,
        "linkElements": null,
        "zoomRect": null
    },

    // Component configuration values
    config: {
        "debug": false,
        "patientSize": 80,
        "careteamSize": 40,
        "nodeTextMargin": 10,
        "patientNodeTextYOffset": "3.5em",
        "checkmark": "M18.5,27.3c-0.1,0.1-0.2,0.1-0.3,0.1s-0.2,0-0.3-0.1l-7.1-7.1c-0.2-0.2-0.2-0.4,0-0.6l2.9-2.9c0.2-0.2,0.4-0.2,0.6,0l3.9,3.9l8.9-8.9c0.2-0.2,0.4-0.2,0.6,0l2.9,2.9c0.2,0.2,0.2,0.4,0,0.6L18.5,27.3z",
        "forceSimAlpha": 0.7,
        "forceSimAlphaDecay": 0.05,
        "forceXMultiplier": 1.1
    },

    progressLog: function(message) {
        if (this.config.debug) {
            var current = new Date().getTime();
            var timing = performance.timing;
            var timeElapsed = (current-timing.navigationStart);
            console.log('Rendered:'+message+'#'+timeElapsed);
        }
    },

    // initialize D3 elements
    initD3: function(component) {
        var cmp = component.find('network').getElement();
        var d3_cmp = d3.select(cmp);

        this.context.width = cmp.offsetWidth;
        this.context.height = cmp.offsetHeight;

        var width = this.context.width;
        var height = this.context.height;

        this.progressLog('D3 Patient Network: Calling initializers...');
        this.initForceSim(component);
        this.initZoom(component);
        this.initSvg(component,d3_cmp);
        this.initZoomRect(component);

        var container = this.context.d3Svg.append("g");

        this.drawCircleMasking(container);

        this.context.networkContainer = container;

        this.setElementsWidthAndHeight(width, height);

        this.initContainers();

        // Set patient ID for component instance if needed
        if ($A.util.isUndefinedOrNull(this.PATIENT_ID)) { this.setPatientId(); }

        if (!$A.util.isEmpty(component.get("v.patientRoleName"))) {
            // Get data for network graph and build
            this.getCareTeamMembers(component, true);
        }
    },

    setElementsWidthAndHeight: function(width, height){
        this.context.d3Svg
            .attr("width", width)
            .attr("height", height);
        this.context.zoomRect
            .attr("width", width)
            .attr("height", height);
        this.context.networkContainer.attr("transform", "translate(" + width/2 + "," + height / 2 + ")scale(1)");
        this.context.zoomRect.call(this.context.zoom.transform, d3.zoomIdentity.translate(width/2,height/2).scale(1));
    },

    //
    // specific init methods
    //
    initForceSim: function(component){
        // set up the d3 force simulation
        this.context.forceSim = d3.forceSimulation()
            .force("charge", d3.forceManyBody().strength(-3500))
            .force("link", d3.forceLink().distance(200).strength(2))
            .force("gravity", d3.forceManyBody().strength(2500))
            .velocityDecay([0.6]);
    },

    initZoom: function(component) {
        var self = this;
        this.context.zoom = d3.zoom()
            .scaleExtent([0.5, 5])
            .on('zoom', $A.getCallback( function() {
                self.doZoom(component);
            }));
    },
    initSvg: function(component, d3_cmp) {
        this.context.d3Svg = d3_cmp.append("svg");
    },
    initZoomRect: function(component,svg,width,height) {
        this.context.zoomRect = this.context.d3Svg.append("rect")
            .style("fill", "none")
            .style("pointer-events", "all")
            .call(this.context.zoom)
            .on("wheel.zoom", null);
    },
    initContainers: function(){
        this.context.linkContainer = this.context.networkContainer.append("g")
            .attr("class", "links");
        this.context.nodeContainer = this.context.networkContainer.append("g")
            .attr("class", "nodes");
    },

    // set context patient ID from window URL/location
    setPatientId: function(component) {
        this.PATIENT_ID = component.get("v.patientId");
        this.EXTERNAL_TEXT = $A.get("$Label.HealthCloudGA.Text_External");
        this.INTERNAL_TEXT = $A.get("$Label.HealthCloudGA.Text_Internal");
    },

    // return care team member data
    getCareTeamMembers: function(component, initCall) {
        var id;
        var action;
        var self = this;
        if (component.get("v.careTeamByCaseId") == "true") {
            // MCP : getting care team by case id.
            id = component.get("v.carePlanId");
            if ($A.util.isEmpty(id)) {
                if (this.config.debug) { console.log("can not get case id. network load will fail "); }
            }
            action = component.get("c.getCareTeamMembersByCaseId");
            action.setParams({
                "caseId": id
            });
        } else {
            action = component.get("c.getCareTeamMembersByContactId");
            var id = this.PATIENT_ID;
            if ($A.util.isEmpty(id)) {
                if (this.config.debug) { console.log("can not get contact id. network will failed "); }
            }
            action.setParams({
                "contactId": id
            });
        }
        action.setCallback(this, function(result) {
            var state = result.getState();
            var memberArray = result.getReturnValue();

            if (component.isValid() && state.toUpperCase() === "SUCCESS" && !$A.util.isEmpty(memberArray)) {
                self.processTeamMembers(component,memberArray,initCall);
            }
            else if (state.toUpperCase() === "ERROR") {
                var errors = result.getError();
                var errorMsg = "Unknown error";
                if (errors) {
                    $A.log("Errors", errors);
                    if (errors[0] && errors[0].message) {
                        errorMsg = errors[0].message;
                    }
                }
                component.set('v.hasPatient', false);
                var toast = component.find('network-toast-message');
                toast.set('v.content', { 'type': 'error', 'message': errorMsg });
            }
            else {
                var toast = component.find('network-toast-message');
                toast.set('v.content', { 'type': 'error', 'message': $A.get("$Label.HealthCloudGA.Msg_Error_General") });
            }
        });

        $A.enqueueAction(action);
    },

    processTeamMembers: function(component,memberArray,initCall) {
        var data = {
                nodes: [],
                links: []
            },
            patientIndex = -1;

        // Find the map with the patient
        for (var i = 0; i < memberArray.length; i++) {
            if (memberArray[i].isPatient == 'true') {
                patientIndex = i;
                this.CASE_ID = memberArray[i].parentId;
                break;
            }
        }

        for (var i = 0; i < memberArray.length; i++) {
            memberArray[i].isUser = this.stringToBool(memberArray[i].isUser);
            memberArray[i].isContact = this.stringToBool(memberArray[i].isContact);
            memberArray[i].isCommunityEnabled = this.stringToBool(memberArray[i].isCommunityEnabled);

            if (i != patientIndex) {
                data.links.push({
                    "source": i,
                    "target": patientIndex
                });
            }
        }

        data.nodes = memberArray;

        this.context.nodes = data.nodes;
        this.context.links = data.links;

        if (initCall) {
            // on initial call on component creation, create the nodes, and start the
            // simulation
            this.createNetworkAndSimulation(component);
        }
        else{
            // on subsequent calls, rebuild the links and nodes and restart the simulation
            this.createLinks(component);
            this.createNodes(component);
            this.restartSimulation(component);
        }
    },

    // setup the dom containers, create the links and nodes, and setup and start the
    // simulation
    createNetworkAndSimulation: function(component) {
        var self = this;
        var config = this.config;
        var forceSim = this.context.forceSim;

        // create the links
        this.createLinks(component);
        // create the base node elements that D3 will be acting on
        this.createNodes(component);

        // add the nodes and final forces to the D3 force simulation, start the sim
        forceSim.nodes(this.context.nodes)
            .force("external", isolate(d3.forceX(-this.context.width * this.config.forceXMultiplier), function(d) { return d.isPatient!=='true' && self.isExternal(d) }))
            .force("internal", isolate(d3.forceX(this.context.width * this.config.forceXMultiplier), function(d) { return d.isPatient!=='true' && !self.isExternal(d) }))
            .force("center", isolate(d3.forceCenter(0,0), function (d){return d.isPatient==='true';} ))
            .alpha(this.config.forceSimAlpha)
            .alphaDecay(this.config.forceSimAlphaDecay)
            .on("tick",ticked)
            .on("end", function(){
                self.zoomFit(component,350);
            });

        // add the links to the sim
        forceSim.force("link").links(this.context.links);

        // used by D3 to determine where each node & link should be placed on the field
        function ticked(){
            self.context.nodeElements.attr("transform", function (d) {
                return ("translate("+d.x+","+d.y+")")
            });

            self.context.linkElements.attr("x1", function(d) { return d.source.x + (config.careteamSize /2); })
                .attr("y1", function(d) { return d.source.y + (config.careteamSize /2); })
                .attr("x2", function(d) { return d.target.x + (config.patientSize /2); })
                .attr("y2", function(d) { return d.target.y + (config.patientSize /2); });
        }

        // use to isolate forces to specific nodes
        function isolate(force, filter) {
            var initialize = force.initialize;
            force.initialize = function() { initialize.call(force, self.context.nodes.filter(filter)); };
            return force;
        }
    },

    zoomFit: function(component, zoomDuration) {
        var scalePaddingPercentage = 0.9;
        var self = this;
        var bounds = self.context.networkContainer.node().getBBox();
        var width = bounds.width;
        var height = bounds.height;
        var midX = bounds.x + (width / 2);
        var midY = bounds.y + (height / 2);
        if (width == 0 || height == 0) return;
        var scale = (scalePaddingPercentage) / Math.max(width / self.context.width, height / self.context.height);
        var zoomX = (self.context.width / 2) - (scale * midX);
        var zoomY = (self.context.height / 2) - (scale * midY);

        if (scale<1){
	    	self.zoomTransition(component, zoomDuration, zoomX, zoomY, scale);
        }
        else{
            self.zoomTransition(component, 750, self.context.width/2, self.context.height/2, 1);
        }
	},

    restartSimulation: function(component){
        // to refresh / reload the graph - stop the sim, reset the nodes & links
        // and restart the sim
        this.context.forceSim.stop();
        this.context.forceSim.nodes(this.context.nodes);
        this.context.forceSim.force("link").links(this.context.links);
        this.context.forceSim.alpha(this.config.forceSimAlpha).restart();
    },

    clickNodeAction: function(component, d) {
        this.progressLog(d);
        var clickEvent = component.getEvent("HcCareTeamEvent");

        clickEvent.setParams({
            "type": "NODECLICK",
            "message": "Id",
            "nodeObj": d
        });

        clickEvent.fire();
    },

    // add the clipPath circle masks for the node images to the main svg container
    drawCircleMasking: function(container) {
        // preparing node masking
        container.append("clipPath")
            .attr("id", "health1-network-masking--patient")
            .append("circle")
            .attr("r", this.config.patientSize / 2)
            .attr('cx', this.config.patientSize / 2)
            .attr('cy', this.config.patientSize / 2);
        container.append("clipPath")
            .attr("id", "health1-network-masking--careteam")
            .append("circle")
            .attr("r", this.config.careteamSize / 2)
            .attr('cx', this.config.careteamSize / 2)
            .attr('cy', this.config.careteamSize / 2);
    },

    createLinks: function(component){
        // create the links that join the care team nodes to the patient nodes
        // based on the array context.links
        this.context.linkElements = this.context.linkContainer.selectAll('line')
            .data(this.context.links, function(d) { return d.source.id + "-" + d.target.id; });
        this.context.linkElements.exit().remove();
        // merge with existing linkElements, if any - this is necessary for reload
        this.context.linkElements = this.context.linkElements
            .enter().append("line").merge(this.context.linkElements);
    },

    createNodes: function(component){
        var self = this;
        var config = this.config;

        // create the base node 'g' elements that D3 will be manipulating
        // based on the array context.nodes
        this.context.nodeElements = this.context.nodeContainer.selectAll('g')
            .data(this.context.nodes, function (d) {
                return d.id;
            });
        this.context.nodeElements.exit().remove();
        // merge with existing nodeElements, if any - this is necessary for reload
        this.context.nodeElements = this.context.nodeElements
            .enter()
            .append("g").merge(this.context.nodeElements);

        // now build out the dom elements further
        this.context.nodeElements
            .attr("class", function(d, index) {
                if (d.isPatient==='true') return 'node health1-network-node--patient';
                if (self.isExternal(d)) return 'node health1-network-node--external';
                else return 'node health1-network-node--internal';
            })
            // assigning data index for each network node
            .attr("vis-data-index", function(d, index) {
                return index;
            });

        // add click for all nodes, add drag for care team members
        this.context.nodeElements
            .on("click", $A.getCallback( function(d) {
                if (d3.event.defaultPrevented) return;
                self.clickNodeAction(component, d);
            }) );
        this.context.nodeElements.filter(function(d){return d.isPatient!=='true';})
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
            );

        function dragstarted(d) {
            if (!d3.event.active) {
                self.context.forceSim.alphaTarget(0.3).restart();
            }
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            if (d3.event.y<=(self.context.height/2) - config.careteamSize) {
                d.fy = d3.event.y;
            }
        }

        function dragended(d) {
            if (!d3.event.active) {
                self.context.forceSim.alphaTarget(0);
            }
            d.fx = null;
            d.fy = null;
        }

        // append the member images to the base node
        this.context.nodeElements
                .append("svg:image")
                .attr("class", "health1-network-node--image")
                .attr("clip-path", function(d,index) {
                    return d.isPatient==='true' ? "url(#health1-network-masking--patient)" : "url(#health1-network-masking--careteam)";
                })
                .attr("width", function(d){return d.isPatient==='true' ? config.patientSize + 'px' : config.careteamSize + 'px'})
                .attr("height", function(d){return d.isPatient==='true' ? config.patientSize + 'px' : config.careteamSize + 'px'})
                .attr("xlink:href", function(d){return d.photoURL;})
            ;

        // append the text for the patient just to the patient node
        this.context.nodeElements.filter(function(d){return d.isPatient==='true';})
            .append("text")
            .attr("dx", - config.nodeTextMargin)
            .attr("dy", config.patientNodeTextYOffset)
            .attr("text-anchor", "end")
            .text(this.EXTERNAL_TEXT);
        this.context.nodeElements.filter(function(d){return d.isPatient==='true';})
            .append("text")
            .attr("dx", config.patientSize * 2)
            .attr("dy", config.patientNodeTextYOffset)
            .attr("text-anchor", "end")
            .text(this.INTERNAL_TEXT);
        this.context.nodeElements.filter(function(d){return d.isPatient==='true';})
            .append("text")
            .attr("class", "health1-network-nodetext--name")
            .attr("dx", config.patientSize / 2)
            .attr("dy", config.patientSize + (config.nodeTextMargin*2))
            .attr("text-anchor", "middle")
            .text(function(d){return d.name;});
        this.context.nodeElements.filter(function(d){return d.isPatient==='true';})
            .append("text")
            .attr("class", "health1-network-nodetext--role")
            .attr("dx", config.patientSize / 2)
            .attr("dy", config.patientSize + (config.nodeTextMargin*4))
            .attr("text-anchor", "middle")
            .text(function(d){return d.role;});

        // append the care team names & roles to their nodes
        var careTeamNodeText = this.context.nodeElements.filter(function(d){return d.isPatient!=='true';})
            .append("g")
            .attr("text-anchor", function(d) {
                return self.isExternal(d) ? "end" : "start";
            })
            .attr("transform",function (d) {
                return "translate("+ (self.isExternal(d)? -config.nodeTextMargin : (config.careteamSize + config.nodeTextMargin)) +","+(config.careteamSize/2)+")";
            });
        careTeamNodeText
            .append("text")
            .attr("class", "health1-network-nodetext--name")
            .text(function(d) { return d.name;  });
        careTeamNodeText
            .append("text")
            .attr("class", "health1-network-nodetext--role")
            .attr("dy", "1em")
            .text(function(d) { return d.role; });

        // append the checkmarks to the care team nodes
        var checkedNodes = this.context.nodeElements.filter(function(d) {
            return (d.isPatient!=='true' && self.isCheckedNode(component, d));
        });
        checkedNodes.append("circle")
            .attr("class", "health1-network-checkmark--circle")
            .attr("r", 9)
            .attr("cx", 0) //specific offsets for care team checkmarks
            .attr("cy", 34);
        checkedNodes.append("path")
            .attr("class", "health1-network-checkmark--check")
            .attr("d", config.checkmark)
            .attr("transform", "translate(-9.5,24.5) scale(0.48,0.48)");

        // append checkmark to the patient node
        var checkedPatientNode = this.context.nodeElements.filter(function(d) {
            return (d.isPatient==='true' && self.isCheckedNode(component, d));
        });
        checkedPatientNode.append("circle")
            .attr("class", "health1-network-checkmark--circle")
            .attr("r", 13)
            .attr("cx", 0)  //specific offsets for patient checkmarks
            .attr("cy", 65);
        checkedPatientNode.append("path")
            .attr("class", "health1-network-patientcheckmark--check")
            .attr("d", config.checkmark)
            .attr("transform", "translate(-14,52) scale(0.7,0.7)");
    },

    isExternal: function(d) {
        //isExternal is not present for contacts but they are external. So, checking for null
        return $A.util.isUndefinedOrNull(d.isExternal) || d.isExternal === "true";
    },

    isCheckedNode: function(component, d) {
        if (d.isInternal=='true' || (d.isCommunityLive=='true' && d.isCommunityEnabled==true))
            return true;
        else
            return false;
    },

    // zoom when clicked
    // :: requires component reference and zoom direction value (in = 1, out = -1)
    zoomClick: function(component, zoom_direction) {
        var direction = zoom_direction || 1;
        var zoom = this.context.zoom;
        var factor = 0.4;
        var target_zoom = 1;
        var center = [this.context.width / 2, this.context.height / 2];
        var extent = zoom.scaleExtent();

        var transform = d3.zoomTransform(this.context.zoomRect.node());

        var translate0 = [];
        var l = [];
        var view = {
            x: transform.x,
            y: transform.y,
            k: transform.k
        };

        target_zoom = transform.k * (1 + factor * direction);

        if (target_zoom < extent[0] || target_zoom > extent[1]) {
            return false;
        }

        translate0 = [(center[0] - transform.x) / transform.k, (center[1] - transform.y) / transform.k];
        view.k = target_zoom;
        l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];

        view.x += center[0] - l[0];
        view.y += center[1] - l[1];

        this.zoomTransition(component, 350, view.x, view.y, view.k);
    },

    zoomTransition: function(component, zoom_duration, zoom_x, zoom_y, zoom_scale) {
        var self = this;
        this.context.networkContainer.transition()
            .duration(zoom_duration)
            .attr("transform", "translate(" + zoom_x + "," + zoom_y + ")scale(" + zoom_scale + ")")
            .on("end", function () {
                self.context.zoomRect.call(self.context.zoom.transform, d3.zoomIdentity.translate(zoom_x,zoom_y).scale(zoom_scale));
            });
    },

    // // formerly eventZoom and manualZoom
    doZoom: function(component) {
        this.context.networkContainer.attr("transform", d3.event.transform);
    },

    windowResized: function(component){
        // get new width & height
        var cmp = component.find('network').getElement();
        this.context.width = cmp.offsetWidth;
        this.context.height = cmp.offsetHeight;

        // set elements width & height
        this.setElementsWidthAndHeight(this.context.width, this.context.height);

        // recreate forceSim
        this.initForceSim(component);
        this.createNetworkAndSimulation(component);
    }
})