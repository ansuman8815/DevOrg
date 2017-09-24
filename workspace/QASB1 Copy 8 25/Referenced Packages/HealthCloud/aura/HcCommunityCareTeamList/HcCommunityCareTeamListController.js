/*
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCommuityCareTeamListController
 * @since 208
 */

({
    
    onInit: function(component, event, helper) {
        // See if carePlanId or patientId has been passed to the component
        // (via dynamic creation, custom app, etc...)
        var carePlanIdOnInit = component.get("v.carePlanId");
        var patientIdOnInit = component.get("v.patientId");
        // Check for recordId (passed in when on record home page)
        var recordId = component.get("v.recordId");
        // Conceptually we should not have both of these populated,
        // precedence order: carePlanIdOnInit, patientIdOnInit , recordId
        if (!$A.util.isUndefinedOrNull(recordId)) {
            //check if recordId is of type careplanID or accountid before assigning
            if($A.util.isUndefinedOrNull(carePlanIdOnInit)  && recordId.indexOf('500') === 0) {
                carePlanIdOnInit = recordId;
                component.set("v.carePlanId", carePlanIdOnInit);
                component.set("v.patientId", null);
            } else if($A.util.isUndefinedOrNull(patientIdOnInit) && recordId.indexOf('001') === 0) {
                patientIdOnInit = recordId;
                component.set("v.patientId", patientIdOnInit);
                component.set("v.carePlanId", null);
            }
        } 
        // load the care team members if we have a care plan Id
        if (!$A.util.isEmpty(carePlanIdOnInit) || !$A.util.isEmpty(patientIdOnInit)) {
            component.set("v.showSpinner", true);
            helper.loadMembers(component, event, helper);
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
            component.set("v.showSpinner", true);
            helper.loadMembers(component, event, helper);
        }
    }
})