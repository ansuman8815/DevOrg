/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCareTeamDetailCmpController, controller class for HcCareTeamDetail Component.
 * @since 196
 */
({

    doInit: function(component, event, helper) {
        helper.populateGlobalSettings(component, event, helper);
        var memberObj = component.get("v.memberObj");
        if(!$A.util.isEmpty(memberObj) && !$A.util.isEmpty(memberObj.photoURL)){
            helper.onClick(component, event, helper);
        }
        
    },
    
    handleMemberChange: function(component, event, helper) {
        helper.onClick(component, event, helper);
    },

    handleRemoveClick: function(component, event, helper) {
        var removeEvent = component.getEvent("HcCareTeamEvent");
        removeEvent.setParams({
            "type": "REMOVE",
            "message": "Care team member remove",
            "nodeObj": component.get("v.memberObj")
        });
        removeEvent.fire();
    },

    handleCancelClick: function(component, event, helper) {
        var closeEvent = component.getEvent("HcCareTeamEvent");
        closeEvent.setParams({
            "type": "CANCEL",
            "message": "Care team detail component cancel"
        });
        closeEvent.fire();
    },

    handleCreateTask: function(component, event, helper) {
        var taskEvent = component.getEvent("HcCareTeamEvent");
        taskEvent.setParams({
            "type": "TASK",
            "message": "Care team member create task"
        });
        taskEvent.fire();
    },

    handleEditContact: function(component, event, helper) {
        var taskEvent = component.getEvent("HcCareTeamEvent");
        taskEvent.setParams({
            "type": "EditContact",
            "message": "Care team Edit contact Id"
        });
        taskEvent.fire();
    },

    handleEnableCommunity: function(component, event, helper) {
        console.log("handleEnableCommunity");
        var enableCommEvent = component.getEvent("HcCareTeamEvent");
        enableCommEvent.setParams({
            "type": "EnableCommunity",
            "message": "Care team member Enable Community"
        });
        enableCommEvent.fire();
    },

    handleCall: function(component, event, helper) {
        //TODO 1. Handle placing a call action by integrating with CTI functionality
    },

    handleDirectMessage: function(component, event, helper) {
        // Pop-up will be displayed where direct chatter message can
        //be sent to the member. Additional members can be added to the direct message;
        console.log("handleDirectMessage");
        var msgEvent = component.getEvent("HcCareTeamEvent");
        msgEvent.setParams({
            "type": "DirectMessage",
            "message": "Send Direct Message to a care team Memeber"
        });
        msgEvent.fire();
    }
})