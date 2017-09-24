/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcPatientListViewHelper, js front-end helper for HcPatientListView component.
 * @since 198
 */
({
    retrieveViewListsWithSelected: function(component, isFirstFetch) {
        var self = this;
        // Initialize server rpc call to "getViews" method in "PatientListViewController"
        var rpc = component.get("c.getViews");

        rpc.setCallback(this, function(action) {
            if (action.getState() === "SUCCESS") {
                var views = action.getReturnValue();
                var selectedObj = views.length > 0 ? views[0] : null;
                // Deserialize JSON string and sorting column headers in order
                for( var i = 0; i < views.length; i++ )
                {    
                    if(views[i].selected === 'true'){
                        selectedObj = views[i];
                        break;
                    }
                }

                // Set data back into listViews ready for pickup
                component.set("v.listViews", views);
                if( isFirstFetch ){
                        // Disable patient data fetch on first change of selectedView
                        // autoInit = true on PatientsTableDataProvider fetches data first time automatically
                        component.set("v.isUserSetView", false);
                }
                component.set("v.selectedView",selectedObj);
            // if error
            } else if(action.getState() === "ERROR") {
                self.handleError(component, action.getError());
            }
        });
        rpc.setBackground();
        $A.enqueueAction(rpc);
    },

    resetUI: function(component) {
        component.find('search-input').set('v.value','');
        var patientsTableDataProvider = component.find('PatientsTableDataProvider');
        patientsTableDataProvider.set('v.allowSearch', false);
        patientsTableDataProvider.set('v.searchTerm', '');
        patientsTableDataProvider.set('v.allowSearch', true);
        component.set('v.totalPatients','');
    },

    promptFilterCriteriaModal: function(component, id) {
        $A.createComponent("HealthCloudGA:HcFilterCriteriaBaseModalCmp", {
                "filterId": id
            },
            function(newModal) {
                component.set('v.modal', newModal);
            });
    },

    promptCreateTaskModal: function(component, ids, mapAccountToCarePlan) {
        $A.createComponent("HealthCloudGA:HcTask", {
                "patientIds": ids,
                "mapAccountToCarePlan": mapAccountToCarePlan,
                "AssignedTo": $A.get("$SObjectType.CurrentUser.Id"),
                "userDateFormat": component.get("v.userDateFormat"),
                "userDateTimeFormat": component.get("v.userDateTimeFormat"),
                "fromWhere": "PatientListView"
            },
            function(newModal) {
                component.set('v.modal', newModal);
            });
    },

    promptDeletePatientListModal: function(component, id, name, isOwner,OwnerName) {
        // verifying whether the logged in user is the owner of the currently being deleted
        // and populating the corresponding alert message
        var message = HC.format($A.get("$Label.HealthCloudGA.Confirmation_Msg_Filter_List_Delete_Owner"), name);
        var modalTitle = $A.get("$Label.HealthCloudGA.Label_Remove_Patient_Filter_List_Modal_Header_Owner");
        if( !(isOwner === "true")){
            message = HC.format($A.get("$Label.HealthCloudGA.Confirmation_Msg_Filter_List_Delete_Non_Owner"), OwnerName);
            modalTitle = $A.get("$Label.HealthCloudGA.Label_Remove_Patient_Filter_List_Modal_Header_Non_Owner");
        }

        // we have a dedicated component 'HcRemovePatientListCmp' which displays a modal
        // and performs list deletion operation, hence creating and calling the same
        $A.createComponent("HealthCloudGA:HcRemovePatientListCmp", {
                "filterId": id,
                "filterName": name,
                "modalTitle": modalTitle,
                "alertMessage": message,
            },
            function(newModal) {
                component.set('v.modal', newModal);
            });
    },

    getFilterSecurity: function(component) {
        var self = this;

        // Initialize server rpc call to "getFilterSecurity" method in "PatientListViewController"
        var rpc = component.get("c.getFilterSecurity");
        rpc.setCallback(this, function(action) {
            if (action.getState() === "SUCCESS") {
                var returnVal = action.getReturnValue();
                component.set("v.createList", returnVal.canCreate);
                component.set("v.editList", returnVal.canUpdate);
                component.set("v.deleteList", returnVal.canDelete);
            } else if(action.getState() === "ERROR") {
                self.handleError(component, action.getError());
            }
        });

        $A.enqueueAction(rpc);
    },

    getFilterSecurityByRecord: function(component) {
        var self = this;

        // Initialize server rpc call to "getFilterSecurityByRecord" method in "PatientListViewController"
        var rpc = component.get("c.getFilterSecurityByRecord");
        rpc.setParams({
            "filterString": component.get("v.selectedView").Id
        });
        rpc.setCallback(this, function(action) {
            if (action.getState() === "SUCCESS") {
                var returnVal = action.getReturnValue();
                component.set("v.editFilterRecord", returnVal.EDIT);
                component.set("v.deleteFilterRecord", returnVal.DELETE);

            } else if(action.getState() === "ERROR") {
                self.handleError(component, action.getError());
            }
        });

        $A.enqueueAction(rpc);
    },

    getPageCount: function(component){
        var selectedView = component.get("v.selectedView");
        if($A.util.isUndefinedOrNull(selectedView)){
            return;
        }
        var action = component.get("c.getPatientsCount");
        action.setParams({
            "selectedViewId": selectedView.Id
        });
        action.setCallback(this, function(action) {
            if (action.getState() === "SUCCESS") {
                var returnVal = action.getReturnValue();
                var totalPatients = parseInt(returnVal);
                // Max offset limit = 2000
                component.set("v.totalPatients", totalPatients > 2000 ? '2000+' : totalPatients.toString());
            } else {
                component.set("v.showSpinner",false);
                component.find('toast-message').set('v.content', {
                    'type': "error",
                    'message':  $A.get("$Label.HealthCloudGA.Msg_Error_General")
                });
            }
        });
        action.setBackground();
        $A.enqueueAction(action);
    },

    raiseDataFetchEvent: function(component) {
        var dataProvider = component.find('PatientsTableDataProvider');
        dataProvider.set('v.selectedViewId', component.get("v.selectedView").Id);
        var provideEvent = dataProvider.get("e.provide");
        var parameters = { type: 'DataFetch' };
        var eventData = { parameters: parameters };
        provideEvent.setParams(eventData);
        provideEvent.fire();
    },

    getFilterConditionAccessAndPopulateData: function(component) {
        var self = this;
        // Initialize server rpc call to "getFilterConditionAccessByRecord" method in "PatientListViewController"
        var rpc = component.get("c.getFilterConditionAccessByRecord");
        var selectedView = component.get("v.selectedView");
        rpc.setParams({
            "filterString" : $A.util.isUndefinedOrNull( selectedView ) ? null : selectedView.Id
        });
        rpc.setCallback(this, function(action) {
            if (action.getState() === "SUCCESS") {
                var hasFilterConditionAccess = action.getReturnValue();

                if (hasFilterConditionAccess) {
                    
                    self.resetUI(component);

                    var patientsTable = component.find("PatientsTable");
                    patientsTable.set('v.showSpinner', true);

                    self.raiseDataFetchEvent(component);              

                    self.getFilterSecurityByRecord(component);

                } else {
                    
                    //clearing datagrid items - after setupcolumns
                    //component.find("datagrid").set("v.items", []);
                    component.set("v.editFilterRecord", false);
                    component.find('toast-message').set('v.content', {
                        'type': 'error',
                        'message': $A.get("$Label.HealthCloudGA.Msg_Error_Encrypted_Fields_In_Filter_Condition")
                    });
                }
                component.set("v.showSpinner", false);
            // if error
            } else {
                component.set("v.showSpinner", false);
                component.find('toast-message').set('v.content', {
                    'type': "error",
                    'message': $A.get("$Label.HealthCloudGA.Msg_Error_General")
                });
            }
        });

        $A.enqueueAction(rpc);
    },

    refreshListViews: function(component) {
        this.resetUI(component);
        component.set('v.listViews',[]);
        component.set('v.modal', []);
        this.retrieveViewListsWithSelected(component, false);
        component.set("v.showSpinner",false);
    },

    patientActionsMap : {

        CreateTask : function( component, patientData, thisHelper ) {
            var accountId = patientData['account__id'];
            var mapAccountToCarePlan = {};
            mapAccountToCarePlan[accountId] = patientData['account__careplan__c'] || null;

            thisHelper.promptCreateTaskModal( component, [accountId], mapAccountToCarePlan);
        }

    },

    handlePatientsTableAction : function( component, actionType, patientData ) {
       if( this.patientActionsMap.hasOwnProperty( actionType ) )
       {
            this.patientActionsMap[ actionType ]( component, patientData, this );
       }    
    }
})