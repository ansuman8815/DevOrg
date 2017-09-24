/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcAdtConversionSummaryController, js front-end controller for HcAdtConversionSummary component.
 * @since 198
 */
({
    init: function(component, event, helper){
        helper.setupHeaders(component);
    },

    handleSort: function(component,event,helper){
        if (event.currentTarget && event.currentTarget.dataset.sortable == 'true') {
            var colId = event.currentTarget.dataset.id;
            component.set("v.showSpinner",true);
            helper.sortBy(component,colId);
            component.set("v.showSpinner",false);
        }
    },

    submit: function(component, event, helper) {
        var coordinator = component.get('v.coordinator');
        var payload = [];
        component.get('v.entries').forEach(function(entry, index, all) {
            payload.push({
                'id': entry.id,
                'mrn': entry.mrn,
                'coorId': coordinator != null ? coordinator.id : null,
                'sourcesystem': entry.sourcesystem
            });
        });
        payload = JSON.stringify(payload);
        // Initialize server rpc call to "convertCandidatesIntoPatients" method in "HcPatientCreationFlowController"
        var rpc = component.get("c.convertCandidatesIntoPatients");
        rpc.setParams({
            'payload': payload
        });

        rpc.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                $A.get("e.HealthCloudGA:HcComponentStatusEvent").setParams({
                    status: "SUCCESS",
                    type: helper.MSG_TYPE,
                    message: $A.get("$Label.HealthCloudGA.Msg_Patient_Convert_Success")
                }).fire();
            } else {
                console.log("Error from server-side:");
                console.log(response.getState());

                $A.get("e.HealthCloudGA:HcComponentStatusEvent").setParams({
                    status: "ERROR",
                    type: helper.MSG_TYPE,
                    message: $A.get("$Label.HealthCloudGA.Msg_Patient_Convert_Fail")
                }).fire();
            }
        });
        $A.enqueueAction(rpc);
    }
})