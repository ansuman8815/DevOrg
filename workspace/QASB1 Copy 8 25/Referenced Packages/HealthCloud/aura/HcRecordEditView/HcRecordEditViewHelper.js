/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcRecordEditViewHelper, helper class for HcRecordEditView Component.
 * @since 196
 */
({
    showLayout: function(component) {
        var config = null;
        var self = this;
        var fieldValueInfo = component.get("v.fieldValueInfo");
        /* Clear any existing components in the form facet */
        var fields = component.get("v.fields");
        //var fieldValues = component.get("v.fieldValues");
        var recordType = component.get("v.recordType");
        var sectionStatus = component.get("v.sectionStatus");
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            if(field.isReadOnly)continue;
            field["fieldValue"] = field.value;
            if (sectionStatus == "false" && field.required == true) component.set("v.sectionStatus", "true");
            fieldValueInfo.push({
                field: field,
                recordType: recordType
            });
        }
        component.set("v.fieldValueInfo", fieldValueInfo);
        this.populateColumn(component);
    },

    populateColumn: function(component) {
        var fieldValueInfoRenderModel = [];
        var fieldValueInfo = component.get("v.fieldValueInfo");
        var columnSize = component.get("v.columnSize");
        var newRow = [];
        for (var index = 0; index < fieldValueInfo.length; index++) {
            /*Required as javascript adds property to Object*/
            if (fieldValueInfo.hasOwnProperty(index)) {
                if (fieldValueInfo[index].field.type.toLowerCase() == "multipicklist") {
                    if (newRow.length != 0) {
                        fieldValueInfoRenderModel.push(newRow);
                    }
                    fieldValueInfoRenderModel.push([fieldValueInfo[index]]);
                    newRow = [];
                } else {
                    if (index % columnSize == 0) {
                        if (newRow.length != 0) {
                            fieldValueInfoRenderModel.push(newRow);
                        }
                        newRow = [];
                    }
                    newRow.push(fieldValueInfo[index]);
                }
            }
        }
        if (newRow.length != 0) {
            fieldValueInfoRenderModel.push(newRow);
        }
        component.set("v.fieldValueInfoRenderModel", fieldValueInfoRenderModel);
    },

    onSave: function(component) {
        var self = this;
        var recId = component.get("v.recordId");
        var fieldSetInfo = component.get('v.fieldValueInfo');
        var sObject = component.get('v.sObjectName');
        var prePopMap = component.get("v.prePopMap");
        var resultMap = new Object();

        if (!this.validateRequiredFields(fieldSetInfo, resultMap)) {
            /*Let Parent Modal know there is error*/
            component.set("v.showValidationErrors", true);
            var msgEvent = component.getEvent("messageCmpEvent");
            msgEvent.setParams({
                "type": "FS:VALIDATION_ERROR",
                "payload": {
                    "message": "Validation failed" /*Message not shown front end*/
                }
            });
            msgEvent.fire();
        }
        else{
          if(!$A.util.isUndefinedOrNull(recId)){
            resultMap['Id'] = recId;
          }
          if(!$A.util.isEmpty(prePopMap)) {
            var keys = Object.keys(prePopMap);
            for (var i = 0; i < keys.length; i++) {
              resultMap[keys[i]] = prePopMap[keys[i]];
            }
          }
          var action = component.get("c.upsertSObject");
          action.setParams({
              "sObjectName": sObject,
              "fieldMap":resultMap
          });
          action.setCallback(this, function(response) {
              var state = response.getState();
              if (state === "SUCCESS") {
                  /*Let Parent know its a success */
                  var msgEvent = component.getEvent("messageCmpEvent");
                  msgEvent.setParams({
                      "type": "FS:SUCCESS",
                      "payload": {
                          "response": "Successfully upserted", 
                          "resultMap": resultMap
                      }
                  });
                  msgEvent.fire();
              }
              if (state === "ERROR") {
                /*Let Parent know its a error */
                var msgEvent = component.getEvent("messageCmpEvent");
                msgEvent.setParams({
                    "type": "FS:ERROR",
                    "payload": {
                        "response": $A.get("$Label.HealthCloudGA.Msg_Error_General") /*Message not shown front end*/
                    }
                });
                msgEvent.fire();
                
                var errors = response.getError();
                console.log(errors[0].message);
                  
              }
          });
          $A.enqueueAction(action);
        }
    },

    validateRequiredFields: function(fieldSetInfo, resultMap) {
        for (var i = 0; i <= fieldSetInfo.length; i++) {
            if (typeof fieldSetInfo[i] != 'undefined') {
                var fieldRealOnly = fieldSetInfo[i].field.isReadOnly;
                if(fieldRealOnly)continue;
                var fieldName = fieldSetInfo[i].field.fieldPath;
                var fieldValue = fieldSetInfo[i].field.value;
                var isRequired = fieldSetInfo[i].field.required || fieldSetInfo[i].field.dbRequired;
                /*Filling the resultMap*/
                resultMap[fieldName] = !$A.util.isUndefinedOrNull(fieldValue) ? fieldValue.toString() : "";
                if (isRequired && !fieldValue) {
                  var type = fieldSetInfo[i].field.type;
                  // Bypass this check for boolean as false is a valid value.
                  if(type != 'BOOLEAN'){
                    return;
                  }
                }
            }
        }
        return true;
    }

})