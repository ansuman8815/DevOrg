/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCareTeamBaseController, controller class for HcCareTeamBase Component.
 * @since 196
 */
({
    doInit: function(component, event, helper) {
        component.set("v.userDateFormat",$A.get("$Locale.dateFormat"));
        component.set("v.userDateTimeFormat",$A.get("$Locale.datetimeFormat"));
        helper.getGlobalSettings(component, helper);
    },
    showDetailComponent: function(component, event, helper) {
        helper.showDetailComponent(component, event);
    },

    hideDetailComponent: function(component, event, helper) {
        helper.hideDetailComponent(component, event);
    },

    handleCareTeamDetailEvent: function(component, event, helper) {
        helper.handleCareTeamDetailEvent(component, event);
        event.stopPropagation();
    },

    resetModalComponent: function(component, event, helper) {
        helper.resetModalComponent(component, event);
    },

    handleComponentStatusEvent: function(component, event, helper) {
        if (event.getParam('status') == 'SUCCESS') {
            component.find('toast-message').set('v.content', {'type': 'success', 'message': event.getParam('message')});
        } else if (event.getParam('status') == 'WARNING')
            component.find('toast-message').set('v.content', {'type': 'warning', 'message': event.getParam('message')});
        else if (event.getParam('status') == 'ERROR')
            component.find('toast-message').set('v.content', {'type': 'error', 'message': event.getParam('message')});
    }
})