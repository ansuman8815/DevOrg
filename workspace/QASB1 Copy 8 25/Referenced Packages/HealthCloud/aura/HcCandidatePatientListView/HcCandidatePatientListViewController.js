/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @since 198
 */
({
    doInit: function(component, event, helper) {
        helper.doInit(component, helper);
        helper.getDefaultRecordOpenType(component, helper);
    },

    handleHcMessageCmpEvent: function(component, event, helper) {
        var evtType = event.getParam("type");

        if (evtType === helper.MESSAGE_TYPE_VIEW_SELECT) {
            helper.handleViewSelect(component, event);
        } else if (evtType === helper.MESSAGE_TYPE_ACTION_SELECT) {
            helper.handleSelectAction(component, event);
        }
    },

    handleComponentStatusEvent: function(component, event, helper) {

        // Check if this is our event (since HcComponentStatusEvent is an application event)
        var type = event.getParam('type');
        if (type && type === helper.MSG_TYPE_CAN_PAT_CONV) {
            component.set('v.modal', []);
            helper.showToast(component,{
                'message': event.getParam('message')
            },false,event.getParam('status'));

            if (event.getParam('status').toLowerCase() === 'success') {
                // Trigger refresh of the current list view
                helper.setView(component,helper.VIEW_ID_NOT_CONVERTED);
            }
        }
    }
})