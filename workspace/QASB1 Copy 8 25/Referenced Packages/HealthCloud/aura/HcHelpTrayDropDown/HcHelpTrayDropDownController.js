/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcHelpTrayDropDownController, controller class for HcHelpTrayDropDown Component.
 * @since 200
 */

({
	showItems : function(component, event, helper) {
		helper.getHelpTrayData(component,helper);
	}
})