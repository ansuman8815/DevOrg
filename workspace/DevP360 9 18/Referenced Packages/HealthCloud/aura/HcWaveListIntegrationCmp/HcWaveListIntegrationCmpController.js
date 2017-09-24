/**
 * Copyright © 2017 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcWaveListIntegrationCmpController, controller class for HcWaveListIntegrationCmp Component.
 * @since 208
 */
({
    onFirstRadioClicked: function(component, event, helper) {
        component.set('v.isFirstRadio',true);
        component.set('v.isSecondRadio',false);   
        var waveListTable = component.find('waveListsTable');
        waveListTable.clearSelection();
    },
    
    handleTableSelectionChange: function(component, event, helper) {
        if(component.get('v.isFirstRadio')){
            component.set('v.isFirstRadio',false);
            component.set('v.isSecondRadio',true);
        }
    },

    onSecondRadioClicked: function(component, event, helper) {
        component.set('v.isFirstRadio',false);
        component.set('v.isSecondRadio',true);
    },

    onSavePatientsList: function(component, event, helper) {
        if (helper.validateFilterName(component, event, helper)) { 
            helper.onSavePatientsList(component, event, helper); 
      } 
    }
    
})