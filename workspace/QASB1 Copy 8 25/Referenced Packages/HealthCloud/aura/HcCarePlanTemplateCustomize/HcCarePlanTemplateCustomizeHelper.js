/*
 * Copyright © 2016 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 *
 * @since 204
 */
({
    checkboxEvent: function(component, event, helper) {
        var templateId = event.getParam("templateId");
        var problemId = event.getParam("problemId");
        var goalId = event.getParam("goalId");
        var taskId = event.getParam("taskId");
        var checked = event.getParam("checked");
        var selectedCarePlanTemplates = component.get("v.selectedCarePlanTemplates");

        if (templateId != null) {
            var template = helper.findTemplate(component, event, helper, templateId, selectedCarePlanTemplates);
            //Event is fired from goal
            if (!$A.util.isUndefinedOrNull(problemId) && !$A.util.isEmpty(problemId)) {
                var problem = helper.findProblemFromTemplate(component, event, helper, problemId, template);
                //Event is fired from goal
                if (!$A.util.isUndefinedOrNull(goalId) && !$A.util.isEmpty(goalId)) {
                    var goal = helper.findGoalFromProblem(component, event, helper, goalId, problem);
                    //Event is fired from task
                    if (taskId != null) {
                        //if task is clicked
                        var task = helper.findTaskFromGoal(component, event, helper, taskId, goal);
                        helper.taskCheckBoxEvent(component, event, helper, problem, goal, task, checked);
                    } else {
                        //if goal is clicked
                        helper.goalCheckBoxEvent(component, event, helper, problem, goal, checked);
                    }
                } else {                  
                    helper.problemCheckBoxEvent(component, event, helper, problem, checked);
                }
            } else {
                //if only template id was passed in 
            }
             component.set("v.selectedCarePlanTemplates", selectedCarePlanTemplates);
        }
    },

    //if problem is clicked, problem has called the event
    problemCheckBoxEvent: function(component, event, helper, problem, checked) {
        problem.selected = checked;
        //go through goals of problem if they exist and set them to true
        if (!$A.util.isUndefinedOrNull(problem.goalResponses) && !$A.util.isEmpty(problem.goalResponses)) {
            for (var goIdx = 0; goIdx < problem.goalResponses.length; goIdx++) {
                var aGoal = problem.goalResponses[goIdx];
                aGoal.selected = checked;
                //go through tasks of goals if they exist and set them to checked
                if (!$A.util.isUndefinedOrNull(aGoal.taskResponses) && !$A.util.isEmpty(aGoal.taskResponses)) {
                    for (var taIdx = 0; taIdx < aGoal.taskResponses.length; taIdx++) {
                        var aTask = aGoal.taskResponses[taIdx];
                        aTask.selected = checked;
                    }
                }
            }
        }
    },

    goalCheckBoxEvent: function(component, event, helper, problem, goal, checked) {
        goal.selected = checked;
        //go through tasks if they exist and make it checked
        if (!$A.util.isUndefinedOrNull(goal.taskResponses) && !$A.util.isEmpty(goal.taskResponses)) {
            for (var taIdx = 0; taIdx < goal.taskResponses.length; taIdx++) {
                var aTask = goal.taskResponses[taIdx];
                aTask.selected = checked;
            }
        }
        //Set the Problem selected status to true as child is true
        if (checked) {
            problem.selected = true;
        }
    },

    taskCheckBoxEvent: function(component, event, helper, problem, goal, task, checked) {
        task.selected = checked;
        //Set the Problem and goal selected status to true as child is true
        if (checked) {
            problem.selected = true;
            goal.selected = true;
        }
    },

    findTemplate: function(component, event, helper, templateId, selectedCarePlanTemplates) {
        var aTemplate = null;

        // Traverse templates
        for (var teIdx = 0; teIdx < selectedCarePlanTemplates.length; teIdx++) {
            aTemplate = selectedCarePlanTemplates[teIdx];
            if (aTemplate.carePlanTemplateId === templateId) {
                return aTemplate;
            }
        }
        return null;
    },

    findProblemFromTemplate: function(component, event, helper, problemId, aTemplate) {
        var aProblem = null;

        // Traverse problems
        for (var prIdx = 0; prIdx < aTemplate.problemResponses.length; prIdx++) {
            aProblem = aTemplate.problemResponses[prIdx];
            if (aProblem.problemId === problemId) {
                return aProblem;
            }
        }
        return null;
    },

    findGoalFromProblem: function(component, event, helper, goalId, aProblem) {
        var aGoal = null;

        // Traverse goals
        for (var goIdx = 0; goIdx < aProblem.goalResponses.length; goIdx++) {
            aGoal = aProblem.goalResponses[goIdx];
            if (aGoal.goalId === goalId) {
                return aGoal;
            }
        }
        return null;
    },

    findTaskFromGoal: function(component, event, helper, taskId, aGoal) {
        var aTask = null;
        // Traverse Tasks
        for (var taIdx = 0; taIdx < aGoal.taskResponses.length; taIdx++) {
            var aTask = aGoal.taskResponses[taIdx];
            if (aTask.taskId === taskId) {
                return aTask;
            }
        }
        return null;
    },

})