/*
 * Copyright © 2016 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 *
 * @since 204
*/
({
	onInit: function(component, event, helper) {
		component.set("v.objectLabel", component.get("v.objectLabelMap")['CarePlanProblem__c']);
	},

	handleCarePlanEvent: function(component, event, helper) {
    helper.handleCarePlanEvent(component, event, helper);
  },

  checkboxEvent: function(component, event, helper) {
    helper.handleCheckBoxEvent(component, event, helper);
  },

  goalCheckboxEvent : function(component, event, helper) {
    helper.goalCheckboxEvent(component, event, helper);
  },
})