/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcPatientListViewController, js front-end controller for HcListViewDatatable component.
 * @since 198
 */
({
    init: function(component, event, helper) {
        // Retrieve view list once component is ready
        helper.getFilterSecurity(component);
        helper.retrieveViewListsWithSelected(component, true);
        component.set('v.startT', new Date().getTime());
    },

    onPatientsTableRefresh: function(component, event, helper) {
        var eventData = event.getParam('data');
        var eventType = eventData.type;
        if( eventType == 'DataFetch' )
        {
            helper.getPageCount(component);
        }
    },

    onViewSelected: function(component, event, helper) {
        // Invoke patient data fetch only when user manually switches views
        var isUserSetView = component.get("v.isUserSetView");
        if( isUserSetView )
        {
            if(component.get("v.selectedView") != null){
                component.set("v.showSpinner",true);
                //Check if filter condition does not have encrypted fields and populate data
                helper.getFilterConditionAccessAndPopulateData(component);
            }
            else{
                var patientsTable = component.find("PatientsTable");
                patientsTable.resetTable();
            }
        }
        else
        {
            // Enable patient data fetch for subsequent changes in view by the user
            component.set("v.isUserSetView", true);
        }
    },

    onSearchList: function(component, event, helper) {
        var searchText = event.getSource().get('v.value');
        helper.typeAheadDelayExecute(function() {
            component.find('PatientsTableDataProvider').set('v.searchTerm', searchText);
        });
    },

    onCreateListClicked: function(component, event, helper) {
        if (component.get("v.createList") == false) return;
        helper.promptFilterCriteriaModal(component, "");
    },

    onEditListClicked: function(component, event, helper) {
        if (component.get("v.selectedView") == null || component.get("v.editList") == false || component.get("v.editFilterRecord") == false) return;
        helper.promptFilterCriteriaModal(component, component.get("v.selectedView").Id);
    },

    onDeleteListClicked: function(component, event, helper) {
      if (component.get("v.selectedView") == null || component.get("v.deleteList") == false || component.get("v.deleteFilterRecord") == false) return;
           helper.promptDeletePatientListModal(component, component.get("v.selectedView").Id, component.get("v.selectedView").Name, component.get("v.selectedView").isOwner,component.get("v.selectedView").OwnerName);
    },

    onCreateTaskClicked: function(component, event, helper) {
        var selectedPatients = component.get('v.selectedPatients');
        if ( selectedPatients.length == 0) return;
        var ids = [];
        var mapAccountToCarePlan = {};
        for( var i = 0; i < selectedPatients.length; i++ )
        {
            var accountId = selectedPatients[i]['account__id'];
            ids.push( accountId );
            mapAccountToCarePlan[ accountId ] = selectedPatients[i]['account__careplan__c'] || null;
        }
        helper.promptCreateTaskModal(component, ids, mapAccountToCarePlan);
    },

    onRefreshClicked: function(component, event, helper) {
        helper.resetUI(component);
        var patientsTable = component.find("PatientsTable");
        patientsTable.set('v.showSpinner', true);
        helper.raiseDataFetchEvent(component);
    },

    handlePatientsTableActionEvent : function(component, event, helper) {
        var eventType = event.getParam('eventType');
        var eventSubType = event.getParam('eventSubType');
        var eventData = event.getParam('data');
        
        if( eventType == 'ACTION' )
        {
            helper.handlePatientsTableAction( component, eventSubType, eventData );
        }
    },

    handleComponentStatusEvent: function(component, event, helper) {
        component.set('v.modal', []);
        component.find('toast-message').set('v.content', {
            'type': event.getParam('status'),
            'message': event.getParam('message')
        });

        if (event.getParam('status').toLowerCase() === 'success' && event.getParam('memberObj') && event.getParam('memberObj').filterId) {
            helper.refreshListViews(component);
        }
    }
})