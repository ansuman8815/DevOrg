/*
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcTodayPageContainersHelper, js front-end helper for HcTodayPageContainers component
 * @since 200
 */
({
	// connect to server side controller to retrieve patients with tasks overdue
	// :: fetchAll(Boolean), defines whether we're fetching only the first few or all results
	getPatientsWithTasksOverdue: function(component, fetchAll) {
		var fetchAll = fetchAll || false;

		var action = component.get("c.getOpenTasksOverdue");
		action.setParams({
			"isRetrieveAll": fetchAll
		});

		action.setCallback(this, function(response) {
			var state = response.getState();

			if (component.isValid() && state === "SUCCESS") {
				// retrieve actual payload from response
				var payload = response.getReturnValue().objectData;
				component.set("v.patientsWithTasksOverdue", payload);
			} else {
				this.handleError(component, action.getError());
			}
		});

		$A.enqueueAction(action);
	},

	getDefaultRecordOpenType: function(component){
		var self = this;
		var action = component.get("c.getDefaultRecordOpenType");
		action.setCallback(this, function(response) {
				if (action.getState() === "SUCCESS") {
					component.set("v.defRecOpenType",response.getReturnValue())
				}
				else{
					$A.log("Error from server-side:");
					$A.log(action.getState());
				}
		});
		$A.enqueueAction(action);
	},

	// connect to server side controller to retrieve patients with tasks due today
	// :: fetchAll(Boolean), defines whether we're fetching only the first few or all results
	getPatientsWithTasksDueToday: function(component, fetchAll) {
		var fetchAll = fetchAll || false;

		var action = component.get("c.getOpenTasksDueToday");
		action.setParams({
			"isRetrieveAll": fetchAll
		});

		action.setCallback(this, function(response) {
			var state = response.getState();

			if (component.isValid() && state === "SUCCESS") {
				// retrieve actual payload from response
				var payload = response.getReturnValue().objectData;
				component.set("v.patientsWithTasksDueToday", payload);
			} else {
				throw new Error($A.get("$Label.HealthCloudGA.Msg_Error_General"));
			}
		});

		$A.enqueueAction(action);
	},

	// connect to server side controller to retrieve patients with tasks due tomorrow
	// :: fetchAll(Boolean), defines whether we're fetching only the first few or all results
	getPatientsWithTasksDueTomorrow: function(component, fetchAll) {
		var fetchAll = fetchAll || false;

		var action = component.get("c.getOpenTasksDueTomorrow");
		action.setParams({
			"isRetrieveAll": fetchAll
		});

		action.setCallback(this, function(response) {
			var state = response.getState();

			if (component.isValid() && state === "SUCCESS") {
				// retrieve actual payload from response
				var payload = response.getReturnValue().objectData;
				component.set("v.patientsWithTasksDueTomorrow", payload);
			} else {
				throw new Error($A.get("$Label.HealthCloudGA.Msg_Error_General"));
			}
		});

		$A.enqueueAction(action);
	},

	// connect to server side controller to retrieve default container show count constant
	getContainerDefaultShowCount: function(component) {
		var action = component.get("c.getContainerDefaultShowCount");

		action.setCallback(this, function(response) {
			var state = response.getState();

			if (component.isValid() && state === "SUCCESS") {
				// retrieve actual payload from response
				var payload = response.getReturnValue().objectData;
				component.set("v.containerDefaultShowCount", payload.containerDefaultShowCount);
			} else {
				throw new Error($A.get("$Label.HealthCloudGA.Msg_Error_General"));
			}
		});

		$A.enqueueAction(action);
	}
})