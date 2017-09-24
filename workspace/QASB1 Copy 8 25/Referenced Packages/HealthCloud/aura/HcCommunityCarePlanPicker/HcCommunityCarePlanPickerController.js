/*
 * Copyright © 2016 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @since 208
 */
({
	doInit : function(component, event, helper) {
        var careplans = component.get("v.carePlans");
        if($A.util.isEmpty(careplans)){
			helper.getCarePlans(component, event);
        } // else care plans are already provided to the component, no need to fetch
        
        // assign the placeholder text for the care plan picker
        helper.assignDefaults(component, event);
	},

	onSelectChange : function(component, event, helper) {
		helper.firePlanChangedEvent(component, event);
	},

	handleRouteChangeEvent : function(component, event, helper) {
		helper.firePlanChangedEvent(component, event);
	},
})