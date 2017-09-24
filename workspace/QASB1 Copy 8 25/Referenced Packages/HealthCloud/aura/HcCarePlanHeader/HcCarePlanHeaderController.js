/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCarePlanHeaderController, js front-end controller for HcCarePlanHeader component.
 * @since 198
 */
({
    doInit: function(component, event, helper) {
        if (component.get("v.showActionButton")) {
            helper.createComponent(component);
        }
    },

    expand: function(component, event, helper) {
        event.stopPropagation();
        component.set('v.expanded', !component.get('v.expanded'));
        /*
         * Generate Component Event indicating Expansion
         */
        var expandEvent = component.getEvent("HcCarePlanEvent");
        expandEvent.setParams({
            "type": "EXPAND"
        });
        expandEvent.fire();
    },

    refresh: function(component, event, helper) {
        event.stopPropagation();
        var parentHeaderId;
        if (event.getParam("sObjectName") == 'Task') {
            parentHeaderId = component.get("v.goalId");
        } else if (event.getParam("sObjectName") == 'CarePlanGoal__c') {
            parentHeaderId = component.get("v.problemId");
        }

        if ((!$A.util.isEmpty(event.getParam("oldParentId")) && event.getParam("oldParentId") == parentHeaderId)
            || (!$A.util.isEmpty(event.getParam("newParentId")) && event.getParam("newParentId") == parentHeaderId)) {
            var refreshEvent = component.getEvent("HcCarePlanEvent");
            refreshEvent.setParams({
                "type": "REFRESH"
            });
            refreshEvent.fire();
        }
    },

    carePlanHeaderCheckBoxMethod: function(component, event, helper) {
        helper.carePlanHeaderCheckBoxMethod(component, event);
    },

    checkBoxClicked: function(component, event, helper) {
        event.stopPropagation();
        var checkboxEvent = component.getEvent("HcCarePlanHeaderCheckBoxEvent");
        if (checkboxEvent != null) {
            var checked = component.find("checkbox").get("v.value");
            /*
             * Generate Component Event indicating that checkbox was clicked
             */
            checkboxEvent.setParams({
                "checked": checked,
            });
            checkboxEvent.fire();
        }
    },

})