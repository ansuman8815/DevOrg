/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description controller of create task component
 * @since 196
 */
({
    doInit: function(component, event, helper) {
        var userDateFormat = component.get("v.userDateFormat");

        // take scrollbar off body
        helper.noBodyScroll(component);
        helper.getStandardFieldNames(component);
        helper.getPicklistValuesForTaskFields(component);
        component.set("v.newTask.RecurrenceStartDateOnly", moment(new Date()).format('YYYY-MM-DD').toString());
        component.set("v.recurMaxEndDate", moment().add(1, 'years').format(userDateFormat.toUpperCase()).toString());
        helper.initMonthNames(component, event, helper);
        helper.initWeekdays(component, event, helper);
        if(component.get("v.action") == 'UpdateTask'){
            helper.initEditTask(component, event, helper);
        }else{
            helper.initCreateTask(component, event, helper);
        }
    },

    createTask: function(component, event, helper) {
        helper.createTask(component);
    },

    cancelButton: function(component, event, helper) {
        //CLOSE WINDOW or RETURN to PARENT
        var isHealthConsole = component.get("v.isHealthConsole");
        var closeEvent = component.getEvent("HcCareTeamEvent");
        // adding scrollbar back to body
        component.set('v.isShow', false);
        helper.noBodyScroll(component);
        if (isHealthConsole == "true") {
            closeEvent.setParams({
                "type": "CANCELMODAL",
                "message": "Care team detail component cancel"
            });
            closeEvent.fire();
        } else {
            var memberObj = {};
            memberObj["carePlanId"] = component.get("v.carePlanId");
            $A.get("e.HealthCloudGA:HcComponentStatusEvent").setParams({
                status: "CANCELLED",
                message: "Cancelled",
                memberObj:memberObj
            }).fire();
        }
    },
    saveButton: function(component, event, helper) {
        // hide buttons and provide feedback
        helper.pleaseWait(component, true, 'task-modal');

        if (helper.validationCheck(component, event, helper)) {
            component.set("v.erMsg", "");
            component.set("v.openNewModal", "false");
            helper.createTask(component, event);
        } else {
            // if an error occurs hide feedback message and show buttons
            helper.pleaseWait(component, false, 'task-modal');
        }
    },
    saveNewButton: function(component, event, helper) {
        // hide buttons and provide feedback
        helper.pleaseWait(component, true, 'task-modal');

        if (helper.validationCheck(component, event, helper)) {
            component.set("v.erMsg", "");
            component.set("v.openNewModal", "true");
            helper.createTask(component, event);
        } else {
            // if an error occurs hide feedback message and show buttons
            helper.pleaseWait(component, false, 'task-modal');
        }
    },
    isReurringClick: function(component, event, helper) {
        var recurCom = component.find("isRecurring");
        var value = recurCom.getElement().checked;
        if (value) {
            component.set("v.recurringDisplay", true);
            component.set("v.newTask.ActivityDate","");
            helper.switchRecurringConfiguration(component, value);
            helper.checkMaxEndDate(component, event, helper);

        } else {
            component.set("v.recurringDisplay", false);
            component.find("dueDate").set("v.displayDatePicker", true);
        }
    },
    recurringTypeChange: function(component, event, helper) {
        var recurringType = component.find("RecurrenceType");
        var value = recurringType.getElement().value;
        component.set("v.defaultRecurringType", value);
        helper.switchRecurringConfiguration(component, value);
        helper.clearOnRecurTypeChange(component, event, helper);
        helper.initWeekdays(component, event, helper);
    },
    endsSelectChange: function(component, event, helper) {
        var endsSelect = component.find("EndsSelect");
        var value = endsSelect.getElement().value;
        var comp = null;
        if (value == 'AfterOccurences') {
            comp = component.find("RecurrenceEndDateOnlyDiv");
            if (!$A.util.hasClass(comp.getElement(), "invisible")) {
                $A.util.toggleClass(comp.getElement(), "invisible");
            }
            comp = component.find("NumberOfOccurenceDiv");
            if ($A.util.hasClass(comp.getElement(), "invisible")) {
                $A.util.toggleClass(comp.getElement(), "invisible");
            }
        } else if (value == 'OnDate') {
            comp = component.find("RecurrenceEndDateOnlyDiv");
            if ($A.util.hasClass(comp.getElement(), "invisible")) {
                $A.util.toggleClass(comp.getElement(), "invisible");
            }
            comp = component.find("NumberOfOccurenceDiv");
            if (!$A.util.hasClass(comp.getElement(), "invisible")) {
                $A.util.toggleClass(comp.getElement(), "invisible");
            }
        }
    },
    weekdayClick: function(component, event, helper) {
        var value = event.target.text;
        var currentValue = component.get("v.newTask.RecurrenceDayOfWeekMask");
        if (event.target.checked) {
            currentValue = currentValue + parseInt(value);
        } else {
            currentValue = currentValue - parseInt(value);
            if (currentValue <= 0) {
                currentValue = 0;
            }
        }
        component.set("v.newTask.RecurrenceDayOfWeekMask", currentValue);
        helper.checkMaxEndDate(component, event, helper);
    },
    checkMaxEndDate: function(component, event, helper) {
        helper.checkMaxEndDate(component, event, helper);
    },
    onFirstRadioTrue: function(component, event, helper) {
        component.set("v.isFirstRadio", "true");
        component.set("v.isSecondRadio", "false");
        helper.checkMaxEndDate(component, event, helper);
    },
    onSecondRadioTrue: function(component, event, helper) {
        component.set("v.isFirstRadio", "false");
        component.set("v.isSecondRadio", "true");
        helper.checkMaxEndDate(component, event, helper);
    },
    processProblemChange : function(component,event,helper){
        helper.processGoals(component);
    }
})