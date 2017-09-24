/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcPatientTimelineController, js front-end controller for HcPatientTimeline component.
 * @since 198
 */
({
    doInit : function(component, event, helper) {
      helper.initComponentState( component );
    },

    initD3: function(component, event, helper) {
      var timelineState = helper.getTimelineState( component );
      if(timelineState && timelineState.config.debug) { console.log('Timeline: Initializing...'); }
      component.set("v.userDateFormat",$A.get("$Locale.dateFormat"));
      component.set("v.userDateTimeFormat",$A.get("$Locale.datetimeFormat"));
      helper.fetchCategoryMap(component,event);
    },

    onresize: function(component, event, helper) {
        helper.windowResized(component);
    },

    filterClicked: function(component, event, helper) {
        var selectedId = event.getParam("selectedId");
        if(!$A.util.isUndefinedOrNull(selectedId)){
            helper.invokeRpcOnChange(component,selectedId);
        } else{
            var timelineState = helper.getTimelineState( component );
            var filters = component.get('v.filters');
            var filterFunction = function(d) {
                return filters.indexOf(d.objectId) !== -1;
            };
            timelineState.context.timeline.filter = filterFunction;
            timelineState.context.timeline.redraw();
            timelineState.context.minimap.filter = filterFunction;
            timelineState.context.minimap.redraw();
            helper.removeFilteredData(component);
        }
    },

    handleChange: function(component, event, helper) {
      var timelineState = helper.getTimelineState( component );
      if(timelineState && timelineState.config.debug) { console.log('Timeline: [handleChange]...'); }
      helper.updateTimeRange(component);
    },

    handleDestroy: function(component, event, helper) {
      helper.removeTimelineState( component );
    }
})