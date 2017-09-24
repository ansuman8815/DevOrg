({
    doInit: function(component, helper) {
        this.validateSelectedLeads(component, helper);
        this.getCarePlanRecordTypes(component);
    },

    handlePslError: function(component, helper) {
        var error = new Object();
        error.message = $A.get("$Label.HealthCloudGA.Msg_Component_Has_NoAccess");
        helper.handleError(component, [error]);
    },

    validateSelectedLeads: function(component, helper) {
        var leadIds = component.get("v.selectedLeads");
        var action = component.get("c.validateLeads");

        action.setParams({
            'leadIdsList': leadIds
        });
        action.setCallback(this, function(response) {
            var leadValidationCmp = component.find('leadValidation');
            leadValidationCmp.set('v.isLeadsValidationComplete', true);
            if (action.getState() === "SUCCESS") {
                var payload = response.getReturnValue();

                var leadValidationResults = payload.validationResultList;
                var validationLabels = payload.fieldNameToLabelMap;
                var leadsMap = { 'valid': [], 'invalid': [] };
                for (var ii = 0; ii < leadValidationResults.length; ii++) {
                    leadsMap[leadValidationResults[ii].passedValidation ? 'valid' : 'invalid'].push(leadValidationResults[ii]);
                }

                leadValidationCmp.set('v.leadResults', leadsMap['invalid']);

                component.set('v.leadLabels', validationLabels);
                component.set('v.validLeads', leadsMap['valid']);
            } else if (action.getState() === "ERROR") {
                helper.handleError(component, action.getError());
            }
        });
        $A.enqueueAction(action);
    },

    invokeLeadConversion: function(component, event, helper) {
        var self = this;
        var validLeads = component.get("v.validLeads");
        var validLeadIds = [];
        if (validLeads) {
            for (var i = 0; i < validLeads.length; i++)
                validLeadIds.push(validLeads[i].lead.Id);
        }
        var action = component.get("c.invokeLeadConversion");
        var careCoordinatorSelection = component.get("v.coordinatorSelection");
        var careCoordinatorId = null;
        if (careCoordinatorSelection !== null) {
            careCoordinatorId = careCoordinatorSelection.id;
        }
        var selectedRecordType = component.get('v.selectedRecordType');
        var carePlanRecordTypeName = null;
        var carePlanRecordTypeNamespace = null;

        if (!$A.util.isUndefinedOrNull(selectedRecordType)) {
            carePlanRecordTypeName = selectedRecordType.name || null;
            carePlanRecordTypeNamespace = selectedRecordType.namespace || null;
        }
        action.setParams({
            'leadIdsList': validLeadIds,
            'careCoordinatorId': careCoordinatorId,
            'carePlanRecordTypeName': carePlanRecordTypeName,
            'carePlanRecordTypeNamespace': carePlanRecordTypeNamespace
        });
        action.setCallback(this, function(response) {
            if (action.getState() === "SUCCESS") {
                helper.toggleSpinner(false, component);
                var resultSize = validLeadIds.length;
                var label = null;
                if (resultSize === 1) {
                    label = $A.get("$Label.HealthCloudGA.Msg_Lead_Patient_Convert_Success_Singular");
                } else {
                    var value = $A.get("$Label.HealthCloudGA.Msg_Lead_Patient_Convert_Success_Plural");
                    label = HC.format(value, resultSize);
                }
                component.set("v.showSuccessLabel", label);
                component.set("v.showSuccessModal", true);
            } else {
                helper.toggleSpinner(false, component);
                var errorMsg = $A.util.isEmpty(action.getError()) ? $A.get("$Label.HealthCloudGA.Msg_Lead_Patient_Convert_Fail") : action.getError()[0].message;
                $A.log("Exception thrown while invoking lead to patient conversion : " + errorMsg);
                var errorMsgLabel = $A.get("$Label.HealthCloudGA.Msg_Lead_Patient_Convert_Fail");
                self.showToast(component, { 'message': errorMsgLabel }, true, 'error');
            }
        });
        helper.toggleSpinner(true, component);
        $A.enqueueAction(action);
    },

    getCarePlanRecordTypes: function(component) {
        var self = this;
        var action = component.get("c.getCarePlanRecordTypes");
        action.setCallback(this, function(response) {
            if (action.getState() === "SUCCESS") {
                var payload = response.getReturnValue();
                var reviewTabNumber = 3;
                if (payload && payload.length > 1) {
                    // By design, the first record type in the list is marked as default from the backend.
                    // So we set the selectedRecordType to the same.
                    self.createSelectRecordTypeTab(component, payload);
                    reviewTabNumber = 4;
                } else {
                    component.set('v.selectedRecordType', payload[0]);
                }
                self.createReviewTab(component, reviewTabNumber);
                component.set("v.count", reviewTabNumber);
            } else {
                self.toggleSpinner(false, component);
                var errorMsg = $A.util.isEmpty(action.getError()) ? $A.get("$Label.HealthCloudGA.Msg_Lead_Patient_Convert_Fail") : action.getError()[0].message;
                $A.log("Exception thrown while fetching Care Plan Record Type Mapper : " + errorMsg);
                var errorMsgLabel = $A.get("$Label.HealthCloudGA.Msg_Lead_Patient_Convert_Fail");
                self.showToast(component, { 'message': errorMsgLabel }, true, 'error');
            }
        });
        $A.enqueueAction(action);
    },

    createSelectRecordTypeTab: function(component, payload) {
        var self = this;
        component.get("v.tabList").push("selectRecordTypeTab");
        $A.createComponent("HealthCloudGA:HcLeadCarePlanRecTypePickerTab", {
                "recordTypes": payload,
                "selectedRecordType": payload[0]
            },
            function(createdCmp, status, errorMessage) {
                if (status === "SUCCESS") {
                    var carePlanRTPickerTab = component.find("carePlanRTPickerTab");
                    carePlanRTPickerTab.set("v.body", createdCmp);
                } else {
                    console.error("Error: " + errorMessage);
                    // Show error message
                    errorMessage = $A.get("$Label.HealthCloudGA.Msg_Error_General");
                    self.showToast(component, { 'message': errorMessage }, true, 'error');
                }
                component.set("v.showSpinner", false);
            }
        );
    },

    createReviewTab: function(component, reviewTabNumber) {
        var self = this;
        var value = $A.get("$Label.HealthCloudGA.Header_L2P_Wizard_Review");
        var reviewTabLabel = HC.format(value, reviewTabNumber);
        component.get("v.tabList").push("assignmentsViewTab");
        $A.createComponent("HealthCloudGA:HcLeadToPatientWizardReviewTab", {
                "leadLabels": component.get("v.leadLabels"),
                "validLeads": component.get("v.validLeads"),
                "coordinatorSelection": component.getReference("v.coordinatorSelection"),
                "coordinatorRole": component.get("v.coordinatorRole"),
                "reviewTabLabel": reviewTabLabel
            },
            function(createdCmp, status, errorMessage) {
                if (status === "SUCCESS") {
                    var reviewTab = component.find("reviewTab");
                    reviewTab.set("v.body", createdCmp);
                    var divElement = component.find('tabDiv');
                    $A.util.removeClass(divElement, 'slds-hide');
                    $A.util.addClass(divElement, 'slds-show');
                } else {
                    console.error("Error: " + errorMessage);
                    // Show error message
                    errorMessage = $A.get("$Label.HealthCloudGA.Msg_Error_General");
                    self.showToast(component, { 'message': errorMessage }, true, 'error');
                }
                component.set("v.showSpinner", false);
            }
        );
    },
})