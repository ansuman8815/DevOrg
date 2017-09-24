/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcGenericListView component: a configurable, reusable, container component for building
 * list UIs which allow the selection of multiple list views, and actions that can be applied to the
 * list items;
 * @since 198
 */
({
    onViewSelected: function(component, event, helper) {
        var oldValue = event.getParam("oldValue");

        // Don't fire event the first time selectedView is set
        //  (because most likely it is being initialized by a parent, not set by user)
        if (!oldValue) {
            return;
        }

        helper.loadView(component);

        component.find('datagrid').clearSelection();
    },

    selectActionClicked: function(component, event, helper) {
        var actionName = event.getParam('value');
        var msgEvent = component.getEvent("HcMessageCmpEvent");

        msgEvent.setParams({
            "type": helper.MESSAGE_TYPE_ACTION_SELECT,
            "payload": {
                "actionName": actionName
            }
        });
        msgEvent.fire();
    },

    onSearchList: function(component, event, helper) {
        var searchText = event.getSource().get('v.value');
        helper.typeAheadDelayExecute(function() {
            component.find('CandidatePatientDataProvider').set('v.searchTerm', searchText);
        });
    },

    handleRefreshClick: function(component, event, helper) {
        helper.loadView(component);
    },

    handleComponentStatusEvent: function(component, event, helper) {
        component.set('v.modal', []);
        component.find('toast-message').set('v.content', {
            'type': event.getParam('status'),
            'message': event.getParam('message')
        });

        if (event.getParam('status').toLowerCase() === 'success') {
            helper.retrieveViewListsWithSelected(component, event.getParam('memberObj').filterId);
        }
    },

    handleDataChange: function(component, event, helper){
        var eventData = event.getParam('data');
        helper.setListMeta(component, eventData);
    },

    handleSelectedChange: function(component, event,helper) {
        var selected = component.get('v.selectedItems');

        var menu = component.find('selectActionMenu');
        var hasSelected = false;
        if (!$A.util.isEmpty(selected) && selected.length>0){
            hasSelected = true;
        }
        menu.set('v.disabled', !hasSelected);
    }
})