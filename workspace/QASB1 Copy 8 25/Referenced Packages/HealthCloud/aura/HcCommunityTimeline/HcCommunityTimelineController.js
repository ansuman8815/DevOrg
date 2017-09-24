/*
 * Copyright © 2017 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCommunityTImeline
 * @since 210
 */

({

    onInit: function(component, event, helper) {
       // localize the select a plan text if it is the default
        var defaultPickerText = component.get("v.picklistDefaultOptionTextForTimeline");
        if(defaultPickerText === 'Select a care plan to view timeline events.'){
            component.set("v.picklistDefaultOptionTextForTimeline", $A.get("$Label.HealthCloudGA.Timeline_Picklist_Placeholder_Default_Text"));
        }
        
        // See if carePlanId or patientId has been passed to the component
        // (via dynamic creation, custom app, etc...)
        var carePlanIdOnInit = component.get("v.carePlanId");
        var patientIdOnInit = component.get("v.patientId");

        // populate categories list
        helper.populateCategories(component, event, helper);
        
        // Check for recordId (passed in when on record home page)
        var recordId = component.get("v.recordId");
        // Conceptually we should not have both of these populated,
        // precedence order: carePlanIdOnInit, patientIdOnInit , recordId
        if (!$A.util.isUndefinedOrNull(recordId)) {
            //check if recordId is of type careplanID or patientId before assigning
            if($A.util.isUndefinedOrNull(carePlanIdOnInit)  && recordId.indexOf('500') === 0) {
                carePlanIdOnInit = recordId;
                component.set("v.carePlanId", carePlanIdOnInit);
                component.set("v.patientId", null);
                component.set("v.planOrAccountSelected", true);
            } else if($A.util.isUndefinedOrNull(patientIdOnInit) && recordId.indexOf('001') === 0) {
                patientIdOnInit = recordId;
                component.set("v.patientId", patientIdOnInit);
                component.set("v.carePlanId", null);
                component.set("v.planOrAccountSelected", true);
            }
        }
    },

    onCarePlanChange: function(component, event, helper) {
        var carePlanIdOrPatientIdSet = false;
        var carePlanId = event.getParam("carePlanId");
        if (!$A.util.isUndefinedOrNull(carePlanId) && !(component.get("v.carePlanId") === carePlanId)) {
            component.set("v.carePlanId", carePlanId);
            component.set("v.patientId", null);
            carePlanIdOrPatientIdSet = true;
        } else {
            var patientId = event.getParam("patientId");
            if(!$A.util.isUndefinedOrNull(patientId) && !(component.get("v.patientId") === patientId)) {
                component.set("v.patientId", patientId);
                component.set("v.carePlanId", null);
                carePlanIdOrPatientIdSet = true;
            }
        }
        if(carePlanIdOrPatientIdSet) {
            component.set("v.planOrAccountSelected", true);
        }
        
    },

    filterClicked: function(component, event, helper) {
        //get the updated list
        var filters = component.get("v.filters");
        var filterString = 'None';
        if(!$A.util.isEmpty(filters)){

            filterString = helper.getStringForList(filters, ',');
        }
        component.set("v.filterString", filterString);
    },

   
})