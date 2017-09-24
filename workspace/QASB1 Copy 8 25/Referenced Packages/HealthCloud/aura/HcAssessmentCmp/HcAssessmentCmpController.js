/* * Copyright © 2017 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcAssessment Component
 * @since 210.
*/
({
	doInit: function(component, event, helper) {
		helper.isSurveyEnabled(component);
	},

	handleActive: function(component, event, helper) {
    	helper.handleActive(component, event);
    }
})