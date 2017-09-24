/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCarePlanBaseCmpHelper, js front-end controller for HcCarePlanBaseCmp component.
 * @since 198
 */
({
    getCarePlanId: function(component) {
        var carePlanId = component.get("v.carePlanId");
        if ($A.util.isEmpty(carePlanId)) {
            var action = component.get("c.getCarePlanIdFromPatientId");
            action.setParams({
                "patientId": component.get("v.patientId")
            });
            action.setCallback(this, function(result) {
                if (result.getState() === "SUCCESS") {
                    carePlanId = result.getReturnValue();
                    component.set("v.carePlanId", carePlanId);
                }
                //Error from backend
                else {
                    throw new Error($A.get("$Label.HealthCloudGA.Msg_Error_General"));
                }
            });
            $A.enqueueAction(action);
        }

    },

    getProblems: function(component) {
        var self = this;
        var action;
        component.set("v.showSpinner", true);
        if (!$A.util.isUndefinedOrNull(component.get("v.carePlanId"))) {
            action = component.get("c.getProblemsForPlan");
            action.setParams({
                "carePlanId": component.get("v.carePlanId")
            });
        } else {
            action = component.get("c.getProblemsForPatient");
            action.setParams({
                "patientId": component.get("v.patientId")
            });
        }

        action.setBackground();
        action.setCallback(this, function(result) {
            var res = result.getReturnValue();
            var state = result.getState();
            var needCarePlanId = true;
            component.set('v.problemFetchDone', true);
            if (state === "SUCCESS") {
                if (!$A.util.isUndefinedOrNull(component.get("v.carePlanId"))) {
                    needCarePlanId = false;
                }
                if (res && res.length > 0 && needCarePlanId) {
                    var carePlanId = res[0].CarePlan__c;
                    component.set("v.carePlanId", carePlanId);
                }
                component.set("v.problems", res);
                if (needCarePlanId) {
                    self.getCarePlanId(component);
                }
            } else {
                self.handleError(component, result.getError());
            }

            component.set("v.showSpinner", false);

        });
        $A.enqueueAction(action);
    },

    setupTabs: function(component) {
        $A.createComponent("HealthCloudGA:HcCarePlanTabs", {
                "aura:id": "tabsCmp",
                "patientId": component.getReference("v.patientId"),
                "carePlanId": component.getReference("v.carePlanId"),
                "problems": component.getReference("v.problems"),
                "problemFetchDone": component.getReference("v.problemFetchDone")
            },
            function(tab, status, errorMessage) {
                if (status === "SUCCESS") {
                    var carePlanTabCmp = component.find("carePlanTab");
                    carePlanTabCmp.set("v.body", tab);
                } else if (status === "INCOMPLETE") {
                    console.error("No response from server or client is offline.")
                        // Show offline error
                } else if (status === "ERROR") {
                    console.error("Error: " + errorMessage);
                    // Show error message
                }
                component.set("v.showSpinner", false);
            }
        );
    },

    showModalComponent: function(component, event, componentMarkup) {
        var carePlanId = event.getParam("carePlanId");
        //To ensure that only one modal opens in MCP scenario
        if (!$A.util.isEmpty(carePlanId) && !$A.util.isEmpty(component.get("v.carePlanId")) && carePlanId != component.get("v.carePlanId")) {
            return;
        }
        var tempMap = new Object();
        tempMap['CarePlan__c'] = component.get('v.carePlanId');

        if (event != null && event.getParam != null) {
            $A.createComponent(componentMarkup, {
                    fromWhere: "CarePlan",
                    patientId: component.get("v.patientId"),
                    carePlanId: component.get("v.carePlanId"),
                    problem: event.getParam("problemId"),
                    selectedGoal: event.getParam("goalId"),
                    AssignedTo: $A.get("$SObjectType.CurrentUser.Id"),
                    userDateFormat: component.get("v.userDateFormat"),
                    userDateTimeFormat: component.get("v.userDateTimeFormat"),
                    lookUpWhereClauseMap: tempMap,
                    topLevelParentId: component.get("v.carePlanId"),
                    parentListItemId: event.getParam("goalId")
                },
                function(view) {
                    component.set("v.modal", view);
                });
        } else {
            $A.createComponent(componentMarkup, {
                    fromWhere: "CarePlan",
                    patientId: component.get("v.patientId"),
                    carePlanId: component.get("v.carePlanId"),
                    AssignedTo: $A.get("$SObjectType.CurrentUser.Id"),
                    userDateFormat: component.get("v.userDateFormat"),
                    userDateTimeFormat: component.get("v.userDateTimeFormat"),
                    lookUpWhereClauseMap: tempMap
                },
                function(view) {
                    component.set("v.modal", view);
                });

        }
    },
    openEditTaskModal: function(component, event, componentMarkup) {

        if (event != null && event.getParam != null) {

            var tempMap = new Object();
            tempMap['CarePlan__c'] = component.get('v.carePlanId');

            var sObjectId = '';
            var problemId = '';
            var goalId = '';

            sObjectId = event.getParam("SObject").Id;
            problemId = event.getParam("SObject").CarePlanProblem__c;
            goalId = event.getParam("SObject").CarePlanGoal__c;

            $A.createComponent(componentMarkup, {

                    problem: problemId,
                    newTask: event.getParam("SObject"),
                    //id for edit task,
                    SObjectId: sObjectId,
                    action: event.getParam("taskType"),
                    AssignedTo: event.getParam("SObject").OwnerId,
                    PerformedBy: event.getParam("SObject").WhoId,
                    RelatedTo: event.getParam("SObject").WhatId,
                    fromWhere: "CarePlan",
                    patientId: component.get("v.patientId"),
                    carePlanId: component.get("v.carePlanId"),
                    selectedGoal: event.getParam("SObject").CarePlanGoal__c,
                    userDateFormat: component.get("v.userDateFormat"),
                    userDateTimeFormat: component.get("v.userDateTimeFormat"),
                    lookUpWhereClauseMap: tempMap,
                    topLevelParentId: component.get("v.carePlanId"),
                    parentListItemId: event.getParam("SObject").CarePlanGoal__c
                },
                function(view) {
                    component.set("v.modal", view);
                });
        }
    },
    showFieldSetModal: function(component, event, type) {
        var carePlanId = event.getParam("carePlanId");
        //To ensure that only one modal opens in MCP scenario
        if (!$A.util.isEmpty(carePlanId) && !$A.util.isEmpty(component.get("v.carePlanId")) && carePlanId != component.get("v.carePlanId")) {
            return;
        }
        var modal = [];
        component.set('v.modal', modal);

        if (type === "Create Problem") {
            component.set('v.treeItemToRefreshId', "");
            HC.invokeCreateRecord(
                'CarePlanProblem__c',
                $A.get("$Label.HealthCloudGA.Header_New_Problem"), {
                    CarePlan__c: component.get("v.carePlanId")
                }, {
                    columnSize: "1",
                    fieldSetName: "ProblemDefaultFieldSet",
                    auraId: "MandatorySection",
                    viewType: "Edit",
                    topLevelParentId: component.get("v.carePlanId"),
                    parentListItemId: component.get("v.carePlanId")
                },
                function(view) {
                    if (view.isValid() && component.isValid()) {
                        component.set("v.modal", view);
                    }
                }
            );
        } else if (type === "Create Goal") {
            var prePopMap = new Object();
            prePopMap["CarePlan__c"] = component.get("v.carePlanId");
            if (event != null && event.getParam != null) {
                prePopMap["CarePlanProblem__c"] = event.getParam("problemId");
            }
            component.set('v.treeItemToRefreshId', "");
            HC.invokeCreateRecord(
                'CarePlanGoal__c',
                $A.get("$Label.HealthCloudGA.Header_New_Goal"),
                prePopMap, {
                    columnSize: "1",
                    fieldSetName: "GoalDefaultFieldSet",
                    auraId: "MandatorySection",
                    viewType: "Edit",
                    topLevelParentId: component.get("v.carePlanId"),
                    parentListItemId: event.getParam("problemId")
                },
                function(view) {
                    if (view.isValid() && component.isValid()) {
                        component.set("v.modal", view);
                    }
                }
            );
        } else if (type === "Edit Problem") {
            var problemId = "";
            if (event != null && event.getParam != null) {
                problemId = event.getParam("problemId");
            }
            component.set('v.treeItemToRefreshId', component.get("v.carePlanId"));
            HC.invokeEditRecord(
                "CarePlanProblem__c",
                $A.get("$Label.HealthCloudGA.Menu_Item_Edit_Problem"),
                problemId, {
                    columnSize: "1",
                    fieldSetName: "ProblemDefaultFieldSet",
                    auraId: "MandatorySection",
                    viewType: "Edit",
                    topLevelParentId: component.get("v.carePlanId"),
                    parentListItemId: component.get("v.carePlanId")
                },
                function(view) {
                    if (view.isValid() && component.isValid()) {
                        component.set("v.modal", view);
                    }
                }
            );
        } else if (type === "Edit Goal") {
            var goalId = "";
            if (event != null && event.getParam != null) {
                goalId = event.getParam("goalId");
            }
            component.set('v.treeItemToRefreshId', event.getParam("problemId"));
            HC.invokeEditRecord(
                "CarePlanGoal__c",
                $A.get("$Label.HealthCloudGA.Menu_Item_Edit_Goal"),
                goalId, {
                    columnSize: "1",
                    fieldSetName: "GoalDefaultFieldSet",
                    auraId: "MandatorySection",
                    viewType: "Edit",
                    topLevelParentId: component.get("v.carePlanId"),
                    parentListItemId: event.getParam("problemId")
                },
                function(view) {
                    if (view.isValid() && component.isValid()) {
                        component.set("v.modal", view);
                    }
                }
            );
        }
    },

    handleActionEvent: function(component, event) {
        if (event.getParam("carePlanId") === component.get("v.carePlanId")) {
            //Create Goal
            if (event.getParam("type") === "Create Goal") {
                this.showFieldSetModal(component, event, event.getParam("type"));
            }
            //Create Task
            if (event.getParam("type") === "Create Task") {
                var cmpMarkup = "HealthCloudGA:HcTask";
                this.showModalComponent(component, event, cmpMarkup);
            }
            //Edit Task
            if (event.getParam("type") === "Edit Task") {
                var cmpMarkup = "HealthCloudGA:HcTask";
                this.openEditTaskModal(component, event, cmpMarkup);
            }
            //Mark Complete -TO DO
            if (event.getParam("type") === "Mark Complete") {
                $A.get("e.HealthCloudGA:HcComponentStatusEvent").setParams({
                    status: "SUCCESS",
                    message: "Task Completed!"
                }).fire();
            }
            //Edit Problem
            if (event.getParam("type") === "Edit Problem") {
                this.showFieldSetModal(component, event, event.getParam("type"));
            }
            //Edit Goal
            if (event.getParam("type") === "Edit Goal") {
                this.showFieldSetModal(component, event, event.getParam("type"));
            }
        }
    },

    hideDetailComponent: function(component, event) {
        var ele = document.getElementById("health1-careteamdetail");
        $A.util.removeClass(ele, "slideLeft");
    },

    resetModalComponent: function(component, event) {
        var modal = component.get('v.modal');
        if (modal != undefined && modal.length > 0) {
            component.set('v.modal', []);
        }
    },

    openCaseTeamTab: function(component, event, helper) {
        var tabName = component.get("v.carePlanSubject");
        if (!$A.util.isUndefined(tabName))
            tabName = $A.get("$Label.HealthCloudGA.Collaboration") + ':' + tabName;
        var patientId = component.get("v.patientId");
        var carePlanId = component.get("v.carePlanId");
        var isSubtabOpened = HC.openCaseTeamSubTab(patientId, carePlanId, tabName, true);
        if (!isSubtabOpened) {
            this.showToastMessage("ERROR", $A.get("$Label.HealthCloudGA.Msg_Error_General"));
        }
    },

    showToastMessage: function(status, msg) {
        $A.get("e.HealthCloudGA:HcComponentStatusEvent").setParams({
            status: status,
            message: msg,
        }).fire();
    },

    handleRefresh: function(component, sObjectName, recordId, newParentId, oldParentId, topLevelParentId, event) {
        var carePlanId = component.get("v.carePlanId");
        if (sObjectName == 'Task' || sObjectName == 'CarePlanGoal__c') {
            var refreshEvent = $A.get("e.HealthCloudGA:HcCarePlanRefreshEvent");
            refreshEvent.setParams({
                "sObjectName": sObjectName,
                "recordId": recordId,
                "newParentId": newParentId,
                "oldParentId": oldParentId,
                "topLevelParentId": topLevelParentId
            });
            refreshEvent.fire();
        } else if (sObjectName == 'CarePlanProblem__c' && (oldParentId == carePlanId || newParentId == carePlanId)) {
            var activeTabId = component.get("v.activeTabId");
            if( activeTabId == 'problems_goals' ) {
                this.getProblems(component);
            } else if( activeTabId == 'tasks' ) {
                component.set("v.refreshProblemsTab", true);
            }
        }
    },

    handleMessageEvent: function(component, event) {
        var modal = [];
        var status = event.getParam('status');
        component.set('v.modal', modal);
        if (status === 'CANCELLED' ||  $A.util.isUndefinedOrNull(status)){
            return;
        }

        var messageBody = {
            message: event.getParam('message')
        };
        this.showToast(component, messageBody, true, status.toLowerCase());
    }
})