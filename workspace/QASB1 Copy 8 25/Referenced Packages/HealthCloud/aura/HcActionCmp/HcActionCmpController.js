/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcActionCmpController, js front-end controller for HcAction component.
 * @since 198
 */
({
    handleCreate: function(component, event, helper) {
        //Calling application event
        var appEvent = $A.get("e.HealthCloudGA:HcCarePlanCmpEvent");
        appEvent.setParams({ 
            "type":component.get("v.createId"),
            "carePlanId":component.get("v.carePlanId"),
            "problemId":component.get("v.problemId"),
            "goalId":component.get("v.goalId")
                           });
        appEvent.fire();
    },
    handleEdit: function(component, event, helper) {
        var appEvent = $A.get("e.HealthCloudGA:HcCarePlanCmpEvent");
        // set some data for the event (also known as event shape)
        appEvent.setParams({ 
            "type":component.get("v.editId"),
            "carePlanId":component.get("v.carePlanId"),
            "problemId":component.get("v.problemId"),
            "goalId":component.get("v.goalId")
                           });
        appEvent.fire();
    }
})