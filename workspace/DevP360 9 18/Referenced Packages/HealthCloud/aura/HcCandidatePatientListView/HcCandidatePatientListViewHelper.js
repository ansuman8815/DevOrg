/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @since 198
 */
({
    VIEW_ID_CONVERTED: 'con',
    VIEW_ID_NOT_CONVERTED: 'notcon',
    VIEW_ID_ALL: 'all',

    ACTION_NAME_CONVERT_TO_PATIENT: 'ConvertToPatients',
    FIELD_PATIENT_NAME: 'Name__c',
    FIELD_PATIENT_MRN: 'MedicalRecordNumber__c',
    FIELD_PATIENT_ACCOUNT: 'AccountId__c',
    FIELD_CANDIDATE_PATIENT_RECORD_NAME: 'Name__c',
    FIELD_CANDIDATE_PATIENT_ID: 'Id',
    FIELD_PATIENT_SOURCE_SYSTEM: 'SourceSystem__c',

    MESSAGE_TYPE_ACTION_SELECT: 'GLV:ActionSelect',
    MESSAGE_TYPE_VIEW_SELECT: 'GLV:ViewSelect',
    MESSAGE_TYPE_URL_CLICK: 'GLV:UrlClick',

    FIELD_SET_CAN_PAT: 'CandidatePatientListView',
    MSG_TYPE_CAN_PAT_CONV: "CanPatConvStatus",

    TAB_NAME_COLLAB: 'Collaboration',
    TAB_NAME_TIME_PLAN: 'Care Plan and Timeline',

    doInit: function(component, helper) {
        // Override with values from custom label
        this.TAB_NAME_COLLAB = $A.get("$Label.HealthCloudGA.Tab_Collaboration");
        this.TAB_NAME_TIME_PLAN = $A.get("$Label.HealthCloudGA.Tab_Careplan_Timeline");
        this.getGlobalSettingsAndInit(component, helper);
    },
    getDefaultRecordOpenType: function(component, helper){
      var self = this;
      var action = component.get("c.getDefaultRecordOpenType");
      action.setCallback(this, function(response) {
          if (action.getState() === "SUCCESS") {
            component.set("v.defRecOpenType",response.getReturnValue())
          } else if(action.getState() === "ERROR") {
            helper.handleError(component, action.getError());
          }
      });
      $A.enqueueAction(action);
    },

    getListViews: function(component) {
        return [{
            'Name': $A.get("$Label.HealthCloudGA.Menu_Item_Patient_List_View_All"),
            'Id': this.VIEW_ID_ALL
        }, {
            'Name': $A.get("$Label.HealthCloudGA.Menu_Item_Patient_Not_Converted"),
            'Id': this.VIEW_ID_NOT_CONVERTED
        }, {
            'Name': $A.get("$Label.HealthCloudGA.Menu_Item_Converted"),
            'Id': this.VIEW_ID_CONVERTED
        }];
    },

    setListViews: function(component) {
        var listViews = this.getListViews();
        component.set("v.listViews", listViews);
    },

    getSelectedView: function(component, viewId) {
        var listViewCmp = component.find('listViewCmp');
        var selectedView = listViewCmp.get("v.selectedView");

        if (!selectedView) {
            var listViews = this.getListViews();
            listViews.forEach(function(el, index, all) {
                if (el.Id === viewId) {
                    selectedView = el;
                }
            });
        }

        return selectedView;
    },

    handleViewSelect: function(component, event) {
        var payload = event.getParam("payload");

        if (!payload) {
            $A.log('payload is null, returning');
            return;
        }

        this.setSelectActions(component, payload.selectedView);
    },

    setSelectActions: function(component, selectedView){
        var selectActions = [],
            isSelectable = false,
            listView = component.find('listViewCmp');

        // Populate actions
        if (selectedView.Id == this.VIEW_ID_NOT_CONVERTED) {
            isSelectable = true;
            var value = $A.get("$Label.HealthCloudGA.Menu_Item_Convert_Patient");
            var label = HC.format(value, component.get("v.patientRole"));
            selectActions = [{
                'label': label,
                'name': this.ACTION_NAME_CONVERT_TO_PATIENT
            }];
        }

        listView.set("v.isSelectable", isSelectable);
        listView.set("v.selectActions", selectActions);
    },

    handleSelectAction: function(component, event) {
        var payload = event.getParam("payload");

        if (!payload) {
            $A.log('payload is null, returning');
            return;
        }

        var actionName = payload.actionName;

        if (actionName === this.ACTION_NAME_CONVERT_TO_PATIENT)
            this.handleActionConvertToPatient(component);
    },

    handleActionConvertToPatient: function(component) {
        var selectedItems = component.find('listViewCmp').get("v.selectedItems");
        var patients = [];

        if (selectedItems && selectedItems.length > 0) {

            // Check if the required fields are present, since query uses field set
            if (!selectedItems[0][this.FIELD_PATIENT_NAME]) {
                var errorMsg = $A.get("$Label.HealthCloudGA.Name_Is_Required_Error");
                component.find('listViewCmp').set('v.toastContent', {
                'type': 'error',
                'message': errorMsg
                });
                $A.log('cplv h: required fields missing from selected items; returning.');
                return;
            }

            var helper = this;

            selectedItems.forEach(function(el, index, all) {
                var tuple = {
                    'name': el[helper.FIELD_PATIENT_NAME],
                    'mrn': el[helper.FIELD_PATIENT_MRN],
                    'id': el[helper.FIELD_CANDIDATE_PATIENT_ID],
                    'sourcesystem': el[helper.FIELD_PATIENT_SOURCE_SYSTEM]
                };
                patients.push(tuple);
            });

            $A.createComponent("markup://HealthCloudGA:HcAdtConversionWizard", {
                    "entries": patients,
                    "coordinatorRole": component.get("v.coordinatorRole"),
                    "patientRole": component.get("v.patientRole")
                },
                function(newModal) {
                    component.set('v.modal', newModal);
                }
            );
        } else {
            console.log('Must select at least one candidate in order to convert to patients.');
        }
    },

    getGlobalSettingsAndInit: function(component, helper) {
        var self = this;
        var action = component.get("c.getGlobalSettings");
        var role;

        action.setCallback(this, function(response) {
            if (action.getState() === "SUCCESS") {

                var result = response.getReturnValue();

                role = result["CARE_COORDINATOR_ROLE"];
                component.set("v.coordinatorRole", role);
                role = result["PATIENT_ROLE"];
                component.set("v.patientRole", role);
                self.setListViews(component);

                self.setView(component, self.VIEW_ID_NOT_CONVERTED);
            } else if(action.getState() === "ERROR") {
                helper.handleError(component, action.getError());
            }
        });
        $A.enqueueAction(action);
    },

    setView: function(component, view){
        var selectedView = this.getSelectedView(component, view);
        var listView = component.find('listViewCmp');
        listView.set("v.selectedView", selectedView);
        this.setSelectActions(component, selectedView);
    }
})