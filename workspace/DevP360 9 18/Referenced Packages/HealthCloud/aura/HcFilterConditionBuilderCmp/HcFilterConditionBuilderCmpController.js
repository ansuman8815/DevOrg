/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcFilterConditionBuilderCmpController, controller class for HcFilterConditionBuilderCmp Component.
 * @since 196
 */
({
    doInit: function(component, event, helper) {
        helper.getRecordValues(component, event);

        // if editing
        if (component.get('v.isEdit') === true) {
            var filterCond = component.get("v.filterCond");

            // load field based on object
            var recordVal = { 'value': filterCond.ObjectName__c,
                              'label': filterCond.ObjectLabel__c };
            helper.getRecordFieldValues(component, event, recordVal);

            // load operators and value input based on field
            var objectVal = { 'value': filterCond.FieldName__c,
                              'label': filterCond.FieldLabel__c };
            helper.getRecordOperatorValues(component, event, objectVal);
            helper.getFieldInputType(component, event, objectVal);
        }

        component.set("v.isRecord", "true");
    },

    handleObjectType: function(component, event, helper) {
        var val = component.find("record").get("v.selectedItem");
        helper.getRecordFieldValues(component, event, val);
    },


    handleFieldType: function(component, event, helper) {
        var val = component.find("object").get("v.selectedItem");
        helper.getRecordOperatorValues(component, event, val);
        helper.getFieldInputType(component, event, val);
    },

    handleOperatorType: function(component, event, helper) {
        var val = component.find("operator").get("v.value");
        helper.setOperatorValues(component, event, val);
    },

    deletefilterCondition: function(component, event, helper) {
        var row = component.get("v.filterCond.RowNumber__c");
        var eventName = component.getEvent("deleteEvent");
        if (null != eventName && eventName != '') {
            eventName.setParams({
                rowNumber: row
            }).fire();
        }
    },

    handleValueChange : function(component) {
      var newbody = component.get("v.domElement");
      component.set("v.filterCond.Value__c", newbody[0].get("v.value"));
    }
})