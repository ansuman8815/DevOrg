/*
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCommunityOutputField - Used to create dynamic output components based on the field dataType.
 * @since 208
 */

({
    configMap: {
        "STRING": {
            componentDef: "ui:outputText"
        },
        "PICKLIST": {
            componentDef: "ui:outputText"
        },
        "MULTIPICKLIST": {
            componentDef: "ui:outputText"
        },
        "BOOLEAN": {
            componentDef: "ui:outputCheckbox"
        },
        "DATE": {
            componentDef: "ui:outputDate"
        },
        "DATETIME": {
            componentDef: "ui:outputDateTime"
        },
        "DOUBLE": {
            componentDef: "ui:outputNumber"
        },
        "INTEGER": {
            componentDef: "ui:outputNumber"
        },
        "PERCENT": {
            componentDef: "ui:outputNumber"
        },
        "CURRENCY": {
            componentDef: "ui:outputCurrency"
        },
        "EMAIL": {
            componentDef: "ui:outputText"
        },
        "PHONE": {
            componentDef: "ui:outputPhone"
        },
        "TEXTAREA": {
            componentDef: "HealthCloudGA:HcTextViewer"
        },
        "URL": {
            componentDef: "ui:outputURL"
        },
        "COMBOBOX": {
            componentDef: "ui:outputText"
        },

        "ID": {
            componentDef: "ui:outputText"
        },
        "REFERENCE": {
            componentDef: "ui:outputText"
        }
    },

    initData: function(component, event, helper) {
        var recordData = component.get("v.record").recordData;
        var fieldApi = component.get("v.field").fieldApi;
        var fieldType = component.get("v.field").fieldType;
        var fieldIndex = component.get("v.fieldIndex");
        var maxNumberOfFields = component.get("v.maxNumberOfFields");
        if (!$A.util.isUndefinedOrNull(fieldIndex) && !$A.util.isUndefinedOrNull(maxNumberOfFields)) {
            if (fieldIndex < maxNumberOfFields) {
                component.set("v.fieldType", fieldType);
                if (fieldApi != 'Name' && fieldApi != 'LastName' && fieldApi != 'FirstName' && fieldApi !== 'Subject' && fieldApi !== 'IsClosed' && fieldApi !== 'ActivityDate') {
                    var fieldValue = recordData[fieldApi];
                    if (!$A.util.isEmpty(fieldValue)) {
                        var fType = fieldType.toLowerCase();
                        if (fType === 'date' || fType === 'datetime') {
                            fieldValue = this.getUserLocalizedDate(fieldValue, 'LL');
                        }
                        component.set("v.fieldValue", fieldValue);
                        this.insertComponent(component);
                        fieldIndex++;
                        component.set("v.fieldIndex", fieldIndex);
                    }
                }
            }
        }
    },

    insertComponent: function(component) {
        var fieldType = component.get("v.field").fieldType;
        var fieldApi = component.get("v.field").fieldApi;
        var fieldValue = component.get("v.fieldValue");
        if (fieldType === 'PHONE') {
            return;
        } else if (fieldType === 'MULTIPICKLIST') {
            //For multipicklist query returns data with semicolons,we need to replace it with comma.
            fieldValue = fieldValue.replace(new RegExp(';', 'g'), ',');
        }
        if (!$A.util.isUndefinedOrNull(fieldType)) {
            var config = this.configMap[fieldType];
            var uiType = config.componentDef;
            $A.createComponent(uiType, {
                    "aura:id": fieldApi,
                    "value": fieldValue
                },
                function(cmp) {
                    if(uiType === "HealthCloudGA:HcTextViewer"){
                      var label = component.get("v.field.fieldLabel");
                      cmp.set("v.label",label);
                    }
                    var formElement = component.get("v.formElement");
                    formElement.push(cmp);
                    component.set("v.formElement", formElement);
                }
            );
        }
    },

    // returns a date string in the user's locale selection in Salesforce Setup
    getUserLocalizedDate: function(date, dateFormat) {
        var date = date || new Date();
        var dateFormat = dateFormat || 'LL'; // default to long local format

        // retrieve user's locale info and create is as a standard locale string (i.e.: en_US, fr_FR, de_DE)
        var userLocale = this.getUserLocaleString();

        // return the localized date
        return $A.localizationService.formatDate(date, dateFormat, userLocale);
    },

    // utility method to return a user's locale string
    // retrieve user's locale info and create is as a standard locale string (i.e.: en_US, fr_FR, de_DE)
    getUserLocaleString: function() {
        return $A.get("$Locale.userLocaleLang") + "_" + $A.get("$Locale.userLocaleCountry");
    },

})