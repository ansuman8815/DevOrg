/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCareTeamEnablCommCmp Component
 * @since 196
 */
({

    onSubmit: function(component, event, helper) {
        var self = this;
        var action = component.get("c.validateAndEnablePortalUser");
        var member = component.get("v.memberObj");

        action.setParams({
            "contactId": member.memberId,
            "carePlanId": member.parentId
        });
        action.setCallback(this, function(response) {
            component.set("v.isAddButtonDisabled", "true");
            component.set("v.buttonLabel", "Close");
            var returnMsg = response.getReturnValue();
            var msg;
            if (response.getState() === "SUCCESS") {
                component.set("v.contentMessage", returnMsg);
                msg = $A.get("$Label.HealthCloudGA.Msg_Success_Add_Member_To_Community");
                $A.get("e.HealthCloudGA:HcComponentStatusEvent").setParams({
                    status: "SUCCESS",
                    message: msg,
                    memberObj: {
                        carePlanId: member.parentId
                    }
                }).fire();
            } else {
                component.set("v.contentMessage", returnMsg);
                var errors = [];
                response.getError().forEach(function (error){
                    errors.push(error.message);
                });
                msg = errors.join(' ');
                $A.get("e.HealthCloudGA:HcComponentStatusEvent").setParams({
                    status: "ERROR",
                    message: msg,
                    memberObj: {
                        carePlanId: member.parentId
                    }
                }).fire();
            }
            var modalEvent = component.getEvent("HcCareTeamEvent");
                modalEvent.setParams({
                    "type": "REMOVEMODAL",
                    "message": msg
                });
                modalEvent.fire();

        });
        $A.enqueueAction(action);
    }
})