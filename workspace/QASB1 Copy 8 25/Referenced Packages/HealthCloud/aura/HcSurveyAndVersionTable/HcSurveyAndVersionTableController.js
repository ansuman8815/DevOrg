/* * Copyright © 2017 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description Survey and Version Table
 * @since 210.
*/
({
	doInit: function(component, event, helper) {
		component.set("v.showSpinner", true);
    },

    handleSearchChange: function(component, event, helper) {
        component.set("v.showSpinner",true);
    	helper.getInitialData(component, event, helper);
    }
})