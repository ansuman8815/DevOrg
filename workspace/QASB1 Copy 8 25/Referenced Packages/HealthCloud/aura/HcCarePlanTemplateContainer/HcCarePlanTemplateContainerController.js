/* Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCarePlanTemplateContainerController.
 * @since 204
 */
({
    onInit: function(component, event, helper) {
        var namespace = component.toString().match(/markup:\/\/(\w{1,15}):/)[1];
        component.set("v.packageNamespace", $A.util.isEmpty(namespace) ? "" : namespace + '__');
        helper.populateGlobalSettings(component, event, helper);

        //For Care Coordinator dropdown
        if (!$A.util.isEmpty(component.get("v.patientId")) || !$A.util.isEmpty(component.get("v.carePlanId"))) {
            helper.getCareCoordinatorUsers(component, helper);
            helper.getProblemGoalTaskLabels(component, event, helper);
        }
    },

    toggleSpinner: function(component, event, helper) {
        helper.toggleSpinner(event.getParam("isVisible"), component);
    },

    handleNextClickOnTab: function(component, event, helper) {
        var currentTabName = helper.getCurrentTabId(component);
        helper.closeToast(component);
        component.set("v.showDueDateCareCoordinator", false);
        if (currentTabName == "selectTemplateTab") {
            helper.handleNextClickOnSelectTemplateTab(component, event, helper);
        } else if (currentTabName == "customizeToPatientTab") {
            helper.handleNextClickOnCustomizeToPatientTab(component, event, helper);
        } else {
            helper.showToast(component, { 'message': $A.get("$Label.HealthCloudGA.Msg_Error_General") }, true, 'error');
        }
    },

    handleBackClickOnTab: function(component, event, helper) {
        var currentTabName = helper.getCurrentTabId(component);
        helper.closeToast(component);
        component.set("v.showDueDateCareCoordinator", false);
        if (currentTabName == "customizeToPatientTab") {
            component.set("v.showAlert", true);
        } else if (currentTabName == "reviewAndApplyTab") {
            component.set("v.showDueDateCareCoordinator", true);
            helper.handleBackClickOnReviewAndApplyTab(component, event, helper);
        } else {
            helper.showToast(component, { 'message': $A.get("$Label.HealthCloudGA.Msg_Error_General") }, true, 'error');
        }
    },

    handleApplyClickOnTab: function(component, event, helper) {
        helper.handleApplyClickOnTab(component, event, helper);
    },
    handlePromptOkClick: function(component, event, helper) {
        component.set("v.showAlert", false);
        helper.handleBackClickOnCustomizeToPatientTab(component);
    },
    handlePromptCancelClick: function(component, event, helper) {
        component.set("v.showAlert", false);
    },
    processAfterApply: function(component, event, helper) {
        helper.processAfterApply(component, event);
    }
})