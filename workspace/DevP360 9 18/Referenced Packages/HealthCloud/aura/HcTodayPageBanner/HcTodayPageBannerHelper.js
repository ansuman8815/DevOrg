/*
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcTodayPageBannerHelper, js front-end helper for HcTodayPageBanner component.
 * @since 200
 */
({
	// connect to server side controller to retrieve total patient count for user
	getUserPatientsTotal: function(component, helper) {
		var action = component.get("c.getTotalPatientCountForUser");

		action.setCallback(this, function(response) {
			var state = response.getState();

			if (component.isValid() && state === "SUCCESS") {
				// retrieve actual payload from response
				var payload = response.getReturnValue().objectData;
				var patientsTotal = payload.patientsTotal;

				component.set("v.userBannerData.patientsTotal", patientsTotal);
				component.set("v.pslAccesible",true);
			} else {
				helper.handleError(component, action.getError());
			}
		});
		$A.enqueueAction(action);
	},

	// connect to server side controller to retrieve new patient count for user
	getUserNewPatientsCount: function(component) {
		var action = component.get("c.getNewPatientCountForUser");

		action.setCallback(this, function(response) {
			var state = response.getState();

			if (component.isValid() && state === "SUCCESS") {
				// retrieve actual payload from response
				var payload = response.getReturnValue().objectData;
				var newPatientsCount = payload.patientsNew;

				component.set("v.userBannerData.patientsNew", newPatientsCount);
			} else {
				throw new Error($A.get("$Label.HealthCloudGA.Msg_Error_General"));
			}
		});

		$A.enqueueAction(action);
	},

	// connect to server side controller to retrieve task progress info for user
	getUserTaskProgressInfo: function(component) {
		var action = component.get("c.getTaskCountForUser");

		action.setCallback(this, function(response) {
			var state = response.getState();

			if (component.isValid() && state === "SUCCESS") {
				// retrieve actual payload from response
				var payload = response.getReturnValue().objectData;
				var taskProgress = {
					'total': payload.tasksTotal,
					'completed': payload.tasksCompleted,
					'percentCompleted': payload.tasksPercentCompleted
				}

				component.set("v.userBannerData.taskProgress", taskProgress);
			} else {
				throw new Error($A.get("$Label.HealthCloudGA.Msg_Error_General"));
			}
		});

		$A.enqueueAction(action);
	}
})