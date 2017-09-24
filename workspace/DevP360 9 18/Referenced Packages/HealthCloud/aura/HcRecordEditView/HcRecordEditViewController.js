/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcRecordEditViewController, controller class for HcRecordEditView Component.
 * @since 196
 */
({
	doInit : function(component, event, helper) {
		helper.getFields(component, helper);
	},
    
    onSave : function(component, event, helper) {
        helper.onSave(component, helper);
    }
})