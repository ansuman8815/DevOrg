/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCareTeamBaseController, controller class for HcCareTeamBase Component.
 * @since 196
 */
({
    doInit: function(component, event, helper) {
        component.set("v.userDateFormat", $A.get("$Locale.dateFormat"));
        component.set("v.userDateTimeFormat", $A.get("$Locale.datetimeFormat"));
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
        var messageBody = {
            message: event.getParam('message')
        };
        var stat = event.getParam('status');
        if( $A.util.isUndefinedOrNull( stat ) ){
            console.error('Event parameter status not passed.');
        }
        else{
            stat = stat.toLowerCase();
        }
        helper.showToast(component, messageBody, true, stat);
    }
})