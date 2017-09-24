/*
 * Copyright © 2016 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 *
 * @since 204
 */
({
    onInit: function(component, event, helper) {
      component.set("v.objectLabel", component.get("v.objectLabelMap")['CarePlanGoal__c']);
      component.set("v.taskObjectLabel", component.get("v.objectLabelMap")['Task']);
      
      helper.calculateDueDate(component, event, helper);
    },

    handleCarePlanEvent: function(component, event, helper) {
      helper.handleCarePlanEvent(component, event, helper);
    },

    checkboxEvent: function(component, event, helper) {
      helper.handleCheckBoxEvent(component, event, helper);
    },

    taskCheckboxEvent:function(component, event, helper) {
      helper.handleTaskCheckboxEvent(component, event, helper);
    },

    problemCheckBoxClicked: function(component, event, helper) {
      helper.problemCheckboxClicked(component, event);
    },

    // handle checkbox click
    onTaskCheckboxClicked : function(component, event, helper) {
      helper.onTaskCheckboxClicked(component, event);
    },
})