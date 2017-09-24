/*
 * Copyright © 2016 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 *
 * @since 204
 */
({
    handleCarePlanEvent: function(component, event, helper) {
        if (event.getParam("type") === "EXPAND") {
            helper.expand(component, event, helper);
        }
    },

    expand: function(component, event, helper) {
        component.set('v.expanded', !component.get('v.expanded'));
        var goalSelected = component.get("v.goalChecked");
        if(!goalSelected){
            var elems = component.find("taskcheckbox");
            if (!$A.util.isArray(elems)) {
                elems = [elems];
            }
            if (!$A.util.isUndefinedOrNull(elems) && !$A.util.isEmpty(elems)) {
                for (var i = 0; i < elems.length; i++) {
                    elems[i].set("v.value", false);
                }
            }
        }
    },

    handleCheckBoxEvent: function(component, event, helper) {
        var checked = event.getParam("checked");

        this.toggleTaskCheckboxes(component, checked);

        //Throw an event to let Customize component know about the Problem checkbox is changed
        var goalCheckboxEvent = component.getEvent("goalCheckboxEvent");
        if (goalCheckboxEvent != null) {
            goalCheckboxEvent.setParams({
                "checked": checked,
                "templateId": component.get("v.templateId"),
                "problemId": component.get("v.problemId"),
                "goalId": component.get("v.goalId")
            });
            goalCheckboxEvent.fire();
        }
    },

    // when the parent checkbox is clicked
    problemCheckboxClicked: function(component, event) {
        var params = event.getParam('arguments');
        var checked = false;

        if (params) {
            checked = params.checked;
        }

        var goalHeader = component.find("goalHeader");
        goalHeader.carePlanHeaderCheckBoxMethod(checked);

        this.toggleTaskCheckboxes(component, checked);
    },

    handleTaskCheckboxEvent: function(component, event, helper) {
        var checked = event.getParam("checked");
        var taskId = event.getParam("Id");

        //if task is checked select the goal checkbox too, if goal is not checked
        if (checked) {
            var goalHeader = component.find("goalHeader");
            if (!goalHeader.find("checkbox").get("v.value")) {
                goalHeader.carePlanHeaderCheckBoxMethod(checked);
            }
        }

        var goalCheckboxEvent = component.getEvent("goalCheckboxEvent");
        if (goalCheckboxEvent != null) {
            goalCheckboxEvent.setParams({
                "checked": checked,
                "templateId": component.get("v.templateId"),
                "problemId": component.get("v.problemId"),
                "goalId": component.get("v.goalId"),
                "taskId": taskId
            });
            goalCheckboxEvent.fire();
        }
    },

    // when a task checkbox is clicked
    onTaskCheckboxClicked: function(component, event) {
        event.stopPropagation();


        var checked = event.getSource().get('v.value');
        var Id = event.getSource().get('v.name');

        var checkboxEvent = component.getEvent("taskCheckboxEvent");
        if (checkboxEvent != null) {
            checkboxEvent.setParams({
                "checked": checked,
                "Id": Id
            });
            checkboxEvent.fire();
        }
    },

    // toggle task checkboxes
    toggleTaskCheckboxes: function(component, checked) {
        var taskCheckboxes = component.find("taskcheckbox");
        if (!$A.util.isUndefinedOrNull(taskCheckboxes)) {
            if (!$A.util.isArray(taskCheckboxes)) {
                taskCheckboxes = [taskCheckboxes];
            }
        }
        if (!$A.util.isEmpty(taskCheckboxes)) {
            for (var i = 0; i < taskCheckboxes.length; i++) {
                taskCheckboxes[i].set("v.value", checked);
            }
        }
    },

    calculateDueDate: function(component, event, helper){
        if(component.get("v.review")){
            var taskList = component.get("v.taskItems");
            if (!$A.util.isUndefinedOrNull(taskList)) {
                for(var i = 0; i < taskList.length; i++){
                    var task = taskList[i];
                    task.calculatedDueDate = this.getTaskDueDate(component, helper, task.offset);
                }
            }
        }
    },

    getTaskDueDate: function(component, helper, offset) {
        var inputDate = new Date();
        var cmpDate = component.get("v.dueDate");
        if (!$A.util.isUndefinedOrNull(cmpDate)) {
            var dateParts = cmpDate.split('-');

            if ($A.util.isArray(dateParts) && dateParts.length >= 3) {
                var year = parseInt(dateParts[0], 10);
                var month = parseInt(dateParts[1], 10);
                var day = parseInt(dateParts[2], 10);
                // Javascript Date's month is 0-based, so we have to convert the 1-12 value range to (0-11), hence -1
                inputDate = new Date(year, (month - 1), day);
            }
        } else {
            // default is going to be used here
        }

        // add the offset days to the input date
        // we must set the new Date in constructor in order to preserve the month/year overflow logic
        var taskDueDate = new Date(inputDate);
        taskDueDate.setDate(inputDate.getDate() + offset);
        return helper.getUserLocalizedDate(taskDueDate, 'L');
    }
})