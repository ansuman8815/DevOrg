({
    getCarePlanDetailsByPatient: function(component, event, helper) {
        var self = this;
        var rpc;
        var patientId = component.get("v.patientId");
        var carePlanId = component.get("v.carePlanId");
        if ($A.util.isUndefinedOrNull(patientId)) {
            console.log('Error : Invalid PatientId or CarePlanId, PatientId = ' + patientId + ', CarePlanId = ' + carePlanId);
            var errorMessage = $A.get("$Label.HealthCloudGA.Msg_Error_General");
            self.showToastMessage(component, errorMessage);
        } else {
            //Note: If carePlanId is blank, then the default care plan is shown
            if ($A.util.isEmpty(carePlanId)) {
                rpc = component.get("c.getPrimaryCarePlanDetailsByPatient")
                rpc.setParams({
                    "patientId": patientId,
                    "retrieveProblems": false,
                });
            } else {
                rpc = component.get("c.getCarePlanDetailsByPatient")
                rpc.setParams({
                    "patientId": patientId,
                    "carePlanId": carePlanId,
                    "retrieveProblems": false
                });

            }
            rpc.setCallback(this, function(action) {
                if (action.getState() === "SUCCESS") {
                    var result = action.getReturnValue();
                    var itemData = new Object();
                    itemData.row = result.recordsData[0];
                    itemData.metadata = result.columnsMeta;
                    component.set("v.itemData", itemData);
                    if ($A.util.isUndefinedOrNull(component.get("v.itemData").row)) {
                        this.showToast(component, { message: $A.get("$Label.HealthCloudGA.Msg_Error_Unable_To_Retrive_CarePlan") }, true, 'warning');
                    } else {
                        self.createPanel(component, event, helper);
                    }
                } else {
                    self.handleError(component, action.getError());
                }
            });
            $A.enqueueAction(rpc);
        }
    },

    createPanel: function(component, event, helper) {
        var self = this;
        var itemData = component.get("v.itemData");
        var patientId = component.get("v.patientId");
        var carePlanId = component.get("v.carePlanId");
        $A.createComponent("HealthCloudGA:HcCarePlanPanel", {
                "itemData": itemData,
                "patientId": patientId,
                "carePlanId": carePlanId,
                "expanded": true
            },
            function(createdCmp, status, errorMessage) {
                if (status === "SUCCESS") {
                    var carePlanHeader = component.find("carePlanPanel");
                    carePlanHeader.set("v.body", createdCmp);
                } else {
                    console.error("Error: " + errorMessage);
                    // Show error message
                    errorMessage = $A.get("$Label.HealthCloudGA.Msg_Error_General");
                    self.showToastMessage(component, errorMessage);
                }
                component.set("v.showSpinner", false);
            }
        );
    },

    showToastMessage: function(component, errorMsg) {
        var messageBody = {
            message: errorMsg
        };
        this.showToast(component, messageBody, true, 'error');
    }
})