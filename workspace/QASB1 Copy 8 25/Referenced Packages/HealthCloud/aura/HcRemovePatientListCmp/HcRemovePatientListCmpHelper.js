/**
 * Copyright © 2017 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcRemovePatientListCmpHelper, helper class for HcRemovePatientListCmp Component.
 * @since 208
 */
({
    removePatientList: function(component, event, helper) {
        var self = this;
        var action = component.get("c.deleteFilterList");
        var id = component.get("v.filterId");
        var fName = component.get("v.filterName");
        action.setParams({
            "selectedViewId": id
        });
        action.setCallback(this, function(response) {
            var successMsg = HC.format($A.get("$Label.HealthCloudGA.Msg_Success_Filter_List_Delete"), fName);
            var returnMsg = response.getReturnValue();
            if (response.getState() === "SUCCESS" && returnMsg === "SUCCESS") {
                var closeEvent = $A.get("e.HealthCloudGA:HcComponentStatusEvent");
                // Ideally, we don't need to pass any filterId here, 
                // the event we are firing is expecting filterid though it not really being used there
                // we are just passing this filterId for the argument sake
                var filterId = "Id";
                var memberObj = {
                    'filterId': filterId
                };
                closeEvent.setParams({
                    "status": "SUCCESS",
                    "message": successMsg,
                    "memberObj": memberObj
                });
                // this event will be handled in HcPatientListViewController's handleComponentStatusEvent method
                closeEvent.fire();
            } else {
                var errorMessage = $A.get("$Label.HealthCloudGA.Msg_Failure_Filter_List_Delete");
                errorMessage = errorMessage.concat(returnMsg);
                var closeEvent = $A.get("e.HealthCloudGA:HcComponentStatusEvent");
                closeEvent.setParams({
                    "type": "ERROR",
                    "message": errorMessage,
                    "status":"ERROR",
                    "memberObj": memberObj
                });
                closeEvent.fire();
            }
        });
        $A.enqueueAction(action);
    }
})