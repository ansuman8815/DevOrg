/*
+ * Copyright © 2015 salesforce.com, inc. All rights reserved.
+ * @copyright This document contains proprietary and confidential information and shall not be reproduced,
+ * transferred, or disclosed to others, without the prior written consent of Salesforce.
+ * @description controller to handle various functions.
+ * @since 196
*/
({
	doInit: function (component, event, helper) {
        helper.createComponent(component);
    },
    refreshValidationCheck: function(component, event, helper) {
        helper.refreshValidationCheck(component);    
    }
})