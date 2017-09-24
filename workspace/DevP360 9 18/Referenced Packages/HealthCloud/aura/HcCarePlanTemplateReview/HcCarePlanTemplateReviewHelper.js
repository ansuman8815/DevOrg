/*
 * Copyright © 2016 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 *
 * @since 204
 */
({
    commitData: function(component) {
        var appEvent = $A.get("e.HealthCloudGA:HcToggleSpinnerEvent");
        appEvent.setParams({ "isVisible": true });
        appEvent.fire();

        var action = component.get("c.applyCarePlanTemplates");
        var payLoad = JSON.stringify(this.getItemsForCommit(component));
        var careCoordinatorMemberRecord = component.get("v.careCoordinatorSelectedValue");
        var patientUser = component.get("v.patientUser");

        action.setParams({
            "payLoad": payLoad,
            "dueDateString": component.get("v.dueDate"),
            "patientId": patientUser.memberId,
            "careCoordinatorId": careCoordinatorMemberRecord.memberId,
            "carePlanId": careCoordinatorMemberRecord.parentId,
            "isPatientUser": $A.util.getBooleanValue(patientUser["isCommunityEnabled"])
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            var toast = component.find('toast-message');
            if (state === "SUCCESS") {
                var returnErrorMessage = response.getReturnValue().errorMsg;
                if ($A.util.isUndefinedOrNull(returnErrorMessage)) {
                    var returnMessage = response.getReturnValue().objectData.message;
                    //If success and not an error scenario.
                    var afterApplyEvent = component.getEvent("afterApplyEvent");
                    afterApplyEvent.setParams({
                        "isSuccess": true,
                        "successMessage": returnMessage
                    });
                    afterApplyEvent.fire();
                } else {
                    //If success and back error happened.
                    toast.set('v.content', { 'type': 'error', 'message': returnErrorMessage });
                }
            } else {
                var errors = response.getError();
                var errorMessage = $A.get("$Label.HealthCloudGA.Msg_Error_General");
                if (!$A.util.isEmpty(errors)) {
                    errorMessage = errors[0].message;
                }
                toast.set('v.content', { 'type': 'error', 'message': errorMessage });
            }
            var appEvent = $A.get("e.HealthCloudGA:HcToggleSpinnerEvent");
            appEvent.setParams({ "isVisible": false });
            appEvent.fire();
        });
        $A.enqueueAction(action);
    },

    getItemsForCommit: function(component) {
        var selectedItems = component.get("v.selectedCarePlanTemplatesFromCustomize");
        var filteredItems = [];
        for (var templateCounter = 0; templateCounter < selectedItems.length; templateCounter++) {
            var template = selectedItems[templateCounter];
            // remove unselected problems
            var selectedProblems = [];
            for (var problemCounter = 0; problemCounter < template.problemResponses.length; problemCounter++) {
                var problem = template.problemResponses[problemCounter];
                if (this.isItemSelected(problem)) {
                    if (!$A.util.isUndefinedOrNull(problem.goalResponses)) { 
                        var selectedGoals = [];
                        for (var goalCounter = 0; goalCounter < problem.goalResponses.length; goalCounter++) {
                            var goal = problem.goalResponses[goalCounter];
                            if (this.isItemSelected(goal)) {
                                if (!$A.util.isUndefinedOrNull(goal.taskResponses)) {
                                    var selectedTasks = [];
                                    for (var taskCounter = 0; taskCounter < goal.taskResponses.length; taskCounter++) {
                                        var task = goal.taskResponses[taskCounter];
                                        if (this.isItemSelected(task)) {
                                            selectedTasks.push(task);
                                        }
                                    }
                                    goal.taskResponses = selectedTasks;
                                }
                                selectedGoals.push(goal);
                            }
                        }
                        problem.goalResponses = selectedGoals;
                    }
                    selectedProblems.push(problem);
                }
            }
            template.problemResponses = selectedProblems;
            filteredItems.push(template);
        }
        return filteredItems;
    },

    isItemSelected: function(responseObject) {
        if (!$A.util.isUndefinedOrNull(responseObject)) {
            return $A.util.isUndefinedOrNull(responseObject.selected) || responseObject.selected;
        }

        return false;
    }
})