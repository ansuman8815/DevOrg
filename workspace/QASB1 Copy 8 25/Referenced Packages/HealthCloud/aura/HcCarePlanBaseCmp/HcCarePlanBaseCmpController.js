/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCarePlanBaseCmpontroller, js front-end controller for HcCarePlanBaseCmp component.
 * @since 198
 */
({
    doInit: function(component, event, helper) {
        component.set("v.showSpinner", true);       
        /*var patientID = component.get('v.patientId');
        if ($A.util.isEmpty(patientID)) {
            // TO DO : Failure to load. ContactId is required to load the Timeline view.
            return;
        }*/
        component.set("v.userDateFormat",$A.get("$Locale.dateFormat"));
        component.set("v.userDateTimeFormat",$A.get("$Locale.datetimeFormat"));
        helper.getProblems(component);
        helper.setupTabs(component);
    },

    //For dropdown for New Problem and New Task
    handleSelect: function(component, event, helper) {
        var cmpMarkup = "";
        var actionName = $A.getComponent(event.getSource().getGlobalId()).get("v.value");
        if (actionName.toUpperCase() === 'TASK') {
            cmpMarkup = "HealthCloudGA:HcTask";
            helper.showModalComponent(component, event, cmpMarkup);
        } else if (actionName.toUpperCase() === 'PROBLEM') {
            var type = "Create Problem";
            helper.showFieldSetModal(component, event, type);
        }
    },

    createTask: function(component, event, helper) {
        var cmpMarkup = "HealthCloudGA:HcTask";
        helper.showModalComponent(component, event, cmpMarkup);
    },
    
    createProblem: function(component, event, helper) {
        var type = "Create Problem";
        helper.showFieldSetModal(component, event, type);
    },

    handleActionEvent: function(component, event, helper) {
        helper.handleActionEvent(component, event);
    },
    
    expandAllProblemsandGoals: function (component, event, helper) {
        var menuValue = event.getSource().get('v.value');
        var expandCollapseEvent = $A.get("e.HealthCloudGA:HcMultipleCarePlanEvent");
        if (menuValue == "ExpandAllProblemsandGoals") {
            expandCollapseEvent.setParams({
                "type": "Expand all problems and goals",
                "carePlanId" : component.get("v.carePlanId")
            });
        } else if (menuValue == "CollapseAllProblemsandGoals") {
            expandCollapseEvent.setParams({
                "type": "Collapse all problems and goals",
                "carePlanId" : component.get("v.carePlanId")
            });
        }
        expandCollapseEvent.fire();
        var problemsMenu = component.find("problemsMenu");
        problemsMenu.set("v.visible", false);
    },

    handleLEXRecordChangedEvent: function(component, event, helper) {
        var record = helper.stripNamespaceFromRecord(event.getParam('record'));
        var sObjectName = record.sobjectType;
        var recordId = event.getParam("recordId");
        var newParentId = $A.util.isUndefinedOrNull(record.CarePlanProblem__c) ? record.CarePlan__c : record.CarePlanProblem__c;
        var oldParentId = component.get('v.treeItemToRefreshId');
        var topLevelParentId = record.CarePlan__c;

        helper.handleRefresh(component, sObjectName, recordId, newParentId, oldParentId, topLevelParentId, event);
    },

    handleDataChangedEvent: function(component, event, helper) {
        var sObjectName = event.getParam("sObjectName");
        var record = event.getParam("record");
        var recordId = event.getParam("recordId");
        var newParentId = event.getParam("newParentId");
        var oldParentId = event.getParam("oldParentId");
        var topLevelParentId = event.getParam("topLevelParentId");

        helper.handleRefresh(component, sObjectName, recordId, newParentId, oldParentId, topLevelParentId, event);
    },

    handleComponentStatusEvent: function(component, event, helper) {
        var memberObj = event.getParam("memberObj");
        // TODO: Check if topLevelParentId (across components) is really needed and remove if not.
        if (memberObj != null && (memberObj.carePlanId == component.get("v.carePlanId") || memberObj.topLevelParentId == component.get("v.carePlanId"))) {
            helper.handleMessageEvent(component, event);
        }
    },

    handleCarePlanTabEvent: function(component, event, helper) {
        component.set("v.activeTabId", event.getParam('tabId'));
        if (event.getParam('tabId') == 'problems_goals' && component.get("v.refreshProblemsTab")) {
            component.set("v.refreshProblemsTab", false);
            helper.getProblems(component);
        }
    },

    openCarePlanTemplates: function(component) {
        HC.openCarePlanTemplatesSubtab(component.get("v.carePlanId"), component.get("v.patientId"), HC.format($A.get("$Label.HealthCloudGA.Tab_Title_Careplan_Templates"), component.get("v.carePlanSubject")));
        var problemsMenu = component.find("problemsMenu");
        problemsMenu.set("v.visible", false);
    },

    openCaseTeamTab: function(component, event, helper) {
        helper.openCaseTeamTab(component, event, helper);
    },

    addCareTeamMember: function(component, event, helper) {
        var caseId = component.get("v.carePlanId");
        $A.createComponent("HealthCloudGA:HcCareTeamAddMember", {
                caseId: caseId
            },
            function(view,status, errorMessage) {
                component.set("v.modal", view);
            }
        );
    },

    handleAddCareTeamMemberEvent: function(component, event, helper) {
        if (event.getParam("type") === "REMOVEMODAL") { // On close of add care team member modal
            helper.resetModalComponent(component, event);
            var refreshEvent = $A.get("e.HealthCloudGA:HcComponentStatusEvent");
            var carePlanId = component.get("v.carePlanId");
            refreshEvent.setParams({
                type: "REFRESH_CARETEAMLIST",
                memberObj: {
                    carePlanId: carePlanId
                }
            });
            refreshEvent.fire();
        }
    }
})