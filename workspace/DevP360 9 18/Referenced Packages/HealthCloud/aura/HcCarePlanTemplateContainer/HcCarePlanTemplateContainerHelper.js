/* Copyright © 2016 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 *
 * @since 204
 */
({
    tabList: ["selectTemplateTab", "customizeToPatientTab", "reviewAndApplyTab"],

    getCareCoordinatorUsers: function(component, helper) {
        var self = this;
        var action;
        if (!$A.util.isUndefinedOrNull(component.get("v.carePlanId"))) {
            action=component.get("c.getCareTeamMembersByCaseId");
            action.setParams({
                "carePlanId": component.get("v.carePlanId"),
                "usersOnly": "true"
            });
        } else {
            action = component.get("c.getCareTeamMembersByPatientId");
            action.setParams({
                "patientId": component.get("v.patientId"),
                "usersOnly": "true"
            });
        }
        if (!$A.util.isUndefinedOrNull(action)) {
            self.showSpinner(true);
            
            action.setCallback(this, function(response) {
                if (response.getState() === "SUCCESS") {
                    var result = response.getReturnValue();
                    var allCareTeamUsers = [];
                    var globalSettings = component.get("v.globalSettings");
                    if (!$A.util.isEmpty(result)) {
                        for (var i = 0; i < result.length; i++) {
                            result[i].Name = result[i].name;
                            if (result[i]["externalUserId"] || result[i]["isUser"] === "true") {
                                if (result[i]["role"] === globalSettings["CARE_COORDINATOR_ROLE"]) {
                                    allCareTeamUsers.push(result[i]);
                                } else if (result[i]["role"] == globalSettings["PATIENT_ROLE"]) {
                                    component.set("v.patientUser", result[i]);
                                }
                            }
                        }
                        component.set("v.careCoordinatorSelectedValue", allCareTeamUsers[0]);
                    }
                    component.set("v.allCareTeamUsers", allCareTeamUsers);
                    component.set("v.careCoordintatorRoleLowerCase", globalSettings["CARE_COORDINATOR_ROLE"].toLowerCase());
                    component.set("v.initialized", "true");
                    self.showSpinner(false);
                }
                //Error from backend
                else {
                    helper.handleError(component, response.getError());
                }
            });
            $A.enqueueAction(action);
        }
    },

    getProblemGoalTaskLabels: function(component, event, helper) {
        var self = this;
        var action = component.get("c.getProblemGoalTaskObjectLabels");
        if (!$A.util.isUndefinedOrNull(action)) {
            self.showSpinner(true);
            action.setCallback(this, function(response) {
                if (response.getState() === "SUCCESS") {
                    var objectLabelMap = response.getReturnValue().objectData;
                    component.set("v.objectLabelMap", objectLabelMap);
                } else {
                    throw new Error($A.get("$Label.HealthCloudGA.Msg_Error_General"));
                }
                self.showSpinner(false);
            });
            $A.enqueueAction(action);
        }
    },

    switchToNextTab: function(component) {
        var tabset = component.find("navigationTabset");
        var current = tabset.get("v.selectedTabId");
        var currentIndex = this.tabList.indexOf(current);
        var nextTabIndex = currentIndex+1;
        if(this.tabList.length > nextTabIndex && nextTabIndex >= 0){
            tabset.set("v.selectedTabId", this.tabList[nextTabIndex]);
        }
    },

    switchToPreviousTab: function(component) {
        var tabset = component.find("navigationTabset");
        var current = tabset.get("v.selectedTabId");
        var currentIndex = this.tabList.indexOf(current);
        var previousTabIndex = currentIndex-1;
        if(this.tabList.length > previousTabIndex && previousTabIndex >= 0){
            tabset.set("v.selectedTabId", this.tabList[previousTabIndex]);
        }
    },

    getCurrentTabId: function(component) {
        var tabset = component.find("navigationTabset");
        var currentTabId = tabset.get("v.selectedTabId");
        return currentTabId;
    },

    handleNextClickOnSelectTemplateTab: function(component, event, helper) {
        var self = this;
        var selectedItems = component.get("v.selectedTemplateList");
        var selectedTemplates = [];
        for(var i=0; i<selectedItems.length; i++){
            selectedTemplates.push(selectedItems[i].Id);
        }
        var toast = component.find('toast-message');
        if ($A.util.isUndefinedOrNull(selectedItems) || $A.util.isEmpty(selectedTemplates)) {
            toast.set('v.content', { 'type': 'error', 'message': $A.get("$Label.HealthCloudGA.Msg_Please_Select_Template_To_Proceed") });
            toast.set('v.autoHideErrorAndWarning', true);
        } else {
            self.showSpinner(true);
            var action = component.get("c.getTemplateDetails");
            action.setParams({
                "templateIds": JSON.stringify(selectedTemplates),
                "loadTasks": true
            });
            action.setCallback(this, function(result) {
                var res = result.getReturnValue();
                var state = result.getState();
                
                if (res != undefined && null != res && state.toUpperCase() === "SUCCESS") {
                    res = JSON.parse(res);
                    component.set("v.templatesProblemsGoalsTasks", res);
                    // delete not allowed in 'strict' mode
                    // delete res;
                    this.switchToNextTab(component);
                    component.set("v.showBackButton", true);
                    var patientUser = component.get("v.patientUser");
                    if ($A.util.getBooleanValue(patientUser["isCommunityEnabled"]) == false) {
                        var globalSettings = component.get("v.globalSettings");
                        toast.set('v.content', { 'type': 'warning', 'message': HC.format($A.get("$Label.HealthCloudGA.Msg_Patient_Not_Community_User"), component.get("v.careCoordintatorRoleLowerCase")) });
                        toast.set('v.autoHideErrorAndWarning', true);
                        toast.set('v.timeout', 10000);
                    }
                } else {
                    toast.set('v.content', { 'type': 'error', 'message': $A.get("$Label.HealthCloudGA.Msg_Error_General") });
                }
                self.showSpinner(false);
            });
            $A.enqueueAction(action);

            component.set("v.showDueDateCareCoordinator", true);
            //For Start Date picker
            helper.getDefaultDueDate(component);
        }
    },

    getDefaultDueDate: function(component) {
        var today = new Date();
        component.set('v.dueDate', today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate());
    },

    handleNextClickOnCustomizeToPatientTab: function(component, event, helper) {
        //wire appropriate logic to handle Next button click on Customize to Patient tab
        var self = this;
        var action = component.get("c.dummyAsyncAction");
        if (!$A.util.isUndefinedOrNull(action)) {
            self.showSpinner(true);
            action.setCallback(this, function(result) {
                var state = result.getState();
                if (state.toUpperCase() === "SUCCESS") {
                    component.set("v.showNextButton", false);
                    var templates = component.find("templateCustomize").get("v.selectedCarePlanTemplates");
                    component.set("v.selectedCarePlanTemplatesFromCustomize", templates);
                    this.switchToNextTab(component);
                    component.set("v.showApplyButton", true);
                }
                else {
                    toast.set('v.content', { 'type': 'error', 'message': $A.get("$Label.HealthCloudGA.Msg_Error_General") });
                }
                self.showSpinner(false);
            });
            $A.enqueueAction(action);
        }
    },

    handleBackClickOnCustomizeToPatientTab: function(component, event, helper) {
        //wire appropriate logic to handle Back button click on Customize to Patient tab
        component.set("v.templatesProblemsGoalsTasks",[]);
        this.switchToPreviousTab(component);
        component.set("v.selectedCarePlanTemplatesFromCustomize", []);
        component.set("v.showBackButton", false);
    },

    handleBackClickOnReviewAndApplyTab: function(component, event, helper) {
        //wire appropriate logic to handle Back button click on Review and Apply tab
        component.set("v.showApplyButton", false);
        this.switchToPreviousTab(component);
        component.set("v.showNextButton", true);
    },

    handleApplyClickOnTab: function(component, event, helper) {
        var cmp = component.find("reviewAndApply");
        if (!$A.util.isUndefinedOrNull(cmp)) {
            cmp.commitData();
        }
    },

    processAfterApply: function(component, event) {
        var isSuccess = event.getParam("isSuccess");
        var message = event.getParam("successMessage");
        if ($A.util.isUndefinedOrNull(isSuccess) || !isSuccess) {
            return false;
        }
        var tabset = component.find("navigationTabset");
        tabset.set("v.selectedTabId", this.tabList[0]);
        component.set("v.showBackButton", false);
        component.set("v.showApplyButton", false);
        component.set("v.showNextButton", true);
        component.find('toast-message').set('v.content', { 'type': 'success', 'message': message });
        this.resetWizard(component);
    },

    resetWizard: function(component) {
        component.set("v.selectedTemplateList", []);
        component.set("v.selectedTemplates", {});
        var selectTemplate = component.find("selectTemplateCmp");
        var selectTable = selectTemplate.find("CarePlanTemplateSelectTable");
        selectTable.clearSelection();
    },

    showSpinner : function (isSpinnerDisplayed) {
        var appEvent = $A.get("e.HealthCloudGA:HcToggleSpinnerEvent");
        appEvent.setParams({ "isVisible": isSpinnerDisplayed });
        appEvent.fire();
    }
})