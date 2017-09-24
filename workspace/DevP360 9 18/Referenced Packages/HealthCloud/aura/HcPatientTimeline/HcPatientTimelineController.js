/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcPatientTimelineController, js front-end controller for HcPatientTimeline component.
 * @since 198
 */
({
    initD3: function(component, event, helper) {
      if(helper.config.debug) { console.log('Timeline: Initializing...'); }
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
            helper.context.timeline.filter = function(d) {
                return component.get('v.filter').indexOf(d['objectId']) != -1;
            };
            helper.context.timeline.redraw();
            helper.removeFilteredData(component);
        }
    },

    handleChange: function(component, event, helper) {
      if(helper.config.debug) { console.log('Timeline: [handleChange]...'); }
      helper.updateTimeRange(component);
    },
})