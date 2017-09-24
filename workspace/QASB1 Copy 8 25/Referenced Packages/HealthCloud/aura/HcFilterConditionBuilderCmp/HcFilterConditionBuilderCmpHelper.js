/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcFilterConditionBuilderCmpHelper, helper class for HcFilterConditionBuilderCmp Component.
 * @since 196
 */


({
    configMap: {
        "picklist": {
            componentDef: "HealthCloudGA:HcInputSelect"
        },
        "anytype": {
            componentDef: "ui:inputText"
        },
        "string": {
            componentDef: "ui:inputText"
        },
        "datacategorygroupreference": {
            componentDef: "ui:inputText"
        },
        "currency": {
            componentDef: "ui:inputCurrency"
        },
        "double": {
            componentDef: "ui:inputNumber"
        },
        "phone": {
            componentDef: "ui:inputPhone"
        },
        "integer": {
            componentDef: "ui:inputNumber"
        },
        "percent": {
            componentDef: "ui:inputNumber"
        },
        "email": {
            componentDef: "ui:inputEmail"
        },
        "date": {
            componentDef: "ui:inputDate"
        },
        "datetime": {
            componentDef: "ui:inputDateTime"
        },
        "boolean": {
            componentDef: "ui:inputCheckbox"
        },
        "reference": {
            componentDef: "HealthCloudGA:HcCustomLookup",
            valueKey: "selectedId"
        }
    },

    getRecordValues: function(component) {
        var configObj = component.get("v.configObject");
        var configObjectAPIName;

        if(!$A.util.isEmpty(configObj)){
            configObjectAPIName = configObj["objectAPI"];
            if(!$A.util.isEmpty(configObjectAPIName)) {
                var action = component.get("c.getObjectLabelFromAPI");
                component.set("v.recordTypeError", '');
                action.setParams({
                    "APINameString": configObjectAPIName
                });
                action.setCallback(this, function (result) {
                    var res = result.getReturnValue();
                    if (result.getState() === "SUCCESS") {
                        component.set("v.dropDownValuesRecord", res);
                        var recordCmp = component.find('record');
                        recordCmp.set('v.disabled',false);

                    }
                    else {
                        component.set("v.recordTypeError", $A.get("$Label.HealthCloudGA.Msg_Error_Filter_Record_List"));
                        var recordCmp = component.find('record');
                        recordCmp.set('v.disabled',true);
                        component.set('v.hasError', true);
                    }
                });
                $A.enqueueAction(action);
            }
        }
        else {
            var action = component.get("c.getFilterablePatientRelatedObjectsMap");
            component.set("v.recordTypeError", '');
            action.setCallback(this, function (result) {
                var res = result.getReturnValue();
                var state = result.getState();
                if (res != undefined && null != res && state.toUpperCase() === "SUCCESS") {
                    // sort results list
                    res.sort(function (a, b) {
                        return a.label.localeCompare(b.label);
                    });
                    component.set("v.dropDownValuesRecord", res);
                    var recordCmp = component.find('record');
                    recordCmp.set('v.disabled',false);
                }
            });
            $A.enqueueAction(action);
        }

    },

    getRecordFieldValues: function(component, event, value) {
        var self = this;
        var selected = value;

        var action = component.get("c.getFilterableFieldsForPatientRelatedObjectViaAPIName");

        // disable all child dependent field
        self.disableDependentFields(component, 'record');

        action.setParams({
            "sObjectAPIName": selected.value
        });

        // only call the action if we have a value to query
        if (!$A.util.isEmpty(selected.value)) {
          action.setCallback(this, function(result) {
              var res = result.getReturnValue();
              var state = result.getState().toUpperCase();
              var editing = component.get("v.isEdit");

              if (res != undefined && state === "SUCCESS") {

                  if (editing) {
                    component.find('record').set('v.selectedItem', selected);
                  }

                  // sort results list
                  res.sort(function (a, b) {
                    return a.label.localeCompare(b.label);
                  });

                  component.set("v.filterCond.ObjectName__c", selected.value);
                  component.set("v.dropDownValuesField", res);

                  // loading complete
                  var objectCmp = component.find("object");
                  objectCmp.set("v.disabled", false);

              } else {
                  component.find("record").set('v.hasError', true);
              }
          });
          $A.enqueueAction(action);
        } else {
          //if the user selects a value from picklist and removes it, the value is not cleared. Hence forcing the object value to null if selected.value is empty
            component.set("v.filterCond.ObjectName__c", null);
        }
    },

    getRecordOperatorValues: function(component, event, value) {
        var self = this;
        var selected = value;
        var editing = component.get("v.isEdit");
        var filterCondition = component.get("v.filterCond");

        // locate the object API name based on create or edit context
        if (editing) {
          var objName = filterCondition.ObjectName__c;
        } else {
          var objName = component.find("record").get("v.selectedItem.value");
        }

        var field = objName + ":" + selected.value;
        var action = component.get("c.getOperatorsForField");

        // disable all child dependent field
        self.disableDependentFields(component, 'object');

        action.setParams({
            "fieldInfo": field
        });

        // only call the action if we have a value to query
        if (!$A.util.isEmpty(selected.value)) {
          action.setCallback(this, function(result) {
              var res = result.getReturnValue();
              var state = result.getState();

              var objectCmp = component.find("object");
              var operatorCmp = component.find("operator");

              if (res != undefined && null != res && state.toUpperCase() === "SUCCESS") {

                  if (editing) {
                    // set values of field & operator components
                    objectCmp.set('v.selectedItem', selected);
                    operatorCmp.set('v.value', filterCondition.Operator__c);
                  }

                  // if we have a change in field reset the condition's value
                  if ( selected.value != filterCondition.FieldName__c ) {
                    component.set('v.filterCond.Value__c', null);
                  }

                  component.set("v.filterCond.FieldName__c", selected.value);

                  // take the response and set up the options
                  // in the correct format
                  var newRes = this.formatOptionsData(res, filterCondition.Operator__c);
                  component.set("v.dropDownValuesFilter", newRes);

                  operatorCmp.set("v.disabled", false);

                  // sets the default value since the select loads
                  // the list but does not set the value until user interacts
                  // if the new list of operators does not contain the current value, set to the first value in the list
                  if ( editing === false || newRes.map(function(item){return item.value;}).indexOf(filterCondition.Operator__c)==-1 ) {
                    component.set('v.filterCond.Operator__c', newRes[0].value);
                  }

              // error
              } else {
                  console.log('HcFilterConditionBuilderCmp: getRecordOperatorValues - ERROR!! => ' + state);

                  objectCmp.set("v.hasError", true);
                  operatorCmp.set("v.disabled", true);
              }
          });

          $A.enqueueAction(action);
        } else {
          //if the user selects a value from picklist and removes it, the value is not cleared. Hence forcing the object value to null if selected.value is empty
            component.set("v.filterCond.FieldName__c", null);
        }
    },

    getFieldInputType: function(component, event, val, defaultInput) {
        var defaultInput = defaultInput || false;
        var objName;
        var field;

        if (defaultInput) {
            objName = "Account";
            field = "Account Name";
        } else {
            objName = component.get("v.filterCond.ObjectName__c").trim();
            field = String(val.value);
        }

        var action = component.get("c.getFieldValueType");
        action.setParams({
            "sObj": objName,
            "fld": field
        });

        action.setCallback(this, function(result) {
            var res = result.getReturnValue();

            if (result.getState() === "SUCCESS") {
                var self = this;
                var fieldType = res.type;
                var uiType;
                var attributeKey;
                var valueKey;
                var config = this.configMap[fieldType];

                // store the field type for this filter condition
                component.set('v.filterCond.Type__c', fieldType);

                if (!$A.util.isUndefinedOrNull(config)) {
                    uiType = config.componentDef;
                    valueKey = config.valueKey || "value";
                } else {
                    uiType = "ui:inputText";
                    fieldType = "string";
                    valueKey = "value";
                }

                var fieldValue = component.get("v.filterCond.Value__c");
                var value = (fieldValue == null || fieldValue == undefined) ? "" : fieldValue;

                if (uiType == "ui:inputCheckbox") {
                    value = (value === "true");
                }

                // location where we'll be inserting the new component
                var domElem = component.get("v.domElement");
                domElem.length = 0;

                // create the component
                var objDef = { "aura:id": "value","label": ' ',"change": component.getReference("c.handleValueChange")};
                objDef[valueKey] = value;
                // create the component
                $A.createComponent(uiType,objDef , function(cmp) {
                    if (fieldType === 'picklist') {
                        // if value empty, set picklist default value
                        if ($A.util.isEmpty(value) && !$A.util.isEmpty(res.picklistValues)) {
                            value = res.picklistValues[0].value;
                        }
                        cmp.addValueHandler({
                            value: "v.value",
                            event: "change",
                            method: function(event) {
                                component.set("v.filterCond.Value__c", event.getParams().value);
                            }
                        });
                        var options = res.picklistValues;
                        cmp.set("v.options", self.formatOptionsData(res.picklistValues, value));
                        cmp.set("v.value", value);
                        // if we have an empty value retrieve value from component (default value)
                        var picklistValue = value || cmp.get('v.value');
                        // set value of condition object
                        component.set('v.filterCond.Value__c', picklistValue);

                    } else if (fieldType === 'reference') {
                        cmp.addValueHandler({
                            value: "v.selectedId",
                            event: "change",
                            method: function(event) {
                                component.set("v.filterCond.Value__c", event.getParams().value);
                            }
                        });
                        cmp.set("v.Sobject", res.referenceObj);
                        cmp.set("v.selectedId", value);

                        if (field === 'recordtypeid' || field === "Record Type ID") {
                            var lookUpWhereClauseMap = new Object();
                            lookUpWhereClauseMap["SobjectType"] = objName;
                            cmp.set("v.whereClause", lookUpWhereClauseMap);
                        }

                    } else if (fieldType === 'date' || fieldType === 'datetime') {
                        cmp.addValueHandler({
                            value: "v.value",
                            event: "change",
                            globalId: cmp.getGlobalId(),
                            method: function(event) {
                                component.set("v.filterCond.Value__c", event.getParams().value);
                            }
                        });
                        cmp.set("v.displayDatePicker", true);
                        cmp.set("v.class", "slds-input");

                    } else if (fieldType === 'string' || fieldType === 'currency' || fieldType === 'integer' || fieldType === 'double' || fieldType === 'phone' || fieldType == 'email') {
                        cmp.set("v.class", "slds-input");
                        if (defaultInput) {
                            cmp.set('v.disabled', true);
                        }

                    } else if (fieldType === 'checkbox' || fieldType === 'boolean') {

                        cmp.set("v.class", "slds-m-left--small");
                        cmp.set("v.label", $A.get('$Label.HealthCloudGA.Text_True') ); // uses custom label for the word true
                    }

                    // insert new component at proper location
                    domElem.push(cmp);
                    component.set("v.domElement", domElem);
                });
            }
            else{
              component.set("v.fieldTypeError",$A.get("$Label.HealthCloudGA.Msg_Error_Filter_Type"));
            }
        });
        $A.enqueueAction(action);
    },

    setOperatorValues: function(component, event, value) {
        component.set('v.filterCond.Operator__c', value);
    },

    formatOptionsData: function(res, selectedValue) {
        var options = [];

        for ( var i = 0; i < res.length; i++ ) {
          options.push({
            'value': res[i].value,
            'label': res[i].label,
            'selected': selectedValue == res[i].value ? "true" : ""
          });
        }

        return options;
    },

    // disable child dependent fields/components based on source/root field/component
    disableDependentFields: function(component, source) {
      //
      var objectCmp = component.find("object");
      var operatorCmp = component.find("operator");

      // only update UI if we have valid components rendered
      if ( objectCmp ) {
        switch(source) {
          case 'record':
            objectCmp.set('v.disabled', true);
            objectCmp.set('v.selectedItem', null);

          default:
            operatorCmp.set('v.disabled', true);
            operatorCmp.set('v.value', null);
            component.set("v.dropDownValuesFilter", []);

            component.set('v.domElement', []);
            component.set('v.filterValue', null);
            break;
        }
      }
    }

})