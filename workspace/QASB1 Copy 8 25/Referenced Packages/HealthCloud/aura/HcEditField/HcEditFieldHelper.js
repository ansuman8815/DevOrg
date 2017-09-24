/*
+ * Copyright © 2015 salesforce.com, inc. All rights reserved.
+ * @copyright This document contains proprietary and confidential information and shall not be reproduced,
+ * transferred, or disclosed to others, without the prior written consent of Salesforce.
+ * @description helper to handle various functions.
+ * @since 196
*/

({
    configMap: {
        "anytypeEdit": {
            componentDef: "ui:inputText"
        },
        "base64Edit": {
            componentDef: "ui:inputText"
        },
        "booleanEdit": {
            componentDef: "ui:inputCheckbox"
        },
        "comboboxEdit": {
            componentDef: "HealthCloudGA:dropDown",
            attributeKey: "list",
            valueKey: "selectedValue"
        },
        "currencyEdit": {
            componentDef: "ui:inputCurrency"
        },
        "datacategorygroupreferenceEdit": {
            componentDef: "ui:inputText"
        },
        "dateEdit": {
            componentDef: "ui:inputDate"
        },
        "datetimeEdit": {
            componentDef: "ui:inputDateTime"
        },
        "doubleEdit": {
            componentDef: "ui:inputNumber"
        },
        "emailEdit": {
            componentDef: "ui:inputEmail"
        },
        "encryptedstringEdit": {
            componentDef: "ui:inputText"
        },
        "phoneEdit": {
            componentDef: "ui:inputPhone"
        },
        "idEdit": {
            componentDef: "ui:inputText"
        },
        "integerEdit": {
            componentDef: "ui:inputNumber",
            attributeKey: "values"
        },
        "multipicklistEdit": {
            componentDef: "HealthCloudGA:twoColMultiPicklistCmp",
            attributeKey: "picklist1Fields",
            valueKey: "picklist2Fields"
        },
        "percentEdit": {
            componentDef: "ui:inputNumber"
        },
        "picklistEdit": {
            componentDef: "HealthCloudGA:HcInputSelect"
        },
        "referenceEdit": {
            componentDef: "HealthCloudGA:HcCustomLookup",
            valueKey: "selectedId",
            attributeKey: "Sobject"
        },
        "stringEdit": {
            componentDef: "ui:inputText"
        },
        "textareaEdit": {
            componentDef: "ui:inputTextArea"
        },
        "timeEdit": {
            componentDef: "ui:inputDateTime"
        },
        "urlEdit": {
            componentDef: "ui:inputURL"
        },
        "formulaEdit": {
            componentDef: "HealthCloudGA:HcImageFormulaField"
        },
        "anytypeRead": {
            componentDef: "ui:outputText"
        },
        "base64Read": {
            componentDef: "ui:outputText"
        },
        "booleanRead": {
            componentDef: "ui:outputCheckbox"
        },
        "comboboxRead": {
            componentDef: "HealthCloudGA:dropDown",
            attributeKey: "list",
            valueKey: "selectedValue"
        },
        "currencyRead": {
            componentDef: "ui:outputCurrency"
        },
        "datacategorygroupreferenceRead": {
            componentDef: "ui:outputText"
        },
        "dateRead": {
            componentDef: "ui:outputDate"
        },
        "datetimeRead": {
            componentDef: "ui:outputText"
        },
        "doubleRead": {
            componentDef: "ui:outputNumber"
        },
        "emailRead": {
            componentDef: "ui:outputEmail"
        },
        "encryptedstringRead": {
            componentDef: "ui:outputText"
        },
        "phoneRead": {
            componentDef: "ui:outputPhone"
        },
        "idRead": {
            componentDef: "ui:outputText"
        },
        "integerRead": {
            componentDef: "ui:outputNumber",
            attributeKey: "values"
        },
        "multipicklistRead": {
            componentDef: "HealthCloudGA:twoColMultiPicklistCmp",
            attributeKey: "picklist1Fields",
            valueKey: "picklist2Fields"
        },
        "percentRead": {
            componentDef: "ui:outputNumber"
        },
        "picklistRead": {
            componentDef: "HealthCloudGA:HcInputSelect"
        },
        "referenceRead": {
            componentDef: "ui:outputText"
        },
        "stringRead": {
            componentDef: "ui:outputText"
        },
        "textareaRead": {
            componentDef: "ui:outputTextArea"
        },
        "timeRead": {
            componentDef: "ui:outputText"
        },
        "urlRead": {
            componentDef: "ui:outputURL"
        }
    },
    refreshValidationCheck: function(component) {
        var formElem = component.get("v.formElement");
        formElem.forEach(function(entry) {
            if(entry.toString().indexOf("ui:input") > -1) { // errors, showErrors and required are attributes present only in ui:input based components
                entry.set("v.showErrors",  true);
            }
        });
    },

    createComponent: function(component) {
        var field = component.get('v.field');
        var fieldType = $A.util.isUndefinedOrNull(field.type)?"":field.type.toLowerCase();
        var isReadOnly = $A.util.isUndefinedOrNull(field.isReadOnly)?false:field.isReadOnly;
        var fieldName = $A.util.isUndefinedOrNull(field.fieldPath)?"":field.fieldPath;
        var fieldLabel = $A.util.isUndefinedOrNull(field.label)?"":field.label;
        var fieldValue = $A.util.isUndefinedOrNull(field.fieldValue)?"":field.fieldValue;
        var fieldRequired = $A.util.isUndefinedOrNull(field.required)?false:field.required;
        var fieldDbRequired = $A.util.isUndefinedOrNull(field.dbRequired)?false:field.dbRequired;
        var showValidationErrors = component.get("v.showValidationErrors");
        var options = $A.util.isUndefinedOrNull(field.picklistValues)?[]:field.picklistValues;
        var selected = component.get("v.selected");
        var format = component.get("v.format");
        var viewType = isReadOnly ? "Read" : component.get("v.viewType");
        var config = this.configMap[fieldType + viewType];
        var uiType = config.componentDef;
        var attributeKey = config.attributeKey;
        var valueKey = config.valueKey;
        // if the field has a sObjectType set, use that, otherwise use what's set in the sObjectName attribute
        var sObject = !$A.util.isEmpty(field.sObjectType)?field.sObjectType : component.get("v.sObjectName");
        var inpClass = uiType.indexOf('HcCustomLookup') == -1 ? "slds-input" : "";
        var value = fieldValue;
        $A.createComponent(uiType, {
                "aura:id": fieldName,
                "label": fieldLabel,
                "required": isReadOnly ? false : (fieldRequired || fieldDbRequired),
                "value": value,
                "class": inpClass,
                "showErrors": showValidationErrors,
                "labelPosition": "top"
            },
            function(cmp) {
                var fType = fieldType;
                cmp.addValueHandler({
                    value: valueKey ? "v." + valueKey : "v.value",
                    event: "change",
                    method: function(event) {
                        component.set("v.field.value", event.getParams().value); // can't set fieldValue - set value instead
                    }
                });
                if (component.isValid()) {
                    var divFormElement = component.get("v.formElement");
                    divFormElement.push(cmp);
                    if (fType == 'picklist') {
                        cmp.set("v.options", options);
                        cmp.set("v.disabled", isReadOnly);
                    }
                    if (fType == 'combobox' || fType == 'multipicklist') {
                        cmp.set("v." + attributeKey, options);
                        fieldValue = options[0] && options[0].value;
                        if (fType == 'multipicklist') {
                            cmp.set("v.multiple", true);
                            cmp.set("v.picklist1Label", fieldLabel);
                            cmp.set("v.picklist2Label", "Selected " + fieldLabel);
                        }
                    }
                    if (fType == 'integer') {
                        cmp.set("v.value", fieldValue);
                    }
                    if ( fType == 'currency' || fType == 'double') {
                        cmp.set("v.value", fieldValue);
                        cmp.set("v.format", format);
                    }
                    if (fType == 'boolean') {
                        if(fieldValue === 'true')
                            cmp.set("v.value", true);
                        else
                            cmp.set("v.value", false);
                    }
                    if (fType == 'date' || fType ==='datetime') {
                        if(fieldValue){
                            var dateValue = new Date(fieldValue);
                            cmp.set("v.value", dateValue.getFullYear() + "-" + (dateValue.getMonth() + 1) + "-" + dateValue.getDate());
                        }
                        cmp.set("v.displayDatePicker", true);
                    }
                    if (fType == 'reference') {
                        cmp.set("v." + attributeKey, sObject);
                        cmp.set("v.selectedId", value);
                        cmp.set("v.uniqueIdentifier", fieldLabel);
                        if(fieldName === "RecordTypeId"){
                            var lookUpWhereClauseMap = new Object();
                            lookUpWhereClauseMap["SobjectType"] = component.get("v.baseSobject");
                            cmp.set("v.whereClause",lookUpWhereClauseMap);
                        }
                    }
                    if (fType == 'formula') {
                        cmp.set("v.label", fieldLabel);
                        cmp.set("v.value", value);
                    }
                    if (fType == 'string') {
                        cmp.set("v.class", inpClass + " uiInput-String");
                    }
                    component.set("v.formElement", divFormElement);
                }
            }
        );
    }
})