/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCareTeamRemoveModalCmpHelper, helper class for HcCareTeamRemoveModalCmp Component.
 * @since 196
 */
({
    removeMember: function(component, event, helper) {
        var self = this;
        var action = component.get("c.removeMember");
        var member = component.get("v.memberObj");
        action.setParams({
            "caseMemberId": member.id
        });
        action.setCallback(this, function(response) {
            var returnMsg = response.getReturnValue();
            var removeEvent = component.getEvent("HcCareTeamEvent");
            var msg;
            if (response.getState() === "SUCCESS") {
                msg = $A.get("$Label.HealthCloudGA.Msg_Success_Remove_Member");
                $A.get("e.HealthCloudGA:HcComponentStatusEvent").setParams({
                    status: "SUCCESS",
                    message: msg,
                    memberObj: {
                        carePlanId: member.parentId
                    }
                }).fire();
            } else {
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
            removeEvent.setParams({
                "type": "REMOVEMODAL",
                "message": msg
            });
            removeEvent.fire();
        });
        $A.enqueueAction(action);
    }
})