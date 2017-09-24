/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCareTeamAddMemberController, controller class for HcCareTeamAddMember Component.
 * @since 196
 */
({
    doInit: function(component, event, helper) {
        helper.getGlobalSettingsAndInit(component);
    },

    finishButtonClicked: function(component, event, helper) {
        helper.finishButtonClicked(component, event);
    },

    handleComponentStatusEvent: function(component, event, helper) {
        var type = event.getParam('type');
        var selObj = event.getParam('memberObj');
        if (type == 'AddMemberSelected')
            component.set("v.selectedObj", selObj);
    },

    handleKeyPress: function(component, event, helper) {
        helper.resetValidation(component);
        if (event.keyCode === 13) {
            helper.searchUsers(component, event);
        }
    },

    handleSearchClick: function(component, event, helper) {
        helper.searchUsers(component, event);
    },

    quickAddMember: function(component, event, helper) {
        helper.quickAddMember(component, event);
    },

    backButtonClicked: function(component, event, helper) {
        helper.backButtonClicked(component, event);
    },

    handleSelectionChange: function(component, event, helper) {
        if (component.find("community-checkbox")) {
            component.find("community-checkbox").set("v.value", false);
        }
    }

})