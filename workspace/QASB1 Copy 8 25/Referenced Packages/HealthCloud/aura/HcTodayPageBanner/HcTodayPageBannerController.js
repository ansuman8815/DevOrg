/*
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcTodayPageBannerController, js front-end controller for HcTodayPageBanner component
 * @since 200
 */
({
	// Initialize component on load
	doInit : function(component, event, helper) {
		// set today's date
		var todayDate = new Date();
		component.set('v.today', todayDate.getFullYear() + "-" + (todayDate.getMonth()+1) + "-" + todayDate.getDate());

		var dateFormatString = component.get('v.dateFormatString');
		if( !$A.util.isEmpty(dateFormatString) )
		{
			dateFormatString = dateFormatString.replace('MMM','MMMM');
			if( dateFormatString.indexOf('dd') == -1 )
			{
				dateFormatString = dateFormatString.replace('d','dd');
			}
		}
		else
		{
			dateFormatString = "MMMM dd, yyyy";
		}
		component.set('v.dateFormatString', dateFormatString);

		// initialize patients data object/map to return to the component
		// :: default to zero to avoid jumping content
		var userBannerData = {
			'patientsTotal': 0,
			'patientsNew': 0,
			'taskProgress': {
				'total': 0,
				'completed': 0,
				'percentCompleted': 0
			}
		};

		// set the initial values in the component
		component.set('v.userBannerData', userBannerData);

		// retrieve and set user's total patient count
		helper.getUserPatientsTotal(component, helper);
	},

	processCounts: function(component, event, helper) {
		var pslAccesible = component.get("v.pslAccesible");
		if(pslAccesible){
			// retrieve and set user's new patient count
			helper.getUserNewPatientsCount(component);

			// retrieve and set user's task progress info
			helper.getUserTaskProgressInfo(component);
		}
	}
})