/*
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcTodayPageContainersController, js front-end controller for HcTodayPageContainers component
 * @since 200
 */
({
	// Initialize component on load
	doInit : function(component, event, helper) {
		// initialize each container type (overdue, due today, due tomorrow)
		helper.getPatientsWithTasksOverdue(component);
		helper.getPatientsWithTasksDueToday(component);
		helper.getPatientsWithTasksDueTomorrow(component);
		helper.getContainerDefaultShowCount(component);
		helper.getDefaultRecordOpenType(component);
	},

	// handle show all action for overdue tasks
	handleShowAllOverdue: function(component, event, helper) {
		helper.getPatientsWithTasksOverdue(component, true);
	},

	// handle show all action for overdue tasks
	handleShowAllDueToday: function(component, event, helper) {
		helper.getPatientsWithTasksDueToday(component, true);
	},

	// handle show all action for overdue tasks
	handleShowAllDueTomorrow: function(component, event, helper) {
		helper.getPatientsWithTasksDueTomorrow(component, true);
	},
})