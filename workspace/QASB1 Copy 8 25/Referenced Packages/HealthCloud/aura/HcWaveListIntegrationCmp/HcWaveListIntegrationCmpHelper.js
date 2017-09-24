/**
 * Copyright © 2017 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcWaveListIntegrationCmpHelper, helper class for HcWaveListIntegrationCmp Component.
 * @since 208
 */
({
    onSavePatientsList: function(component, event, helper) {
        var self = this;
        component.set("v.showSpinner", true); 
        var action;
        
        var filterCriteriaId;
        if(component.get('v.isFirstRadio')) {
            action = component.get("c.createPatientListFromWave");
            var lName = component.get("v.listName");
            action.setParams({
                "listName": lName,
                "queryFromWave": component.get("v.queryFromWave")
            });
        }
        if(component.get('v.isSecondRadio')) {
            action = component.get("c.editWavePatientLists");
            var selectedItem = component.get("v.output");
            action.setParams({
                "filterCriteriaId": selectedItem.Id,
                "queryFromWave": component.get("v.queryFromWave")
            });
        }
        action.setCallback(this, function(response) {
            var returnMsg = response.getReturnValue();
            if (response.getState() === "SUCCESS") {
                // switching the flags to hide textbox, send button and show the success message 
                if(returnMsg){
                    component.set("v.successMsg",returnMsg);
                }else{
                    component.set("v.successMsg",$A.get("$Label.HealthCloudGA.Success_Page_Header_Wave_Patientlist_Save_On_Healthcloud"));
                }
                component.set("v.isSuccess", true);
                component.set("v.isFailed", false);
            } else {
                // appending standard error message to the back-end returned error message
                //var errorMessage = $A.get("$Label.HealthCloudGA.Wave_Patientlist_Creation_Error");
                var errors = response.getError();
                var errorMessage = errors[0].message;
                // switching the flags to show textbox and send button elements on UI
                 component.find('toast-message').set('v.content', {
                    'type': 'error',
                    'message': errors[0].message
                });
                component.set("v.isSuccess", false);
                component.set("v.isFailed", true);
            }
            component.set("v.showSpinner", false); 
        });
        $A.enqueueAction(action);
    },

    /* Method to validate the empty and null values of textbox */
    validateFilterName: function(component, event, helper) {
        var isCheckPass = true;
        if(!component.get('v.isFirstRadio') && !component.get('v.isSecondRadio')){
            isCheckPass = false;
            component.find('toast-message').set('v.content', {
              'type': 'error',
              'message': $A.get("$Label.HealthCloudGA.Msg_Error_Select_Option_To_Proceed")
          });
        }
        if(component.get('v.isFirstRadio')){
            var listName = component.get("v.listName");
            if (listName == null || $A.util.isEmpty(listName.trim())) {
                isCheckPass = false;
                var listComp = component.find("listName");
                $A.util.toggleClass(listComp, "slds-has-error");
                component.find('toast-message').set('v.content', {
                    'type': 'error',
                    'message': $A.get("$Label.HealthCloudGA.Msg_Missing_Required_Fields")
                });
            }
        }
        if(component.get('v.isSecondRadio')){
            var listComp = component.find("listName");
            if($A.util.hasClass(listComp, "slds-has-error")){
                $A.util.removeClass(listComp, "slds-has-error");
            }
            if(component.get('v.output') == null){
                isCheckPass = false;
                component.find('toast-message').set('v.content', {
                    'type': 'error',
                    'message': $A.get("$Label.HealthCloudGA.Msg_Error_Choose_List_To_Send")
                });
            }
        }
        return isCheckPass;
    }
})