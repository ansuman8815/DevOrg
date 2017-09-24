/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcHelpTrayDropDownHelper, helper file for HcHelpTrayDropDown controller.
 * @since 200
 */

({
	getHelpTrayData : function(component,helper) {
    if(component.get('v.loaded')){ return; }
		var action = component.get("c.getHelpTrayData");
		var self = this;
		var helpType = component.get("v.helpType");
		action.setParams({
				"helpTypeValue": helpType
		});
		action.setCallback(this, function(response) {
				var state = response.getState();
				var ObjArray = [];
				if (state === "SUCCESS") {
					var result = response.getReturnValue();
					for (var i = 0; i < result.length; i++) {
						result[i].value = helper.sanitizeUrl(result[i].value,'HcHelpTrayDropDown');
					}
					component.set("v.menuItems",result);
          component.set("v.loaded",true);
				}
				if (state === "ERROR") {
						var errors = response.getError();
						if (errors) {
								if (errors[0] && errors[0].message) {
									component.set('v.errorMsg', errors[0].message);
								}
						} else {
							component.set('v.errorMsg', "Unknown error");
						}
				}
		});
		$A.enqueueAction(action);
	}
})