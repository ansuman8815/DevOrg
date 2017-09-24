/*
 * Copyright © 2016 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 *
 * @since 204
 */
({
    handleCarePlanEvent: function(component, event, helper) {
        if (event.getParam("type") === "EXPAND") {
            helper.expand(component, event, helper);
        }
    },

    expand: function(component, event, helper) {
        component.set('v.expanded', !component.get('v.expanded'));
    },

    handleCheckBoxEvent: function(component, event, helper) {
        var checked = event.getParam("checked");

        var goalComponent = component.find("carePlanTemplateGoal");
        if (!$A.util.isUndefinedOrNull(goalComponent)) {
            if (!$A.util.isArray(goalComponent)) {
                goalComponent = [goalComponent];
            }
            var len = goalComponent.length;
            for (var i = 0; i < len; i++) {
                goalComponent[i].problemCheckBoxClicked(checked);
            }
        }
        //Throw an event to let Customize component know about the Problem checkbox is changed
        var customizeCheckboxEvent = component.getEvent("customizeCheckboxEvent");
        if (customizeCheckboxEvent != null) {
            customizeCheckboxEvent.setParams({
                "checked": checked,
                "templateId": component.get("v.templateId"),
                "problemId": component.get("v.problemId")
            });
            customizeCheckboxEvent.fire();
        }
    },

    goalCheckboxEvent: function(component, event, helper) {
        var checked = event.getParam("checked");
        var goalId = event.getParam("goalId");
        var taskId = event.getParam("taskId");

        //if goal is checked check the Problem too, if Problem is not checked
        if (checked) {
            var problemHeader = component.find("problemHeader");
            if (!problemHeader.find("checkbox").get("v.value")) {
                problemHeader.carePlanHeaderCheckBoxMethod(checked);
            }
        }

        //Throw an event to let Customize component know about the Problem checkbox is changed
        var customizeCheckboxEvent = component.getEvent("customizeCheckboxEvent");
        if (customizeCheckboxEvent != null) {
            customizeCheckboxEvent.setParams({
                "checked": checked,
                "templateId": component.get("v.templateId"),
                "problemId": component.get("v.problemId"),
                "goalId": goalId,
                "taskId": taskId
            });
            customizeCheckboxEvent.fire();
        }
    }
})