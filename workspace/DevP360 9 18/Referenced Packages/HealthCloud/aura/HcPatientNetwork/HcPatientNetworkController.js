/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcPatientNetworkController, a js front-end controller for HcPatientNetwork component.
 * @since 198
 */
({
    doInit: function(component, event, helper) {
        // if (helper.config.debug) { console.log("Patient Network: Do init"); }
        helper.setPatientId(component);
    },

    initD3: function(component, event, helper) {
        if (helper.config.debug) { console.log('Patient Network: Initializing...'); }

        helper.initD3(component);

        if (helper.config.debug) { console.log('Patient Network: Initialized'); }
    },

    onZoomInClicked: function(component, event, helper) {
        helper.zoomClick(component, 1);
    },

    onZoomOutClicked: function(component, event, helper) {
        helper.zoomClick(component, -1);
    },

    onResetButtonClicked: function(component, event, helper) {
        helper.zoomFit(component,750);
    },

    onRefreshButtonClicked: function(component, event, helper) {
        helper.getCareTeamMembers(component, false);
    },

    handleRefreshEvent: function(component, event, helper) {
        if (event.getParam("type") == "REFRESH_NETWORK") {
            helper.getCareTeamMembers(component, false);
        }
    },

    onAddMemberClicked: function(component, event, helper) {
        var clickEvent = component.getEvent("HcCareTeamEvent");
        var caseId = helper.CASE_ID;

        clickEvent.setParams({
            "type": "AddMember",
            "message": caseId
        });

        clickEvent.fire();
    },

    onresize: function(component,event,helper){
        if (helper.context.networkContainer == null) return;
        helper.windowResized(component);
    }
})