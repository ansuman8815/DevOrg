/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcPatientTimelineHelper, js front-end helper for HcPatientTimeline component.
 * @since 198
 */
({
    SVG_URL: "http://www.w3.org/2000/svg",
    MINIMAP_AXIS_WIDTH_OFFSET: 512,
    MINIMAP_AXIS_TICK_SPACING: 131, // 128 + 3

    timelineStates: {},

    initComponentState: function( component ) {
        var componentGlobalId = component.getGlobalId();
        var nodeIdPrefix = 'hc_' + componentGlobalId.replace(/:/g,'_').replace(/;/g,'_');
        component.set('v.nodeIdPrefix', nodeIdPrefix);
        this.timelineStates[componentGlobalId] = {
            nodeIds: {
                timeline: nodeIdPrefix + 'health1-timeline',
                timelineAxis: nodeIdPrefix + 'health1-timeline-axis',
                timelineTooltip: nodeIdPrefix + 'health1-timeline-tooltip',
                minimap: nodeIdPrefix + 'health1-minimap',
                minimapAxis: nodeIdPrefix + 'health1-minimap-axis'
            },
            config: {
                "debug": false                 // boolean: show or hide debug console messages
            },
            CURRENT_INDEX: null,
            RECORDS_AVAILABLE: false,
            START_DATE: null,
            END_DATE: null,
            RECORDS_RESPONSE_STORE: [],
            context: {
                "data": null,                 // raw data, use data.entries to access the entries
                "timeline": null,             // timeline object
                "timelineAxis": null,         // timeline axis object
                "timelineLabel": null,        // timeline label axis object
                "tooltip": null,              // tooltip object
                "minimap": null,              // minimap object
                "minimapAxis": null,          // minimap axis object
                "brush": null,                // brush object
                "brushing": false,            // boolean: is the brush doing anything or not?
                "timelineLayout": null,       // timeline HTML element (D3 object)
                "timelineAxisLayout": null,   // timeline axis HTML element (D3 object)
                "tooltipLayout": null,        // tooltip HTML element (D3 object)
                "minimapLayout": null,        // minimap HTML element (D3 object)
                "minimapAxisLayout": null     // minimap axis HTML element (D3 object)
            }
        };
    },

    getTimelineState: function( component ) {
        return this.timelineStates[ component.getGlobalId() ];
    },

    removeTimelineState: function( component ) {
        delete this.timelineStates[ component.getGlobalId() ];
    },

    handleConsoleTabFocusIn: function( component ) {
        var timelineState = this.getTimelineState( component );
        var minimapAxisTicks = document.querySelectorAll('#'+timelineState.nodeIds.minimapAxis+' g.axis g.tick');
        if( minimapAxisTicks.length == 0 ) {
            component.set("v.userDateFormat",$A.get("$Locale.dateFormat"));
            component.set("v.userDateTimeFormat",$A.get("$Locale.datetimeFormat"));
            this.initComponentState(component);
            this.removeSvgElements(component);
            this.createSvgElements(component);
            this.initD3(component);
        }
    },

    fetchCategoryMap: function(component) {
        var self = this;
        var timelineState = this.getTimelineState( component );
        var filterCategories = [];
        var action = component.get("c.getTimelineViewMenu");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var returnMap = response.getReturnValue();
                var keys = Object.keys(returnMap);
                keys.sort();
                for (var i = 0; i < keys.length; i++) {
                    var eachCat = new Object();
                    eachCat.key = self.getLocalizedLabel(keys[i]);
                    var idNameMap = returnMap[keys[i]];
                    var innerKeys = Object.keys(idNameMap);
                    innerKeys.sort();
                    var innerObjArray = [];
                    for (var j = 0; j < innerKeys.length; j++) {
                        var eachItem = new Object();
                        eachItem.id = self.getLocalizedLabel(innerKeys[j]);
                        var selected = idNameMap[innerKeys[j]].isDefault;
                        if(selected){
                            timelineState.RECORDS_AVAILABLE = true;
                            component.get("v.filters").push(innerKeys[j]);
                        }
                        eachItem.friendlyName = self.getLocalizedLabel(idNameMap[innerKeys[j]].friendlyName);
                        eachItem.selected = selected;
                        innerObjArray.push(eachItem);
                    }
                    //inner map ends
                    eachCat.lValue = innerObjArray;
                    filterCategories.push(eachCat);
                }
                component.set("v.filterCategories", filterCategories);
                if(filterCategories.length == 0 || !timelineState.RECORDS_AVAILABLE){
                    self.toggleSpinner(false,component);
                    // handle failure and exceptions
                    var errorMsg = $A.get("$Label.HealthCloudGA.Msg_Timeline_NoConfigRecords");
                    self.showToastMessage(component,errorMsg);
                    if (timelineState.config.debug) { console.log('Timeline: Error in fetchCategoryMap'); }
                }
                self.removeSvgElements(component);
                self.createSvgElements(component);
                self.initD3(component);
            }
            else {
                self.handleError(component, action.getError());
            }

        });
        $A.enqueueAction(action);
    },

    removeSvgElements: function(component) {
        var timelineState = this.getTimelineState( component );
        if(timelineState.config.debug) { console.log('Timeline: Begin removeSvgElements...'); }

        var removeElementBySelector = function( selector ) {
            var elem = document.querySelector(selector);
            if(elem) {
                elem.parentElement.removeChild(elem);
            }
        };

        removeElementBySelector('#'+timelineState.nodeIds.timeline+' > svg');   
        removeElementBySelector('#'+timelineState.nodeIds.timelineAxis+' > svg');
        removeElementBySelector('#'+timelineState.nodeIds.minimap+' > svg');    
        removeElementBySelector('#'+timelineState.nodeIds.minimapAxis+' > svg');
    },

    // Create skeleton timeline code
    createSvgElements: function(component) {
        var timelineState = this.getTimelineState( component );
        if(timelineState.config.debug) { console.log('Timeline: Begin createSvgElements...'); }

        // fetch HTML elements
        var timeline = document.getElementById(timelineState.nodeIds.timeline);
        var timelineSvg = document.createElementNS(this.SVG_URL, "svg");
        var g = document.createElementNS(this.SVG_URL, "g");
        g.setAttribute('class', 'timeline');
        timelineSvg.appendChild(g);
        timeline.appendChild(timelineSvg);

        var timelineAxis = document.getElementById(timelineState.nodeIds.timelineAxis);
        var timelineAxisSvg = document.createElementNS(this.SVG_URL, "svg");
        timelineAxis.appendChild(timelineAxisSvg);

        var minimap = document.getElementById(timelineState.nodeIds.minimap);
        var minimapSvg = document.createElementNS(this.SVG_URL, "svg");
        var minimapOffsetWidth = Math.max(0, minimap.offsetWidth - 2);
        // Appending brush element
        var brush = document.createElementNS(this.SVG_URL, "g");
        brush.setAttribute('class', 'x brush');
        brush.setAttribute('transform', 'translate(0,-1)');
        var g = document.createElementNS(this.SVG_URL, "g");
        g.appendChild(brush);
        g.setAttribute('class', 'minimap');
        minimapSvg.appendChild(g);
        minimap.appendChild(minimapSvg);

        var minimapAxis = document.getElementById(timelineState.nodeIds.minimapAxis);
        var minimapAxisSvg = document.createElementNS(this.SVG_URL, "svg");
        minimapAxis.appendChild(minimapAxisSvg);

        if(timelineState.config.debug) { console.log('Timeline: End of createSvgElements...'); }

    },

    // initialize D3 functionality
    initD3: function(component) {
        var patientId = component.get('v.patientId');
        if (patientId == null) {
            return;
        }
        var timelineState = this.getTimelineState( component );
        
        // Initialize d3 selection for each component in timeline
        timelineState.context.timelineLayout = d3.select('#'+timelineState.nodeIds.timeline+' > svg');
        timelineState.context.timelineAxisLayout = d3.select('#'+timelineState.nodeIds.timelineAxis+' > svg');
        timelineState.context.minimapLayout = d3.select('#'+timelineState.nodeIds.minimap+' > svg');
        timelineState.context.minimapAxisLayout = d3.select('#'+timelineState.nodeIds.minimapAxis+' > svg');
        timelineState.context.tooltipLayout = d3.select('#'+timelineState.nodeIds.timelineTooltip);

        //initialize timeline with no data
        timelineState.context.data = this.processRawData(component, []);
        this.timeline(component);

        timelineState.CURRENT_INDEX = 0;
        this.invokeRpcDataBackground(component);
    },

    invokeRpcDataBackground: function(component){
        var self = this;
        var timelineState = this.getTimelineState( component );
        var patientId = component.get('v.patientId');
        var filters = component.get("v.filters");
        timelineState.RECORDS_RESPONSE_STORE = [];
        component.set("v.currentIndex",0);
        for(var i=0;i<filters.length;i++){
            this.toggleSpinner(true,component);
            this.rpcCall(
                // rpcCall param #1
                component.get("c.getTimelineViewData"),
                // rpcCall param #2
                {
                    "contactId": patientId,
                    "configRecordId":filters[i]
                },
                function(result){
                    component.set("v.currentIndex",component.get("v.currentIndex") + 1);
                    if(result.getReturnValue() != null && result.getState() === "SUCCESS"){
                        if (timelineState.RECORDS_RESPONSE_STORE.length==0){
                            timelineState.RECORDS_RESPONSE_STORE = result.getReturnValue();
                        }
                        else{
                            timelineState.RECORDS_RESPONSE_STORE = timelineState.RECORDS_RESPONSE_STORE.concat(result.getReturnValue());
                        }

                        if(component.get("v.currentIndex") == component.get("v.filters").length){
                            timelineState.context.data = self.processRawData(component, timelineState.RECORDS_RESPONSE_STORE);
                            self.timeline(component);
                            self.tooltips(component);
                            timelineState.context.timeline.redraw();
                            self.redrawD3(component);
                            self.toggleSpinner(false,component);
                        }
                    }
                    else{
                        self.toggleSpinner(false,component);
                    }
                },true
            );
        }
    },

    invokeRpcData: function(component,configRecordId){
        if($A.util.isUndefinedOrNull(configRecordId)){
            this.toggleSpinner(false,component);
            return false;
        }
        var self = this;
        var timelineState = this.getTimelineState( component );
        var patientId = component.get("v.patientId");
        var filters = component.get("v.filters");
        timelineState.RECORDS_AVAILABLE = true;
        this.toggleSpinner(true,component);
        this.rpcCall(
            // rpcCall param #1
            component.get("c.getTimelineViewData"),
            // rpcCall param #2
            {
                "contactId": patientId,
                "configRecordId":configRecordId
            },
            // rpcCall param #3

            function(result) {
                if (result != undefined &&
                    result.getReturnValue() != null &&
                    result.getState() === "SUCCESS") {
                    timelineState.context.data = self.processRawData(component, result.getReturnValue());
                    self.timeline(component);
                    self.tooltips(component);
                    timelineState.context.timeline.redraw();
                    timelineState.CURRENT_INDEX = timelineState.CURRENT_INDEX + 1;
                    if(timelineState.CURRENT_INDEX < filters.length){
                        self.invokeRpcData(component,filters[timelineState.CURRENT_INDEX]);
                    }
                    else{
                        self.redrawD3(component);
                    }
                }
                else{
                    self.toggleSpinner(false,component);
                }
            }
        );
    },

    invokeRpcOnChange: function(component, configRecordId){
        var self = this;
        var timelineState = this.getTimelineState( component );
        var patientId = component.get('v.patientId');
        if($A.util.isUndefinedOrNull(configRecordId)) {
            this.toggleSpinner(false,component);
            return false;
        }
        if(!timelineState.RECORDS_AVAILABLE) {
            this.invokeRpcData(component,configRecordId);
        }
        else {
            this.toggleSpinner(true,component);
            this.rpcCall(
                // rpcCall param #1
                component.get("c.getTimelineViewData"),
                // rpcCall param #2
                {
                    "contactId": patientId,
                    "configRecordId":configRecordId
                },
                // rpcCall param #3

                function(result) {
                    if (result != undefined &&
                        result.getReturnValue() != null &&
                        result.getState() === "SUCCESS") {
                        // process raw data
                        if(timelineState.config.debug) { console.log('Timeline: Processing raw data...'); }
                        timelineState.context.data = self.processRawData(component, result.getReturnValue());
                        self.timeline(component);
                        timelineState.context.timeline.redraw();
                        self.minimap(component);
                        timelineState.context.minimap.redraw();
                        var miniAxisConfig = {
                            tickFormat: function(date) {
                                return self.getUserLocalizedDate(date,component.get("v.userDateFormat"));
                            },
                            ticks: (Math.round((timelineState.context.timeline.width - 512) / 128 + 3))
                        };
                        var miniAxisConfigDestroy = {
                            tickFormat: function(date) {
                                return self.getUserLocalizedDate(date,component.get("v.userDateFormat"));
                            },
                            ticks: 0
                        };
                        self.axis(component, 'minimap', 'minimapAxisLayout', miniAxisConfigDestroy, 'minimapAxis');
                        if(timelineState.config.debug) { console.log('Timeline: Minimap axis...'); }
                        self.axis(component, 'minimap', 'minimapAxisLayout', miniAxisConfig, 'minimapAxis');

                        if(timelineState.config.debug) { console.log('Timeline: Brush...'); }
                        self.brush(component);
                        self.d3MoveTo(component);
                        component.set("v.loadingEntity","");
                        self.toggleSpinner(false,component);
                    } else {
                        // TODO: handle failure and exceptions
                        if (timelineState.config.debug) { console.log('Timeline: RPC error'); }
                        self.toggleSpinner(false,component);
                    }
                }
            );
        }
    },

    redrawD3: function(component){
        var self = this;
        var timelineState = this.getTimelineState( component );
        var filters = component.get("v.filters");
        this.toggleSpinner(true,component);
        if(timelineState.config.debug) { console.log('Timeline: Processing raw data...'); }
        // Initialize timeline components
        if(timelineState.config.debug) { console.log('Timeline: Initializing timeline components...'); }
        this.timeline(component);
        if(timelineState.config.debug) { console.log('Timeline: Tooltips...'); }
        this.tooltips(component);
        timelineState.context.timeline.redraw();
        // Axis config
        var axisConfig = {
            tickFormat: function(date) {
                return self.getUserLocalizedDate(date,component.get("v.userDateFormat"));
            },
            innerTickSize: -timelineState.context.timeline.height,
            translate: [0, timelineState.context.timeline.height]
        };

        // Timeline label config
        var labelConfig = {
            tickFormat: function(date) {
                return self.getUserLocalizedDate(date,component.get("v.userDateFormat"));
            },
            innerTickSize: 0,
            tickPadding: 10,
            ticks: 6
        };

        if(timelineState.config.debug) { console.log('Timeline: Timeline axis...'); }
        this.axis(component, 'timeline', 'timelineLayout', axisConfig, 'timelineAxis');

        if(timelineState.config.debug) { console.log('Timeline: Timeline label...'); }
        this.axis(component, 'timeline', 'timelineAxisLayout', labelConfig, 'timelineLabel');

        if(timelineState.config.debug) { console.log('Timeline: Minimap...'); }
        this.minimap(component);
        timelineState.context.minimap.redraw();
        // Minimap axis config
        var miniAxisConfig = {
            tickFormat: function(date) {
                return self.getUserLocalizedDate(date,component.get("v.userDateFormat"));
            },
            ticks: (Math.round((timelineState.context.timeline.width - this.MINIMAP_AXIS_WIDTH_OFFSET) / this.MINIMAP_AXIS_TICK_SPACING))
        };
        if(timelineState.config.debug) { console.log('Timeline: Minimap axis...'); }
        this.axis(component, 'minimap', 'minimapAxisLayout', miniAxisConfig, 'minimapAxis');

        if(timelineState.config.debug) { console.log('Timeline: Brush...'); }
        this.brush(component);
        this.d3MoveTo(component);
        this.toggleSpinner(false,component);
    },

    d3MoveTo : function(component){
        var timelineState = this.getTimelineState( component );
        // sets brush on initial load 15days past to 15days in future
        // use getDate and setDate to calculate start and end dates for brush
        var todayDate = new Date();
        var startDate = new Date().setDate(todayDate.getDate() - 15);
        timelineState.context.brush.moveTo(startDate, new Date().setDate(todayDate.getDate() + 15));
    },

    timeline: function(component) {
        var self = this;
        var timelineState = this.getTimelineState( component );
        var layout = timelineState.context.timelineLayout;
        var timeline = layout.select('g.timeline');
        var rawData = timelineState.context.data;
        var timelineHTMLObj = component.find('timeline').getElement();
        var layoutNodeOffsetWidth = timelineHTMLObj.offsetWidth;
        var layoutNodeOffsetHeight = timelineHTMLObj.offsetHeight;

        timeline.xScale = d3.scaleTime()
            .domain(rawData.requestRange)
            .range([0,layoutNodeOffsetWidth]);

        timeline.recordActions = []; // storage space for record actions (timeline elements [tasks/goals/etc])
        timeline.width = layoutNodeOffsetWidth;
        timeline.height = layoutNodeOffsetHeight;

        timeline.yScale = function(track) {
            return track * 25 * 1 + (track + 1) * 5;
        };

        timeline.filter = function(d) {
            return true;
        };

        timeline.redraw = function(domain) {
            if (domain) timeline.xScale.domain(domain);

            /****************************************************
             ************* Layout records vertically ************
             ****************************************************/
            var tracks = [];
            var unitInterval = (timeline.xScale.domain()[1] - timeline.xScale.domain()[0]) / timeline.width;

            // timeline displays data in selected time range so applying brush filter and control filter.
            var data = timelineState.context.data.entries.filter(function(d) {
                d.endTime = new Date(d.time.getTime() + unitInterval * (d.label.length * 8 + 58));
                return timeline.xScale.domain()[0] < d.endTime && d.time < timeline.xScale.domain()[1];
            }).filter(timeline.filter);
            // sorting displaying data in default time order.
            data.sort(self.sortByValue('time'));

            // calculating vertical layout for displaying data
            data.forEach(function(entry) {
                for (var i = 0, track = 0; i < tracks.length; i++, track++) {
                    if (entry.time > tracks[i]) break;
                }
                entry.track = track;
                tracks[track] = entry.endTime;
            });

            // width changes when window resized
            timeline.width = timeline.xScale.range()[1];
            timeline.height = Math.max(timeline.yScale(tracks.length), (timelineHTMLObj.offsetHeight - 1));

            /****************************************************
             ************* Drawing timeline records *************
             ****************************************************/

            //timeline.selectAll('.aaa');
            timeline.data = timeline.selectAll('[class~=health1-timeline-record]')

                .data(data, function(d) {
                    return d.id
                })
                .attr('transform', function(d) {
                    return 'translate(' + timeline.xScale(d.time) + ',' + timeline.yScale(d.track) + ')';
                });

            timeline.records = timeline.data
                .enter().append('g')
                .attr('class', 'health1-timeline-record')
                .attr('transform', function(d) {
                    return 'translate(' + timeline.xScale(d.time) + ',' + timeline.yScale(d.track) + ')';
                });

            self.appendTimelineRecordElement(timeline.records);

            // attach every record action on each displaying record
            timeline.recordActions.forEach(function(action) {
                timeline.records.on(action[0], action[1]);
            });

            timeline.data.exit().remove();
        };

        timelineState.context.timeline = timeline;
    },

    minimap: function(component) {
        var self = this;
        var timelineState = this.getTimelineState( component );
        var rawData = timelineState.context.data;
        var layout = timelineState.context.minimapLayout;
        var minimap = layout.select('g.minimap');
        var minimapHTMLObj = component.find('minimap').getElement();
        var centerDate = new Date();
        var requestRangeBEGIN = Math.min(new Date(centerDate).setDate(centerDate.getDate() - 16), rawData.requestRange[0]);
        var requestRangeEND = Math.max(new Date(centerDate).setDate(centerDate.getDate() + 16), rawData.requestRange[1]);
        requestRangeBEGIN = !isNaN(requestRangeBEGIN) ? requestRangeBEGIN : rawData.START_DATE;
        requestRangeEND = !isNaN(requestRangeEND) ? requestRangeEND : rawData.END_DATE;
        var minimapRange = [new Date(requestRangeBEGIN), new Date(requestRangeEND)];

        minimap.xScale = d3.scaleTime()
            .domain(minimapRange)
            .range([0, minimapHTMLObj.offsetWidth]);

        minimap.yScale = function(track) {
            return Math.min(track, 7) * 4 + 4;
        };

        minimap.filter = function(d) {
            return true;
        };

        minimap.width = minimapHTMLObj.offsetWidth;
        minimap.height = minimapHTMLObj.offsetHeight;

        minimap.redraw = function() {
            /****************************************************
             ************* Layout records vertically ************
             ****************************************************/
            var tracks = [];
            var unitInterval = ( minimap.xScale.domain()[1] - minimap.xScale.domain()[0] ) / minimap.width;

            // minimap displays data in all time range so only applying control filter.
            var data = timelineState.context.data.entries.filter(function(d) {
                d.endTime = new Date(d.time.getTime() + unitInterval * 10);
                return true;
            }).filter(minimap.filter);

            // sorting displaying data in default time order.
            data.sort(self.sortByValue('time'));

            // calculating vertical layout for displaying data
            data.forEach(function(entry) {
                for (var i = 0, track = 0; i < tracks.length; i++, track++) {
                    if (entry.time > tracks[i]) break;
                }
                entry.track = track;
                tracks[track] = entry.endTime;
            });

            // width changes when window resized
            minimap.width = minimap.xScale.range()[1];

            /****************************************************
             ************* Drawing timeline records *************
             ****************************************************/
            minimap.data = minimap.selectAll('[class~=health1-minimap-record]')
                .data(data, function(d) {
                    return d.id
                })
                .attr('transform', function(d) {
                    return 'translate(' + minimap.xScale(d.time) + ',' + minimap.yScale(d.track) + ')';
                });

            minimap.records = minimap.data
                .enter().append('g')
                .attr('class', 'health1-minimap-record')
                .attr('transform', function(d) {
                    return 'translate(' + minimap.xScale(d.time) + ',' + minimap.yScale(d.track) + ')';
                });

            self.appendMinimapRecordElement(minimap.records);

            minimap.data.exit().remove();

        };

        timelineState.context.minimap = minimap;
    },

    // Timeline component Axis object
    axis: function(component, svgObjectName, layoutName, config, xAxisName) {
        var self = this;
        var timelineState = this.getTimelineState( component );
        var svgObject = timelineState.context[svgObjectName];
        let layout = timelineState.context[layoutName];
        layout.selectAll(".tick").filter(function (d) {
            return d;
        }).remove();
        var isConfigured = (!$A.util.isUndefinedOrNull(config));

        var axis = d3.axisBottom(svgObject.xScale).ticks(6);

        if (isConfigured && typeof config.tickFormat === 'function') {
            axis = axis.tickFormat(config.tickFormat);
        } else {
            axis = axis.tickFormat(function(date) {
                return self.getUserLocalizedDate(date,component.get("v.userDateFormat"));
            });
        }

        if (isConfigured && typeof config.innerTickSize === 'number') {
            axis = axis.tickSizeInner(config.innerTickSize);
        }
        if (isConfigured && typeof config.tickPadding === 'number') {
            axis = axis.tickPadding(config.tickPadding);
        }
        if (isConfigured && typeof config.ticks === 'number') {
            axis = axis.ticks(config.ticks);
        }

        if (isConfigured && config.tickValues !== undefined) {
            axis = axis.tickValues(config.tickValues);
        }
        // insert axis with tick as background
        var xAxis = layout.select('g.axis');
        if( xAxis.size() == 0 ) {
            xAxis = layout.insert('g', ':first-child')
                .attr('class', 'axis')
        }
        xAxis.call(axis);

        let axisPath = xAxis.select('path')
            .attr('fill','none');

        xAxis.setInnerTickSize = function (innerTickSize) {
            if (isConfigured && !$A.util.isUndefinedOrNull(innerTickSize)){
                config.innerTickSize = innerTickSize;
            }
        };

        xAxis.setTicks = function (ticks) {
            if (isConfigured && !$A.util.isUndefinedOrNull(ticks)){
                config.ticks = ticks;
            }
        };

        xAxis.redraw = function() {
            // Dynamically update and render axis positioning based on associated timeline
            if (isConfigured && typeof config.innerTickSize === 'number') {
                axis = axis.tickSizeInner(config.innerTickSize);
            }
            if (isConfigured && config.tickValues !== undefined) {
                axis = axis.tickValues(config.tickValues);
            }
            if (isConfigured && typeof config.ticks === 'number') {
                axis = axis.ticks(config.ticks);
            }
            if (isConfigured && typeof config.translate === 'object') {
                xAxis.attr('transform', function() {
                    return 'translate(' + config.translate[0] + ',' + svgObject.height + ')';
                });
            }
            xAxis.call(axis);
        };

        timelineState.context[xAxisName] = xAxis;
    },

    tooltips: function(component) {
        var self = this;
        var timelineState = this.getTimelineState( component );
        var tooltip = {};
        var timeline = timelineState.context.timeline;
        var layout = timelineState.context.tooltipLayout;
        var cacheHoverData = {};

        tooltip.calculateTooltipPosition = function(mouseEvent, hoveredElement) {
            var tooltipCoordinates = {
                x: mouseEvent.offsetX,
                y: mouseEvent.offsetY
            }
            // When possible, get the position of the hovered element and use that to place the tooltip
            if( !$A.util.isUndefinedOrNull( hoveredElement ) ) {
                var positionTransform = hoveredElement.getAttribute('transform');
                var translatePropertyMatch = positionTransform && positionTransform.match(/translate\((.*)\)/);
                if( !$A.util.isUndefinedOrNull( translatePropertyMatch[1] ) ) {
                    let elementCoordinates = translatePropertyMatch[1].split(',');
                    tooltipCoordinates.x = elementCoordinates[0];
                    tooltipCoordinates.y = parseFloat(elementCoordinates[1]) + hoveredElement.getBBox().height;
                }
            }
            return tooltipCoordinates;
        };

        /* delay function responsible for delaying the popup appearance for some time */
        tooltip.delayTooltip = function(itemDetail, recordIndex, hoveredTimelineRecords) {
            var hoveredTimelineRecord = hoveredTimelineRecords.length > 0 ? hoveredTimelineRecords[recordIndex] : null;
            var tooltipCoordinates = tooltip.calculateTooltipPosition(d3.event, hoveredTimelineRecord);
            // currently we have added 500 milliseconds wait time, which means the popup appears only if the user hovers on the item for atleast 500 ms
            this.hoverTimeout = setTimeout(tooltip.showTooltip.bind(this), 500, itemDetail, tooltipCoordinates);
        };

        tooltip.showTooltip = function(itemDetail, tooltipCoordinates) {
            var hoverData = [];
            var cachedData = cacheHoverData[itemDetail['recordId']];
            // checking if the data is present in cache
            if($A.util.isUndefinedOrNull(cachedData)){
                var action = component.get("c.getTimelineViewDataOnHover");
                action.setParams({
                    configId: itemDetail['objectId'],
                    recordId: itemDetail['recordId']
                });
                // callback function to make a backend call to fetch hover data
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS" && !$A.util.isUndefinedOrNull(response.getReturnValue())) {
                        var returnVal = response.getReturnValue();
                        var keys = Object.keys(returnVal);
                        if( keys.length === 0){
                            var a = new Object();
                                a.key = itemDetail['objFriendlyName'];
                                a.value = itemDetail['detailFieldValue'];
                                hoverData.push(a);
                                // storing data into cache variable
                                cacheHoverData[itemDetail['recordId']] = hoverData;
                        }
                        else{
                            for (var i = 0; i < keys.length; i++) {
                                // we don't want to show Id on the hover, so filtering it out
                                if(keys[i] !== 'Id'){
                                    var a = new Object();
                                    a.key= keys[i];
                                    a.value=returnVal[keys[i]];
                                    hoverData.push(a);
                                }
                            }
                            // storing data into cache variable
                            cacheHoverData[returnVal['Id']] = hoverData;
                        }
                        component.set('v.tooltipLowerInfo', hoverData);
                    }
                    else{
                        component.set('v.tooltipLowerInfo', response.getReturnValue());
                    }
                    tooltip.drawHover(tooltipCoordinates.x, tooltipCoordinates.y);
                });
                action.setBackground();
                $A.enqueueAction(action);
            }
            else{
                // getting data from cache
                hoverData = cachedData;
                component.set('v.tooltipLowerInfo', hoverData);
                tooltip.drawHover(tooltipCoordinates.x, tooltipCoordinates.y);
            }
            var tooltipUpper = itemDetail['positionFieldName'] + ': ' +self.getUserLocalizedDateTime(itemDetail['time'],component.get("v.userDateTimeFormat"));
            // HTML encoding causes issues since page markup has no charset meta tag
            component.set('v.tooltipUpperInfo', tooltipUpper);
        };

        /* function to open up record in a new subtab when user clicks on the item on Timeline */
        tooltip.openRecord = function(itemDetail){
            var tabHeader = itemDetail['detailFieldValue'];
            if ($A.util.isUndefinedOrNull(tabHeader)){
                tabHeader = $A.get("$Label.HealthCloudGA.Timeline_View_Item_Record_Detail");
            }
            HC.openRecordSubTab(itemDetail['recordId'], tabHeader);
        };
        tooltip.hideTooltip = function(d) {
            // resetting the timer here
            clearTimeout(this.hoverTimeout);
            layout.style('visibility', 'hidden');
        };
        /* function to calculate the coordinates and draw the hover */
        tooltip.drawHover = function( tooltipX, tooltipY ){
            layout.style('top', tooltipY + 'px')
                  .style('left', tooltipX + 'px')
                  .style('visibility', 'visible');
        };
        tooltip.redraw = function() {
            timeline.recordActions.push(['mouseover', tooltip.delayTooltip]);
            timeline.recordActions.push(['click', tooltip.openRecord]);
            timeline.recordActions.push(['mouseout', tooltip.hideTooltip]);
        };

        tooltip.redraw();
    },

    brush: function(component) {
        var self = this;
        var timelineState = this.getTimelineState( component );
        var timeline = timelineState.context.timeline;
        var tooltip = timelineState.context.tooltip;
        var timelineAxis = timelineState.context.timelineAxis;
        var timelineLabel = timelineState.context.timelineLabel;
        var minimap = timelineState.context.minimap;
        var xBrush = minimap.select('g.brush');

        var brush = d3.brushX()
            .extent([[minimap.xScale.range()[0],0],[minimap.xScale.range()[1],minimap.height]])
            .on('brush end', $A.getCallback(  function(){
                let brushRange = d3.event.selection || minimap.xScale.range();
                let brushDomain = brushRange.map(minimap.xScale.invert, minimap.xScale);

                if (brushRange==null) {
                    handle.attr("display", "none");
                } else {
                    handle.attr("display", null).attr("transform", function(d, i) {return "translate(" + (brushRange[i] - 3.5) + ",13) scale(0.05)"; });
                }

                timeline.redraw(brushDomain);
                timelineAxis.redraw();
                timelineLabel.redraw();

                // Updating values in input controls
                timelineState.context.brushing = true;
                component.set('v.timeRangeStart', moment(brushDomain[0]).format("YYYY-MM-DD"));
                component.set('v.timeRangeDays', moment(brushDomain[1]).diff(moment(brushDomain[0]), 'days'));
                timelineState.context.brushing = false;
            }));

        // programatically set brush on minimap and animate it
        // TODO: validating input

        xBrush.moveTo = function(start, end) {
            xBrush.transition().call(brush.move, [minimap.xScale(start), minimap.xScale(end)]);
        };

        xBrush.call(brush);

        // set up brush handles - remove any that have already been drawn first (e.g. when timeline is initially drawn
        // as a background tab, and then receives focus and is re-drawn)
        xBrush.selectAll(".handle--custom").remove();

        var handle = xBrush.selectAll(".handle--custom")
            .data([{type: "w"}, {type: "e"}])
            .enter().append("path")
            .attr("class", "handle--custom")
            .attr("fill", "#98C3EE")
            .attr("fill-opacity", 0.8)
            .attr("stroke", "#598DC9")
            .attr("stroke-width", 1.5)
            .attr("cursor", "ew-resize")
            .attr("d","M71,1.1L71,1.1C32.2,1.1,0.5,32.8,0.5,71.6v117.8c0,38.8,31.7,70.5,70.5,70.5h0c38.8,0,70.5-31.7,70.5-70.5V71.6C141.5,32.8,109.8,1.1,71,1.1z M51,188.9c-8.8,0-16-7.2-16-16s7.2-16,16-16s16,7.2,16,16S59.8,188.9,51,188.9z M51,147.9c-8.8,0-16-7.2-16-16s7.2-16,16-16s16,7.2,16,16S59.8,147.9,51,147.9z M51,106.9c-8.8,0-16-7.2-16-16s7.2-16,16-16s16,7.2,16,16S59.8,106.9,51,106.9z M92,188.9c-8.8,0-16-7.2-16-16s7.2-16,16-16s16,7.2,16,16S100.8,188.9,92,188.9z M92,147.9c-8.8,0-16-7.2-16-16s7.2-16,16-16s16,7.2,16,16S100.8,147.9,92,147.9z M92,106.9c-8.8,0-16-7.2-16-16s7.2-16,16-16s16,7.2,16,16S100.8,106.9,92,106.9z")
            .attr('transform', 'translate(-3.5,13) scale(0.05)');

        xBrush.brush = brush;

        timelineState.context.brush = xBrush;
    },

    processRawData: function(component, entries) {
        var self = this;
        var timelineState = this.getTimelineState( component );
        if ($A.util.isUndefinedOrNull(timelineState.context.data)){
            timelineState.context.data = {};
        }
        var data = timelineState.context.data;
        entries.forEach(function(element, index, array) {
            element.id = element['Id'];
            element.label = element['detailFieldValue'].length <= 16 ? element['detailFieldValue'] : element['detailFieldValue'].slice(0, 16) + '...';
            element.time = moment(element['positionFieldValue'], 'YYYY-MM-DD HH:mm:ss').toDate(); /*Not shown front end*/
            element.objFriendlyName = self.getLocalizedLabel(element['objFriendlyName']);
            element.objectId = element['objectId'];
            element.recordId = element['Id'];
        });
        if(data.entries == undefined) data.entries = entries;
        else data.entries = data.entries.concat(entries);
        data.minTime = d3.min(entries, function(d) {
            return d.time;
        });
        data.maxTime = d3.max(entries, function(d) {
            return d.time;
        });
        var thisStartDate = moment(data.minTime).subtract(1, 'months').toDate();
        var thisEndDate = moment(data.maxTime).add(1, 'months').toDate()
        var startDate;
        var endDate;
        if(data.START_DATE == null && data.END_DATE == null){
            data.START_DATE = thisStartDate;
            data.END_DATE = thisEndDate;
        }
        if(data.START_DATE < thisStartDate){
            startDate = data.START_DATE;
        }
        else if(data.START_DATE > thisStartDate || data.START_DATE == thisStartDate){
            startDate = thisStartDate;
            data.START_DATE = thisStartDate;
        }
        if(data.END_DATE > thisEndDate){
            endDate = data.END_DATE
        }
        else if(data.END_DATE < thisEndDate || data.END_DATE == thisEndDate){
            endDate = thisEndDate;
            data.END_DATE = thisEndDate;
        }
        data.requestRange = [startDate,endDate];
        return data;
    },

    // Append functions
    appendTimelineRecordElement: function(records) {
        var self = this;
        records.append('circle')
            .attr('class', 'health1-timeline-icon-wrap')
            .attr('cx', 24 / 2)
            .attr('cy', 24 / 2)
            .attr('r', 24 / 2);
        records.append('image')
            .attr('x', 6)
            .attr('y', 6)
            .attr('height', 12)
            .attr('width', 12)
            .attr('xlink:href', function(d) {
                return self.sanitize(d.imageURL);
            });
        records.append('rect')
            .attr('class', 'health1-timeline-record-wrap')
            .attr('x', 24 + 8)
            .attr('y', 0)
            .attr('width', function(d) {
                return d.label.length * 8 + 24;
            })
            .attr('height', 24)
            .attr('rx', 24 / 2)
            .attr('ry', 24 / 2);
        records.append('line')
            .attr('class', 'health1-timeline-record-line')
            .attr('x1', 24).attr('y1', 12)
            .attr('x2', 24 + 8).attr('y2', 12);
        records.append('text')
            .attr("class", 'health1-timeline-record-label')
            .attr('textLength', function(d) {
                return d.label.length * 8;
            })
            .attr('x', 24 + 8 + 12)
            .attr('y', 16)
            .attr('font-size', 12)
            .text(function(d) {
                return d.label;
            });
        return records;
    },

    appendMinimapRecordElement: function(records) {
        records.append('circle')
            .attr('cx', 2)
            .attr('cy', 2)
            .attr('r', 1.5)
            .attr('fill', '#98C3EE');
    },

    /**
     *  windowsResized event will trigger re-rendering of timeline and its associated components
     */
    windowResized: function(component) {
        var timelineState = this.getTimelineState( component );
        if (timelineState.config.debug) { console.log('Timeline: [windowResized]...'); }

        if (timelineState.context.timeline) {
            var wrapperOffsetWidth = Math.max(0, component.find('timeline-wrapper').getElement().offsetWidth - 2);
            timelineState.context.timeline.xScale.range([0, wrapperOffsetWidth]);
            timelineState.context.timeline.redraw();
            // height may be different, so reset
            timelineState.context.timelineAxis.setInnerTickSize(-timelineState.context.timeline.height);
            timelineState.context.timelineAxis.redraw();

            timelineState.context.minimap.xScale.range([0, Math.max(component.find('timeline-wrapper').getElement().offsetWidth - 52, 0)]);
            timelineState.context.minimap.redraw();
            // width may be different, so reset
            timelineState.context.minimapAxis.setTicks(Math.round((timelineState.context.timeline.width - this.MINIMAP_AXIS_WIDTH_OFFSET) / this.MINIMAP_AXIS_TICK_SPACING));
            timelineState.context.minimapAxis.redraw();

            //recreate the selector brush entirely
            this.brush(component);

            // kick off the update of the timeline
            this.updateTimeRange(component);
        }
    },

    // update timeline date range
    updateTimeRange: function(component) {
        var timelineState = this.getTimelineState( component );
        // retrieve input values
        // time range start field
        var fieldTimeRangeStart = component.get('v.timeRangeStart');
        // days to show field
        var fieldDaysToShow = component.get('v.timeRangeDays');

        //  parse values into usable types
        var startTime = $A.localizationService.parseDateTime(fieldTimeRangeStart, 'YYYY-MM-DD');
        var daysRange = parseInt(fieldDaysToShow);
         // if we have bad values do nothing
        if (isNaN(startTime) || $A.util.isUndefinedOrNull(startTime)||isNaN(daysRange) || $A.util.isUndefinedOrNull(daysRange)|| daysRange <= 0) {
            return;
        }
        var startDate = moment(startTime).format('YYYY-MM-DD');
        
        if (timelineState.config.debug) { console.log('Timeline: [updateTimeRange] – Field values: Start date = ' + startDate + ', Days = ' + daysRange); }

        // simple validation on inputs
        if (timelineState.context.brushing) return;

        // never go beyond 365 days
        if (daysRange > 365) daysRange = 365;

        // move the brush to its new location
        timelineState.context.brush.moveTo(startTime, new Date(startTime).setDate(startTime.getDate() + daysRange));

        if (timelineState.config.debug) { console.log('Timeline: [updateTimeRange] – Brush moved to: Start = ' + startDate + ', End = ' + moment(new Date(startTime).setDate(startTime.getDate() + daysRange)).format('YYYY-MM-DD') ); }
    },

    showToastMessage: function(component,errorMsg){
        this.showToast(component, {message: errorMsg}, true, 'warning');
    },

    removeFilteredData: function(component){
        var timelineState = this.getTimelineState( component );
        var data = timelineState.context.data;
        let filter = component.get('v.filters');
        for(let i = data.entries.length - 1; i >= 0; i--) {
            if(filter.indexOf(data.entries[i].objectId) === -1) {
                data.entries.splice(i, 1);
            }
        }
    }
})