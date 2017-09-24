/*
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCommuityCareTeamListController
 * @since 208
 */

({
    onInit: function(component, event, helper) {
        // See if carePlanId has been passed to the component
        // (via dynamic creation, custom app, etc...)
        var carePlanIdOnInit = component.get("v.carePlanId");
        // Check for recordId (passed in when on record home page)
        var recordId = component.get("v.recordId");
        // Conceptually we should not have both of these populated,
        // but we will give precedence to passed in Id (carePlanIdOnInit)
        if (!$A.util.isUndefinedOrNull(recordId) && $A.util.isUndefinedOrNull(carePlanIdOnInit)) {
            carePlanIdOnInit = recordId;
            component.set("v.carePlanId", carePlanIdOnInit);
        }
        // load the care team members if we have a care plan Id
        if (!$A.util.isEmpty(carePlanIdOnInit)) {
            component.set("v.showSpinner", true);
            helper.loadMembers(component, event, helper);
        }
    },

    onCarePlanChange: function(component, event, helper) {
        var carePlanId = event.getParam("carePlanId");
        if (!$A.util.isUndefinedOrNull(carePlanId) && !(component.get("v.carePlanId") === carePlanId)) {
            component.set("v.carePlanId", carePlanId);
            component.set("v.showSpinner", true);
            helper.loadMembers(component, event, helper);
        }
    }
})