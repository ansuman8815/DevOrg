/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcPatientNetworkHelper, js front-end helper for HcPatientNetwork component.
 * @since 198
 */
({
    networkStates: {},

    initComponentState: function(component) {
        var componentGlobalId = component.getGlobalId();
        var nodeIdPrefix = 'hc_' + componentGlobalId.replace(/:/g, '_').replace(/;/g, '_');
        this.networkStates[componentGlobalId] = {
            maskingNodeIds: {
                patient: nodeIdPrefix + 'health1-network-masking--patient',
                careTeam: nodeIdPrefix + 'health1-network-masking--careTeam'
            },
            // shared variables to persist during component instance
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
                "d3Svg": null,
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
            }
        };
    },

    getNetworkState: function(component) {
        return this.networkStates[component.getGlobalId()];
    },

    removeNetworkState: function(component) {
        delete this.networkStates[component.getGlobalId()];

    },

    progressLog: function(component, message) {
        var networkState = this.getNetworkState(component);
        if (networkState.config.debug) {
            var current = new Date().getTime();
            var timing = performance.timing;
            var timeElapsed = (current - timing.navigationStart);
            console.log('Rendered:' + message + '#' + timeElapsed);
        }
    },

    // initialize D3 elements
    initD3: function(component) {
        var networkState = this.getNetworkState(component);
        var cmp = component.find('network').getElement();
        var d3_cmp = d3.select(cmp);

        networkState.context.width = cmp.offsetWidth;
        networkState.context.height = cmp.offsetHeight;

        this.progressLog(component, 'D3 Patient Network: Calling initializers...');
        this.initForceSim(component);
        this.initZoom(component);
        networkState.context.d3Svg = d3_cmp.append("svg");
        this.initZoomRect(component);

        var container = networkState.context.d3Svg.append("g");

        this.drawCircleMasking(component, container);

        networkState.context.networkContainer = container;

        this.setElementsWidthAndHeight(component);

        this.initContainers(component);

        if (!$A.util.isEmpty(component.get("v.patientRoleName"))) {
            // Get data for network graph and build
            this.getCareTeamMembers(component, true);
        }
    },

    setElementsWidthAndHeight: function(component) {
        var networkState = this.getNetworkState(component);
        var width = networkState.context.width;
        var height = networkState.context.height;
        networkState.context.d3Svg
            .attr("width", width)
            .attr("height", height);
        networkState.context.zoomRect
            .attr("width", width)
            .attr("height", height);
        networkState.context.networkContainer.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(1)");
        networkState.context.zoomRect.call(networkState.context.zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(1));
    },

    //
    // specific init methods
    //
    initForceSim: function(component) {
        var networkState = this.getNetworkState(component);
        // set up the d3 force simulation
        networkState.context.forceSim = d3.forceSimulation()
            .force("charge", d3.forceManyBody().strength(-3500))
            .force("link", d3.forceLink().distance(200).strength(2))
            .force("gravity", d3.forceManyBody().strength(2500))
            .velocityDecay([0.6]);
    },

    initZoom: function(component) {
        var self = this;
        var networkState = this.getNetworkState(component);
        networkState.context.zoom = d3.zoom()
            .scaleExtent([0.5, 5])
            .on('zoom', $A.getCallback(function() {
                self.doZoom(component);
            }));
    },

    initZoomRect: function(component) {
        var networkState = this.getNetworkState(component);
        networkState.context.zoomRect = networkState.context.d3Svg.append("rect")
            .style("fill", "none")
            .style("pointer-events", "all")
            .call(networkState.context.zoom)
            .on("wheel.zoom", null);
    },

    initContainers: function(component) {
        var networkState = this.getNetworkState(component);
        networkState.context.linkContainer = networkState.context.networkContainer.append("g")
            .attr("class", "links");
        networkState.context.nodeContainer = networkState.context.networkContainer.append("g")
            .attr("class", "nodes");
    },

    // return care team member data
    getCareTeamMembers: function(component, initCall) {
        var id;
        var action;
        var self = this;
        var networkState = this.getNetworkState(component);
        if (component.get("v.careTeamByCaseId") === true) {
            // MCP : getting care team by case id.
            id = component.get("v.carePlanId");
            if ($A.util.isEmpty(id)) {
                if (networkState.config.debug) { console.log("can not get case id. network load will fail "); }
            }
            action = component.get("c.getCareTeamMembersByCaseId");
            action.setParams({
                "caseId": id
            });
        } else {
            action = component.get("c.getCareTeamMembersByContactId");
            id = component.get("v.patientId");
            if ($A.util.isEmpty(id)) {
                if (networkState.config.debug) { console.log("can not get contact id. network will failed "); }
            }
            action.setParams({
                "contactId": id
            });
        }
        action.setCallback(this, function(result) {
            var state = result.getState();
            var memberArray = result.getReturnValue();

            if (component.isValid() && state.toUpperCase() === "SUCCESS" && !$A.util.isEmpty(memberArray)) {
                self.processTeamMembers(component, memberArray, initCall);
            } else if (state.toUpperCase() === "ERROR") {
                var errors = result.getError();
                var errorMsg = "Unknown error";
                if (errors) {
                    $A.log("Errors", errors);
                    if (errors[0] && errors[0].message) {
                        errorMsg = errors[0].message;
                    }
                }
                component.set('v.hasPatient', false);
                self.showToast(component, { 'message': errorMsg }, true, 'error');
            } else {
                self.showToast(component, { 'message': $A.get("$Label.HealthCloudGA.Msg_Error_General") }, true, 'error');
            }
        });

        $A.enqueueAction(action);
    },

    processTeamMembers: function(component, memberArray, initCall) {
        var networkState = this.getNetworkState(component);
        var data = {
                nodes: [],
                links: []
            },
            patientIndex = -1;

        // Find the map with the patient
        for (var i = 0; i < memberArray.length; i++) {
            if (memberArray[i].isPatient == 'true') {
                patientIndex = i;
                if ($A.util.isEmpty(component.get("v.carePlanId"))) {
                    component.set("v.carePlanId", memberArray[i].parentId);
                }
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

        networkState.context.nodes = data.nodes;
        networkState.context.links = data.links;

        if (initCall) {
            // on initial call on component creation, create the nodes, and start the
            // simulation
            this.createNetworkAndSimulation(component);
        } else {
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
        var networkState = this.getNetworkState(component);
        var config = networkState.config;
        var forceSim = networkState.context.forceSim;

        // create the links
        this.createLinks(component);
        // create the base node elements that D3 will be acting on
        this.createNodes(component);

        // add the nodes and final forces to the D3 force simulation, start the sim
        forceSim.nodes(networkState.context.nodes)
            .force("external", isolate(d3.forceX(-networkState.context.width), function(d) {
                return d.isPatient !== 'true' && self.isExternal(d) }))
            .force("internal", isolate(d3.forceX(networkState.context.width), function(d) {
                return d.isPatient !== 'true' && !self.isExternal(d) }))
            .force("center", isolate(d3.forceCenter(0, 0), function(d) {
                return d.isPatient === 'true'; }))
            .alpha(networkState.config.forceSimAlpha)
            .alphaDecay(networkState.config.forceSimAlphaDecay)

        .on("tick", ticked)
            .on("end", function() {
                self.zoomFit(component, 350);
            });

        // add the links to the sim
        forceSim.force("link").links(networkState.context.links);

        // used by D3 to determine where each node & link should be placed on the field
        function ticked() {
            networkState.context.nodeElements.attr("transform", function(d) {
                return ("translate(" + d.x + "," + d.y + ")")
            });

            networkState.context.linkElements.attr("x1", function(d) {
                    return d.source.x + (config.careteamSize / 2); })
                .attr("y1", function(d) {
                    return d.source.y + (config.careteamSize / 2); })
                .attr("x2", function(d) {
                    return d.target.x + (config.patientSize / 2); })
                .attr("y2", function(d) {
                    return d.target.y + (config.patientSize / 2); });
        }

        // use to isolate forces to specific nodes
        function isolate(force, filter) {
            var initialize = force.initialize;
            force.initialize = function() { initialize.call(force, networkState.context.nodes.filter(filter)); };
            return force;
        }
    },

    zoomFit: function(component, zoomDuration) {
        var scalePaddingPercentage = 0.9;
        var networkState = this.getNetworkState(component);
        var bounds = networkState.context.networkContainer.node().getBBox();
        var width = bounds.width;
        var height = bounds.height;
        var midX = bounds.x + (width / 2);
        var midY = bounds.y + (height / 2);
        if (width == 0 || height == 0) return;
        var scale = (scalePaddingPercentage) / Math.max(width / networkState.context.width, height / networkState.context.height);
        var zoomX = (networkState.context.width / 2) - (scale * midX);
        var zoomY = (networkState.context.height / 2) - (scale * midY);

        if (scale < 1) {
            this.zoomTransition(component, zoomDuration, zoomX, zoomY, scale);
        } else {
            this.zoomTransition(component, 750, networkState.context.width / 2, networkState.context.height / 2, 1);
        }
    },

    restartSimulation: function(component) {
        var networkState = this.getNetworkState(component);
        // to refresh / reload the graph - stop the sim, reset the nodes & links
        // and restart the sim
        networkState.context.forceSim.stop();
        networkState.context.forceSim.nodes(networkState.context.nodes);
        networkState.context.forceSim.force("link").links(networkState.context.links);
        networkState.context.forceSim.alpha(networkState.config.forceSimAlpha).restart();

    },

    clickNodeAction: function(component, d) {
        this.progressLog(component, d);
        var clickEvent = component.getEvent("HcCareTeamEvent");

        clickEvent.setParams({
            "type": "NODECLICK",
            "message": "Id",
            "nodeObj": d
        });

        clickEvent.fire();
    },

    // add the clipPath circle masks for the node images to the main svg container
    drawCircleMasking: function(component, container) {
        var networkState = this.getNetworkState(component);
        var config = networkState.config;
        // preparing node masking
        container.append("clipPath")
            .attr("id", networkState.maskingNodeIds.patient)
            .append("circle")
            .attr("r", config.patientSize / 2)
            .attr('cx', config.patientSize / 2)
            .attr('cy', config.patientSize / 2);
        container.append("clipPath")
            .attr("id", networkState.maskingNodeIds.careTeam)
            .append("circle")
            .attr("r", config.careteamSize / 2)
            .attr('cx', config.careteamSize / 2)
            .attr('cy', config.careteamSize / 2);
    },

    createLinks: function(component) {
        var networkState = this.getNetworkState(component);
        // create the links that join the care team nodes to the patient nodes
        // based on the array context.links
        networkState.context.linkElements = networkState.context.linkContainer.selectAll('line')
            .data(networkState.context.links, function(d) {
                return d.source.id + "-" + d.target.id; });
        networkState.context.linkElements.exit().remove();
        // merge with existing linkElements, if any - this is necessary for reload
        networkState.context.linkElements = networkState.context.linkElements
            .enter().append("line").merge(networkState.context.linkElements);
    },

    createNodes: function(component) {
        var self = this;
        var networkState = this.getNetworkState(component);
        var config = networkState.config;

        // create the base node 'g' elements that D3 will be manipulating
        // based on the array context.nodes
        networkState.context.nodeElements = networkState.context.nodeContainer.selectAll('g')
            .data(networkState.context.nodes, function(d) {
                return d.id;
            });
        networkState.context.nodeElements.exit().remove();
        // merge with existing nodeElements, if any - this is necessary for reload
        networkState.context.nodeElements = networkState.context.nodeElements
            .enter()
            .append("g").merge(networkState.context.nodeElements);

        // now build out the dom elements further
        networkState.context.nodeElements
            .attr("class", function(d, index) {
                if (d.isPatient === 'true') return 'node health1-network-node--patient';
                if (self.isExternal(d)) return 'node health1-network-node--external';
                else return 'node health1-network-node--internal';
            })
            // assigning data index for each network node
            .attr("vis-data-index", function(d, index) {
                return index;
            });

        // add click for all nodes, add drag for care team members
        networkState.context.nodeElements
            .on("click", $A.getCallback(function(d) {
                if (d3.event.defaultPrevented) return;
                self.clickNodeAction(component, d);
            }));
        networkState.context.nodeElements.filter(function(d) {
                return d.isPatient !== 'true'; })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
            );

        function dragstarted(d) {
            if (!d3.event.active) {
                networkState.context.forceSim.alphaTarget(0.3).restart();
            }
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            if (d3.event.y <= (networkState.context.height / 2) - config.careteamSize) {
                d.fy = d3.event.y;
            }
        }

        function dragended(d) {
            if (!d3.event.active) {
                networkState.context.forceSim.alphaTarget(0);
            }
            d.fx = null;
            d.fy = null;
        }

        // append the member images to the base node
        networkState.context.nodeElements
            .append("svg:image")
            .attr("class", "health1-network-node--image")
            .attr("clip-path", function(d, index) {
                return d.isPatient === 'true' ? "url(#" + networkState.maskingNodeIds.patient + ")" : "url(#" + networkState.maskingNodeIds.careTeam + ")";
            })
            .attr("width", function(d) {
                return d.isPatient === 'true' ? config.patientSize + 'px' : config.careteamSize + 'px' })
            .attr("height", function(d) {
                return d.isPatient === 'true' ? config.patientSize + 'px' : config.careteamSize + 'px' })
            .attr("xlink:href", function(d) {
                return d.photoURL; });

        // append the text for the patient just to the patient node
        networkState.context.nodeElements.filter(function(d) {
                return d.isPatient === 'true'; })
            .append("text")
            .attr("dx", -config.nodeTextMargin)
            .attr("dy", config.patientNodeTextYOffset)
            .attr("text-anchor", "end")
            .text($A.get("$Label.HealthCloudGA.Text_External"));
        networkState.context.nodeElements.filter(function(d) {
                return d.isPatient === 'true'; })
            .append("text")
            .attr("dx", config.patientSize * 2)
            .attr("dy", config.patientNodeTextYOffset)
            .attr("text-anchor", "end")
            .text($A.get("$Label.HealthCloudGA.Text_Internal"));
        networkState.context.nodeElements.filter(function(d) {
                return d.isPatient === 'true'; })
            .append("text")
            .attr("class", "health1-network-nodetext--name")
            .attr("dx", config.patientSize / 2)
            .attr("dy", config.patientSize + (config.nodeTextMargin * 2))
            .attr("text-anchor", "middle")
            .text(function(d) {
                return d.name; });
        networkState.context.nodeElements.filter(function(d) {
                return d.isPatient === 'true'; })
            .append("text")
            .attr("class", "health1-network-nodetext--role")
            .attr("dx", config.patientSize / 2)
            .attr("dy", config.patientSize + (config.nodeTextMargin * 4))
            .attr("text-anchor", "middle")
            .text(function(d) {
                return d.role; });

        // append the care team names & roles to their nodes
        var careTeamNodeText = networkState.context.nodeElements.filter(function(d) {
                return d.isPatient !== 'true'; })
            .append("g")
            .attr("text-anchor", function(d) {
                return self.isExternal(d) ? "end" : "start";
            })
            .attr("transform", function(d) {
                return "translate(" + (self.isExternal(d) ? -config.nodeTextMargin : (config.careteamSize + config.nodeTextMargin)) + "," + (config.careteamSize / 2) + ")";
            });
        careTeamNodeText
            .append("text")
            .attr("class", "health1-network-nodetext--name")
            .text(function(d) {
                return d.name; });
        careTeamNodeText
            .append("text")
            .attr("class", "health1-network-nodetext--role")
            .attr("dy", "1em")
            .text(function(d) {
                return d.role; });

        // append the checkmarks to the care team nodes
        var checkedNodes = networkState.context.nodeElements.filter(function(d) {
            return (d.isPatient !== 'true' && self.isCheckedNode(component, d));
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
        var checkedPatientNode = networkState.context.nodeElements.filter(function(d) {
            return (d.isPatient === 'true' && self.isCheckedNode(component, d));
        });
        checkedPatientNode.append("circle")
            .attr("class", "health1-network-checkmark--circle")
            .attr("r", 13)
            .attr("cx", 0) //specific offsets for patient checkmarks
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
        if (d.isInternal == 'true' || (d.isCommunityLive == 'true' && d.isCommunityEnabled == true))
            return true;
        else
            return false;
    },

    // zoom when clicked
    // :: requires component reference and zoom direction value (in = 1, out = -1)
    zoomClick: function(component, zoom_direction) {
        var networkState = this.getNetworkState(component);
        var direction = zoom_direction || 1;
        var zoom = networkState.context.zoom;
        var factor = 0.4;
        var target_zoom = 1;
        var center = [networkState.context.width / 2, networkState.context.height / 2];
        var extent = zoom.scaleExtent();

        var transform = d3.zoomTransform(networkState.context.zoomRect.node());

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
        var networkState = this.getNetworkState(component);
        networkState.context.networkContainer.transition()
            .duration(zoom_duration)
            .attr("transform", "translate(" + zoom_x + "," + zoom_y + ")scale(" + zoom_scale + ")")
            .on("end", function() {
                networkState.context.zoomRect.call(networkState.context.zoom.transform, d3.zoomIdentity.translate(zoom_x, zoom_y).scale(zoom_scale));
            });
    },

    // // formerly eventZoom and manualZoom
    doZoom: function(component) {
        var networkState = this.getNetworkState(component);
        networkState.context.networkContainer.attr("transform", d3.event.transform);
    },

    windowResized: function(component) {
        var networkState = this.getNetworkState(component);
        // get new width & height
        var cmp = component.find('network').getElement();
        networkState.context.width = cmp.offsetWidth;
        networkState.context.height = cmp.offsetHeight;

        // set elements width & height
        this.setElementsWidthAndHeight(component);

        // recreate forceSim
        this.initForceSim(component);
        this.createNetworkAndSimulation(component);
    }
})