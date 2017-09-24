/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description helper of create task component
 * @since 196
 */

({
    afterRerenderMethod: function(component) {
        var comp;
        //First radio
        if (component != undefined && component.get("v.isFirstRadio") == "true") 
        {
            //daily
            component.find("recurrenceIntervalDaily").getElement().disabled = true;
            component.find("EveryWeekdayDaily").getElement().checked = true;
            component.find("EveryDays").getElement().checked = false;
            //monthly
            component.find("onDay").getElement().checked = true;
            component.find("onThe").getElement().checked = false;
            component.find("rDayOfMonthSelect").getElement().disabled = false;
            component.find("recurrenceIntervalMonthly1").getElement().disabled = false;
            component.find("recInstance").getElement().disabled = true;
            component.find("recDayOfWeek").getElement().disabled = true;
            component.find("recurrenceIntervalMonthly2").getElement().disabled = true;
            //yearly
            component.find("onEveryYearly").getElement().checked = true;
            component.find("onTheYearly").getElement().checked = false;
            component.find("recMonthOfYearFirst").getElement().disabled = false;
            component.find("rDayOfMonthSelectYearly").getElement().disabled = false;
            component.find("recInstanceSecond").getElement().disabled = true;
            component.find("recDayOfWeekYearly").getElement().disabled = true;
            component.find("recMonthOfYearSecond").getElement().disabled = true;
        }
        if (component != undefined && component.get("v.isSecondRadio") == "true") 
        {
            //daily
            component.find("recurrenceIntervalDaily").getElement().disabled = false;
            component.find("EveryWeekdayDaily").getElement().checked = false;
            component.find("EveryDays").getElement().checked = true;
            //monthly
            component.find("onDay").getElement().checked = false;
            component.find("onThe").getElement().checked = true;
            component.find("rDayOfMonthSelect").getElement().disabled = true;
            component.find("recurrenceIntervalMonthly1").getElement().disabled = true;
            component.find("recInstance").getElement().disabled = false;
            component.find("recDayOfWeek").getElement().disabled = false;
            component.find("recurrenceIntervalMonthly2").getElement().disabled = false;
            //yearly
            component.find("onEveryYearly").getElement().checked = false;
            component.find("onTheYearly").getElement().checked = true;
            component.find("recMonthOfYearFirst").getElement().disabled = true;
            component.find("rDayOfMonthSelectYearly").getElement().disabled = true;
            component.find("recInstanceSecond").getElement().disabled = false;
            component.find("recDayOfWeekYearly").getElement().disabled = false;
            component.find("recMonthOfYearSecond").getElement().disabled = false;
        }
        if (component != undefined && component.get("v.clearOnRecurTypeChangeAttr") == true) 
        {
            comp = component.find("recurrenceIntervalDaily");
            if (comp != null) {
                //daily
                component.find("recurrenceIntervalDaily").getElement().disabled = true;
                component.find("recurrenceIntervalDaily").getElement().value = "";
                component.find("EveryWeekdayDaily").getElement().checked = false;
                component.find("EveryDays").getElement().checked = false;
            }

            comp = component.find("recurrenceIntervalMonthly1");
            if (comp != null) {
                //monthly
                component.find("onDay").getElement().checked = false;
                component.find("onThe").getElement().checked = false;
                component.find("rDayOfMonthSelect").getElement().disabled = true;
                component.find("rDayOfMonthSelect").getElement().value = "1";
                component.find("recurrenceIntervalMonthly1").getElement().disabled = true;
                component.find("recurrenceIntervalMonthly1").getElement().value = "";
                component.find("recInstance").getElement().disabled = true;
                component.find("recInstance").getElement().value = "First";
                component.find("recDayOfWeek").getElement().disabled = true;
                component.find("recurrenceIntervalMonthly2").getElement().disabled = true;
                component.find("recurrenceIntervalMonthly2").getElement().value = "";

                component.find("EndsSelect").getElement().value = "OnDate";
                component.find("NumberOfOccurence").set('v.value',"");
                comp = component.find("RecurrenceEndDateOnlyDiv");
                $A.util.removeClass(comp.getElement(), "invisible");
                comp = component.find("NumberOfOccurenceDiv");
                $A.util.addClass(comp.getElement(), "invisible");
            }

            comp = component.find("onEveryYearly");
            if (comp != null) 
            {
                //yearly
                component.find("onEveryYearly").getElement().checked = false;
                component.find("onTheYearly").getElement().checked = false;
                component.find("recMonthOfYearFirst").getElement().disabled = true;
                component.find("recMonthOfYearFirst").getElement().value = "January";
                component.find("rDayOfMonthSelectYearly").getElement().disabled = true;
                component.find("rDayOfMonthSelectYearly").getElement().value = "1";
                component.find("recInstanceSecond").getElement().disabled = true;
                component.find("recInstanceSecond").getElement().value = "First";
                component.find("recDayOfWeekYearly").getElement().disabled = true;
                component.find("recMonthOfYearSecond").getElement().disabled = true;
                component.find("recMonthOfYearSecond").getElement().value = "January";

                component.find("EndsSelect").getElement().value = "OnDate";
                component.find("NumberOfOccurence").set('v.value',"");
                comp = component.find("RecurrenceEndDateOnlyDiv");
                $A.util.removeClass(comp.getElement(), "invisible");
                comp = component.find("NumberOfOccurenceDiv");
                $A.util.addClass(comp.getElement(), "invisible");
            }
            component.set("v.clearOnRecurTypeChangeAttr", false);
        }
    },

    initCreateTask: function(component, event, helper) {
        
        if (component.get("v.fromWhere") == 'CarePlan') 
        {
            component.set("v.patientMsg", $A.get("$Label.HealthCloudGA.Header_New_Task"));
            if (undefined != component.get("v.problem") && component.get("v.problem") != '') 
            {
                this.processGoals(component);
            }
        } 
        else if (component.get("v.fromWhere") == 'CareTeam') 
        {
            if (component.get("v.memberObj") != null) 
            {
                var memberObj = component.get("v.memberObj");
                component.set("v.patientMsg", HC.format($A.get("$Label.HealthCloudGA.Header_New_Task_For_Name"), memberObj.name));
                component.set("v.carePlanId", memberObj.parentId);
            }
        } 
        else 
        {
            var patientIds = component.get("v.patientIds");
            if (patientIds.length == 1) 
            {
                component.set("v.patientMsg", $A.get("$Label.HealthCloudGA.Header_New_Task_For_1_Patient"));
            } 
            else 
            {
                component.set("v.patientMsg", HC.format($A.get("$Label.HealthCloudGA.Header_New_Task_For_N_Patients"), patientIds.length));
            }
        }
    },

    initEditTask: function(component, event, helper) {
        component.set("v.patientMsg", $A.get("$Label.HealthCloudGA.Field_Label_Edit_Task"));
        if (undefined != component.get("v.problem") && component.get("v.problem") != '') 
        {
            this.processGoals(component);
        }
    },

    createTask: function(component, event) {

        component.set("v.headerErrMsg", "none");
        var task = this.populateTaskObject(component);
        var action = component.get("c.createTasks");
        var assignedTo = component.get("v.AssignedTo");

        var taskObj = JSON.stringify(task);
        action.setParams({
            "taskObjJSON": taskObj,
            "assignedTo": assignedTo,
            "action": component.get('v.action'),
            "mapAccountToCarePlan": component.get('v.mapAccountToCarePlan')
        });

        action.setCallback(this, function(response) {
            var state = response.getState();
            var returnMsg = response.getReturnValue();
            var memberObj = {};
            memberObj["carePlanId"] = component.get("v.carePlanId");
            memberObj["sObjectName"] = 'Task';
            memberObj["parentListItemId"] = component.get("v.parentListItemId");
            memberObj["topLevelParentId"] = component.get("v.topLevelParentId");

            if (state === "SUCCESS") 
            {
                if (returnMsg.indexOf('success') > -1)
                {
                    var msg;
                    if (component.get('v.action') == 'UpdateTask')
                    {
                        msg = $A.get("$Label.HealthCloudGA.Msg_Field_Set_Edit");
                    }
                    else
                    {
                        msg = $A.get("$Label.HealthCloudGA.Msg_Field_Set_Success");
                    }

                    // In addition to notification, also refreshes Problems & Goals tab
                    $A.get("e.HealthCloudGA:HcComponentStatusEvent").setParams({
                        status: "SUCCESS",
                        message: msg,
                        memberObj: memberObj
                    }).fire();

                    var dataChangedEvent = $A.get("e.HealthCloudGA:HcCarePlanDataChangedEvent");
                    if (dataChangedEvent != undefined) {
                        dataChangedEvent.setParams({
                            "record": task,
                            "oldParentId": component.get("v.parentListItemId"),
                            "newParentId": task.CarePlanGoal__c,
                            "topLevelParentId": component.get("v.carePlanId"),
                            "sObjectName": "Task"
                        });
                        dataChangedEvent.fire();
                    }

                    // Refreshes only Tasks tab
                    $A.get("e.HealthCloudGA:HcCarePlanCmpEvent").setParams({
                        type: "refresh"
                    }).fire();
                    
                    // adding scrollbar back to body
                    component.set('v.isShow', false);
                    this.noBodyScroll(component);

                    var isHealthConsole = component.get("v.isHealthConsole");
                    var closeEvent = component.getEvent("HcCareTeamEvent");

                    if (isHealthConsole == "true") 
                    {
                        closeEvent.setParams({
                            "type": "CANCELMODAL",
                            "message": "Care team detail component save task and close modal"
                        });
                        // adding scrollbar back to body
                        component.set('v.isShow', false);
                        this.noBodyScroll(component);
                        closeEvent.fire();
                    }

                    if (component.get("v.openNewModal") == 'true') 
                    {
                        var appEvent = $A.get("e.HealthCloudGA:HcCarePlanCmpEvent");
                        appEvent.setParams({
                            type: "Create Task",
                            problemId: component.get("v.problem"),
                            goalId: component.get("v.selectedGoal"),
                            carePlanId: component.get("v.carePlanId")
                        });
                        appEvent.fire();
                    }
                } 
                else 
                {
                    component.set("v.headerErrMsg", HC.format($A.get("$Label.HealthCloudGA.Text_Task_Update_Status"), returnMsg));
                    this.pleaseWait(component, false, 'task-modal');
                }

            } 
            else 
            {
                $A.get("e.HealthCloudGA:HcComponentStatusEvent").setParams({
                    status: "ERROR",
                    message: $A.get("$Label.HealthCloudGA.Msg_Error_Unable_To_Create_Task"),
                    memberObj: memberObj
                }).fire();

                var errors = response.getError();
                console.log(errors[0].message);

                var taskEvent = component.getEvent("HcCareTeamEvent");
                taskEvent.setParams({
                    "type": "REMOVEMODAL",
                    "message": $A.get("$Label.HealthCloudGA.Msg_Error_Unable_To_Create_Task"),
                    "memberObj": memberObj
                });
                taskEvent.fire();
            }
        });
        $A.enqueueAction(action);
    },

    populateTaskObject: function(component) {
        var fromWhere = component.get("v.fromWhere");
        var newTask = component.get("v.newTask");
        var task = {};
        task['Subject'] = component.find("tasksubject").getElement().value;
        task['Description'] = component.find("desc").getElement().value;
        task['TaskType__c'] = component.find("taskType").getElement().value;
        task['Status'] = component.find('statusType').getElement().value;
        task['Priority'] = component.find('priorityType').getElement().value;
        task['SortOrder__c'] = component.find('sortorder').get('v.value');

        /*WhoId - Name is a Contact - Performed By.*/
        if (component.get("v.PerformedBy") != null && component.get("v.PerformedBy") != '') {
          task['WhoId'] = component.get("v.PerformedBy");
        }
        if (component.get('v.SObjectId') != '') {
          task['Id'] = component.get('v.SObjectId');
        }
        if (component.get("v.carePlanId") != null && component.get("v.carePlanId") != '') {
          //WhatId is RelatedTo which is always Care PlanId and hidden from UI
          task['WhatId'] = component.get("v.carePlanId");
        }
        if (component.get("v.AssignedTo") != null && component.get("v.AssignedTo") != '') {
          task['OwnerId'] = component.get("v.AssignedTo");
        }
        if (fromWhere === 'CarePlan' || fromWhere === 'CareTeam') {
          task['CarePlanProblem__c'] = component.get("v.problem");
          task['CarePlanGoal__c'] = component.find("health1-careplan-goal-selection").getElement().value;
        }
        if (component.find("isRecurring") != null && component.find("isRecurring").getElement().checked) {

          var firstRadio = component.get("v.isFirstRadio");
          var secondRadio = component.get("v.isSecondRadio");
          var RecurrenceType = component.find("RecurrenceType").getElement().value;
          task['IsRecurrence'] = true;
          task['RecurrenceType'] = RecurrenceType;
          task['RecurrenceStartDateOnly'] = moment(newTask["RecurrenceStartDateOnly"], 'YYYY-MM-DD').toISOString();
          task['RecurrenceEndDateOnly'] = moment(newTask["RecurrenceEndDateOnly"], 'YYYY-MM-DD').toISOString();
          var intervalDaily = parseInt(component.find("recurrenceIntervalDaily").getElement().value);
          var intervalMonthly1 = parseInt(component.find("recurrenceIntervalMonthly1").getElement().value);
          var intervalMonthly2 = parseInt(component.find("recurrenceIntervalMonthly2").getElement().value);
          var dayOfMonth = parseInt(component.find("rDayOfMonthSelect").getElement().value);
          var instanceMonthly = component.find("recInstance").getElement().value;
          var monthOfYearFirst = component.find("recMonthOfYearFirst").getElement().value;
          var monthOfYearSecond = component.find("recMonthOfYearSecond").getElement().value;
          var dayOfMonthYearly = parseInt(component.find("rDayOfMonthSelectYearly").getElement().value);
          var instanceYearly = component.find("recInstanceSecond").getElement().value;
          //Recurs Daily
          if (RecurrenceType == 'RecursDaily') {
            if (firstRadio == "true") {
              var weekdayMask = 62;
              task['RecurrenceDayOfWeekMask'] = parseInt(weekdayMask);
              task['RecurrenceType'] = "RecursEveryWeekday";

            } else if (secondRadio == "true") {
              task['RecurrenceInterval'] = intervalDaily;
            }
          }
          //Recurs Weekly
          else if (RecurrenceType == 'RecursWeekly') {
            task['RecurrenceInterval'] = parseInt(component.find("RecurrenceInterval").getElement().value);
            task['RecurrenceDayOfWeekMask'] = newTask["RecurrenceDayOfWeekMask"];
          }
          //Recurs Monthly
          else if (RecurrenceType == 'RecursMonthly') {
            if (firstRadio == "true") {
              task['RecurrenceInterval'] = intervalMonthly1;
              task['RecurrenceDayOfMonth'] = dayOfMonth;
            } else if (secondRadio == "true") {
              task['RecurrenceInterval'] = intervalMonthly2;
              task['RecurrenceDayOfWeekMask'] = parseInt(component.find("recDayOfWeek").getElement().value);
              task['RecurrenceInstance'] = instanceMonthly;
              task['RecurrenceType'] = "RecursMonthlyNth";
            }
          }
          //Recurs Yearly
          else if (RecurrenceType == 'RecursYearly') {
            if (firstRadio == "true") {
              task['RecurrenceMonthOfYear'] = monthOfYearFirst;
              task['RecurrenceDayOfMonth'] = dayOfMonthYearly;
            } else if (secondRadio == "true") {
              task['RecurrenceType'] = "RecursYearlyNth";
              task['RecurrenceInstance'] = instanceYearly;
              task['RecurrenceDayOfWeekMask'] = parseInt(component.find("recDayOfWeekYearly").getElement().value);
              task['RecurrenceMonthOfYear'] = monthOfYearSecond;
            }
          }
        } else {
            var actDate = moment(newTask['ActivityDate'], 'YYYY-MM-DD');
            task['ActivityDate'] = actDate.toISOString();
        }
        return task;
    },

    getStandardFieldNames: function(component) {
      var action = component.get("c.getStandardFieldNames");

      action.setCallback(this, function(response) {

        if (response.getState() === "SUCCESS") {
          var retVal = response.getReturnValue();

          if (retVal.meta.columnsHeaderMap) {
            component.set("v.basicFieldLabels", retVal.meta.columnsHeaderMap);
          }
        }
        //Error from backend
        else{
          throw new Error($A.get("$Label.HealthCloudGA.Msg_Error_General"));
        }
      });
      $A.enqueueAction(action);
    },

    getPicklistValuesForTaskFields: function(component) {
        var action = component.get("c.getPicklistValuesForTaskFields");
        var fieldList = ["Priority", "Status", "TaskType__c"];
        var str = fieldList.toString();
        action.setParams({
            "taskFields": str
        });

        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var resultList = response.getReturnValue();
                var action = component.get("v.action");
                if (resultList != null) {
                    for (var i = 0; i < resultList.length; i++) {
                        var type = resultList[i].type;
                        var valueLabelMap = resultList[i].valueLabelMap;
                        var defaultValue = resultList[i].defaultValue;
                        var cols2 = [];
                        for (var key in valueLabelMap) {
                            cols2.push({
                                value: valueLabelMap[key],
                                key: key
                            });
                        }
                        if (type == 'TaskType__c') {
                            component.set("v.type", cols2);
                            if (action != 'UpdateTask') {
                                component.set('v.newTask.TaskType__c', defaultValue);
                            }
                        }
                        if (type == 'Priority') {
                            component.set("v.priority", cols2);
                            if (action != 'UpdateTask') {
                                component.set('v.newTask.Priority', defaultValue);
                            }
                        }
                        if (type == 'Status') {
                            component.set("v.status", cols2);
                            if (action != 'UpdateTask') {
                                component.set('v.newTask.Status', defaultValue);
                            }
                        }
                    }
                }
            }
        });
        $A.enqueueAction(action);
    },

    getActivityTaskType: function(component) {
        var action = component.get("c.getActivityTaskType");
        action.setCallback(this, function(response) {
          var state = response.getState();
          if (state === "SUCCESS") {
            component.set("v.type", response.getReturnValue());
          }
        });
        $A.enqueueAction(action);
    },

    validationCheck: function(component, event, helper) {
        var userDateFormat = component.get('v.userDateFormat').toUpperCase();
        var isCheckPass = true;
        var msg = "";
        var comp = null;
        var errorString = $A.get("$Label.HealthCloudGA.Msg_Error_Required_Field_Missing");

        //subject must be entered
        comp = component.find("tasksubject");
        var value = comp.getElement().value;

        // reset subject error message value
        component.set("v.erMsg[1]", "");
        // check if we have an error
        if (!value || value == "") {
          isCheckPass = false;
          // set error message
          // Attempt to get localized field label before using hard-coded.
          var locSubject = component.get("v.basicFieldLabels") ? component.get("v.basicFieldLabels").Subject : "Subject";
          component.set("v.erMsg[1]", HC.format(errorString, locSubject));
        }

        //
        // due date should be populated if not recurring
        var recurCom = component.find("isRecurring");
        var isRecurring = false;
        // if recurring checkbox exist set isRecurring value
        // :: allows us to know if this is a recurring event or not
        if (recurCom != null && recurCom.getElement() != null) {
          isRecurring = recurCom.getElement().checked;
        }

        // reset due date error message value
        component.set("v.erMsg[2]", "");
        // if due date is empty, error
        var dueDateComp = component.find("dueDate");
        if ($A.util.isEmpty(dueDateComp.get("v.value"))) {
          // if we're not recurring, error since due date is required
          // :: otherwise no error since a blank due date is valid
          if (!isRecurring) {
            isCheckPass = false;
            // set error message
            // Attempt to get localized field label before using hard-coded.
            var locDueDate = component.get("v.basicFieldLabels") ? component.get("v.basicFieldLabels").ActivityDate : "Due Date";
            component.set("v.erMsg[2]", HC.format(errorString, locDueDate));
          }
        }

        //RecurrenceEndDateOnly
        var endsSelect = component.find("EndsSelect");
        if (endsSelect != null && endsSelect.getElement() != null) {
          value = endsSelect.getElement().value;
          if (value == 'OnDate') {
            var newTask = component.get("v.newTask");
            var maxEndDate = moment(component.get("v.recurMaxEndDate"), userDateFormat);

            comp = component.find("RecurrenceEndDateOnly");
            if ($A.util.hasClass(comp, "error--form")) {
              $A.util.toggleClass(comp, "error--form");
            }
            msg = "";
            if (newTask["RecurrenceEndDateOnly"] == null || newTask["RecurrenceEndDateOnly"] == "") {
              msg = $A.get("$Label.HealthCloudGA.Msg_Error_Invalid_End_Date");
            } else {
              var enterdEndDate = moment(newTask["RecurrenceEndDateOnly"], 'YYYY-MM-DD');
              if (moment(maxEndDate).isBefore(enterdEndDate)) {
                msg = HC.format($A.get("$Label.HealthCloudGA.Msg_Error_End_Date_Over_Max"), moment(maxEndDate).format(userDateFormat).toString());
              }
            }
            if (msg.length > 1) {
              $A.util.toggleClass(comp, "error--form");
              isCheckPass = false;
            }
            component.set("v.erMsg[0]", msg);

          } else if (value == 'AfterOccurences') {

            var enteredOccurences = component.find("NumberOfOccurence").getElement().value;
            var MaxAllowOccurrences = component.get("v.recurMaxOccur");
            if (enteredOccurences > MaxAllowOccurrences || !enteredOccurences || enteredOccurences == "" || !MaxAllowOccurrences) {
              component.set("v.erMsg[2]", $A.get("$Label.HealthCloudGA.Msg_Error_Invalid_Number_Occurrences") + " ");
              isCheckPass = false;
            }
          }
        }

        if (component.find("RecurrenceType") != null && component.find("RecurrenceType").getElement() != null) {
          if (component.find("RecurrenceType").getElement().value == 'RecursDaily' && component.get("v.isSecondRadio") == "true") {
            value = component.find("recurrenceIntervalDaily").getElement().value;
            if (value == "" || isNaN(value)) {
              component.set("v.erMsg[3]", $A.get("$Label.HealthCloudGA.Msg_Error_Invalid_Interval") + " ");
              isCheckPass = false;
            } else {
              component.set("v.erMsg[3]", "");
            }
          }
          if (component.find("RecurrenceType").getElement().value == 'RecursMonthly' && component.get("v.isFirstRadio") == "true") {
            value = component.find("recurrenceIntervalMonthly1").getElement().value;
            if (value == "" || isNaN(value)) {
              component.set("v.erMsg[4]", $A.get("$Label.HealthCloudGA.Msg_Error_Invalid_Interval") + " ");
              isCheckPass = false;
            } else {
              component.set("v.erMsg[4]", "");
              component.set("v.erMsg[5]", "");
            }
          }
          if (component.find("RecurrenceType").getElement().value == 'RecursMonthly' && component.get("v.isSecondRadio") == "true") {
            value = component.find("recurrenceIntervalMonthly2").getElement().value;

            if (value == "" || isNaN(value)) {
              component.set("v.erMsg[5]", $A.get("$Label.HealthCloudGA.Msg_Error_Invalid_Interval") + " ");
              isCheckPass = false;

            } else {
              component.set("v.erMsg[4]", "");
              component.set("v.erMsg[5]", "");
            }
          }
        }
        return isCheckPass;

    },

    checkMaxEndDate: function(component, event, helper) {
        var userDateFormat = component.get('v.userDateFormat').toUpperCase();
        var startDate, endDate, intervalType, interval, noWeekend = false,
          limit;
        if (component.get("v.newTask.RecurrenceStartDateOnly") == null) {
          //use today's date ;
          startDate = moment(new Date());
        } else {
          startDate = moment(component.get("v.newTask.RecurrenceStartDateOnly"), 'YYYY-MM-DD');
        }
        endDate = moment().add(30, 'years');
        var comp = component.find("MaxAllowEndDateDiv");
        if ($A.util.hasClass(comp.getElement(), "invisible")) {
          $A.util.toggleClass(comp.getElement(), "invisible");
        }
        comp = component.find("MaxAllowOccurDiv");
        if ($A.util.hasClass(comp.getElement(), "invisible")) {
          $A.util.toggleClass(comp.getElement(), "invisible");
        }

        //salesforce limitation
        var DAILY_LIMIT = 100;
        var WEEKLY_LIMIT = 53;
        var MONTHLY_LIMIT = 60;
        var YEARLY_LIMIT = 10;
        var selectedWeekDays = component.get("v.newTask.RecurrenceDayOfWeekMask");
        var firstRadio = component.get("v.isFirstRadio");
        var secondRadio = component.get("v.isSecondRadio");
        var recurType = component.get("v.defaultRecurringType");
        if (recurType == 'RecursDaily') {
          intervalType = 'days';
          if (firstRadio == "true") {
            interval = 1;
            noWeekend = true;

          } else if (secondRadio == "true") {
            if (component.find("recurrenceIntervalDaily").getElement().value == null || component.find("recurrenceIntervalDaily").getElement().value.trim() == '') {
              interval = 1;
            } else {
              interval = parseInt(component.find("recurrenceIntervalDaily").getElement().value);
            }
          }
          limit = DAILY_LIMIT;
        } else if (recurType == 'RecursWeekly') {
          intervalType = 'weeks';
          if (component.find("RecurrenceInterval").getElement() == null || component.find("RecurrenceInterval").getElement().value == null) {
            interval = 1;
          } else {
            interval = parseInt(component.find("RecurrenceInterval").getElement().value);
          }

          var count = 0;
          if (selectedWeekDays != null && selectedWeekDays > 0) {
            var bitString = parseInt(selectedWeekDays).toString(2);
            for (var i = 0, len = bitString.length; i < len; i++) {
              if (bitString[i] == '1') {
                count++;
              }
            }
          }
          //get max lower integer
          limit = count == 0 ? WEEKLY_LIMIT : Math.floor(WEEKLY_LIMIT / count);
        } else if (recurType == 'RecursMonthly') {
          if (firstRadio == "true") {
            if (component.find("recurrenceIntervalMonthly1").getElement().value == null || component.find("recurrenceIntervalMonthly1").getElement().value.trim() == '') {
              interval = 1;
            } else {
              interval = parseInt(component.find("recurrenceIntervalMonthly1").getElement().value);
            }

          } else if (secondRadio == "true") {
            if (component.find("recurrenceIntervalMonthly2").getElement().value == null || component.find("recurrenceIntervalMonthly2").getElement().value.trim() == '') {
              interval = 1;
            } else {
              interval = parseInt(component.find("recurrenceIntervalMonthly2").getElement().value);
            }
          }

          intervalType = 'months';
          limit = MONTHLY_LIMIT;
        } else if (recurType == 'RecursYearly') {
          interval = 1;
          intervalType = 'years';
          limit = YEARLY_LIMIT;

        }
        var recurrent = this.recurringDates(startDate, endDate, interval, intervalType, noWeekend, limit);

        if (recurrent != null) {
          component.set("v.recurMaxEndDate", moment(recurrent[recurrent.length - 1]).format(userDateFormat).toString());
        } else {
          comp = component.find("MaxAllowEndDateDiv");
          if (!$A.util.hasClass(comp.getElement(), "invisible")) {
            $A.util.toggleClass(comp.getElement(), "invisible");
          }
          comp = component.find("MaxAllowOccurDiv");
          if (!$A.util.hasClass(comp.getElement(), "invisible")) {
            $A.util.toggleClass(comp.getElement(), "invisible");
          }
        }
    },
    /*
      calculate end date and recurrence number.
      interevalType:
          Daily -> intervalType='Days'
          Weekly -> intervalType='Weeks'
          Monthly -> intervalType='Months'
          Yearly -> intervalType='Years'
    */
    recurringDates: function(startDate, endDate, interval, intervalType, noweekends, limit) {
        intervalType = intervalType || 'Date';
        var date = startDate;
        var recurrent = [];
        while (date < endDate && recurrent.length < limit) {
          recurrent.push(noweekends ? noWeekend() : new Date(date));
          date = moment(date).add(interval, intervalType);
        }
        // add 1 day for sunday, subtract one for saturday
        function noWeekend() {
          var add, currdate = new Date(date);
          var dayObj = new Date(date);
          var day = dayObj.getDay();
          if (~[6, 0].indexOf(day)) {
            currdate.setDate(currdate.getDate() + (add = day == 6 ? -1 : 1));
          }
          return new Date(currdate);
        }
        return recurrent;
    },

    initMonthNames: function(component, event, helper) {

        var monthNamesEnglish = moment.months();
        component.set("v.monthNamesEnglish", monthNamesEnglish);
        var monthNamesLocal = $A.get("$Locale.nameOfMonths");
        var monthNamesEngToLocal = [];

        for (var idx = 0; idx < monthNamesEnglish.length; idx++) {
            monthNamesEngToLocal.push( {'english' : monthNamesEnglish[idx],
                                        'local' :  monthNamesLocal[idx].fullName} );
        }

        component.set("v.monthNamesEngToLocal", monthNamesEngToLocal);
    },

    initWeekdays: function(component, event, helper) {

        var weekDays = [];
        // Does $Locale.nameOfWeekdays always return days in order, starting with Sunday?
        var weekdaysLocal = $A.get("$Locale.nameOfWeekdays");

        for (var idx = 0 ; idx < weekdaysLocal.length; idx++) {
          var tuple = {
            "id": idx,
            "auraid": "Weekly_Day_" + idx,
            "text": "" + Math.pow(2, idx),  // Text value is a power of 2, with Sunday.Text = 1, M=2, Tu=4, W=8, Th=16, F=32, Sa=64
            "display": weekdaysLocal[idx].fullName,
            "selected": false
          };
          weekDays.push(tuple);
        }

        var today = new Date();
        for (var i = 0; i < weekDays.length; i++) {
          var t = weekDays[i];
          if (parseInt(t.id) == today.getDay()) {
            t.selected = true;
            component.set("v.newTask.RecurrenceDayOfWeekMask", parseInt(t.text));
            break;
          }
        }
        component.set("v.weeklyDays", weekDays);
    },

    clearOnRecurTypeChange: function(component, event, helper) {
        component.set("v.isFirstRadio", "false");
        component.set("v.isSecondRadio", "false");
        component.set("v.clearOnRecurTypeChangeAttr", true);
        var compArray = [];
        var comp = null;

        comp = component.find("RecurrenceEndDateOnly");
        if (comp != null) {
          comp.set("v.value", null);
          compArray.push(comp);
        }

        comp = component.find("RecurrenceStartDateOnly");
        if (comp != null) {
          comp.set("v.value", moment(new Date()).format('YYYY-MM-DD').toString());
          compArray.push(comp);
        }

        comp = component.find("NumberOfOccurence");
        if (!$A.util.isUndefinedOrNull(comp)) {
          comp.set("v.value", "");
          compArray.push(comp);
        }

        for (var index = 0; index < compArray.length; index++) {
          if ($A.util.hasClass(compArray[index], "error--form")) {
            $A.util.toggleClass(compArray[index], "error--form");
          }
        }
        this.initWeekdays(component, event, helper);
    },

    processGoals: function(component) {
        var action = component.get("c.getGoals");
        action.setParams({
          "problemId": component.get("v.problem")
        });
        action.setCallback(this, function(response) {
          var state = response.getState();
          if (state === "SUCCESS") {
            component.set("v.goals", response.getReturnValue());
          }
          if (state === "ERROR") {
            var errors = response.getError();
            if (errors) {
              if (errors[0] && errors[0].message) {
                throw new Error("Error message: " +
                  errors[0].message);
              }
            } else {
              throw new Error("Unknown error");
            }
          }
        });
        $A.enqueueAction(action);
    },

    switchRecurringConfiguration: function(component, event, helper) {
        var currentValue = component.get("v.defaultRecurringType");
        var comps = [component.find("RecursDaily"), component.find("RecursWeekly"), component.find("RecursMonthly"), component.find("RecursYearly")];
        //salesforce limitation
        var DAILY_LIMIT = 100;
        var WEEKLY_LIMIT = 53;
        var MONTHLY_LIMIT = 60;
        var YEARLY_LIMIT = 10;
        for (var i = 0; i < comps.length; i++) {
          var comp = comps[i];
          if (comp.getLocalId() != currentValue) {
            $A.util.addClass(comp, 'invisible');
          } else {
            $A.util.removeClass(comp, 'invisible');
            if (currentValue == "RecursDaily")
              component.set("v.recurMaxOccur", DAILY_LIMIT);
            else if (currentValue == "RecursWeekly")
              component.set("v.recurMaxOccur", WEEKLY_LIMIT);
            else if (currentValue == "RecursMonthly")
              component.set("v.recurMaxOccur", MONTHLY_LIMIT);
            else if (currentValue == "RecursYearly")
              component.set("v.recurMaxOccur", YEARLY_LIMIT);

            comp = component.find("MaxAllowEndDateDiv");
            if (!$A.util.hasClass(comp.getElement(), "invisible")) {
              $A.util.toggleClass(comp.getElement(), "invisible");
            }
            comp = component.find("MaxAllowOccurDiv");
            if (!$A.util.hasClass(comp.getElement(), "invisible")) {
              $A.util.toggleClass(comp.getElement(), "invisible");
            }
          }
        }
    },

    noBodyScroll: function(component) {
        var bodies = document.getElementsByTagName('body');
        var bodyToUpdate = bodies[0];

        if (component.get('v.isShow')) 
        {
          $A.util.addClass(bodyToUpdate, 'bodyNoScroll');
        } 
        else 
        {
          $A.util.removeClass(bodyToUpdate, 'bodyNoScroll');
        }
    }

})