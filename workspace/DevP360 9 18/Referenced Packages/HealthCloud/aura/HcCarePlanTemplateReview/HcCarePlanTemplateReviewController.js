/*
 * Copyright © 2016 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 *
 * @since 204
*/
({
	onInit: function(component, event, helper) {
        helper.populateGlobalSettings(component, event, helper);
    },
    
	commitData : function(component, event, helper) {
		helper.commitData(component);
	},

	reset : function(component, event, helper) {
		component.set("v.selectedCarePlanTemplatesFromCustomize", []);
	}
})