/*
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description Helper for the patientDetailComponent
 * @since 198
 */
({
    CREATE_NEW_CARE_PLAN: 'createNewCarePlan',
    CASE_TYPE_PREFIX: '500',
    DEFAULT_NUMBER_CARE_PLANS_ON_PATIENT_CARD: '25',
    TOTAL_CARE_PLANS: 'totalCarePlans',
    MAX_CHARACTERS_ON_LINE: 30,

    getProfileCardViews: function(component, helper) {
        var cardViewEntries = component.get("v.cardViewEntries");
        var tempPatientCardArray = {};
        for (var i = 0; i < cardViewEntries.length; i++) {
            var categoryKey = cardViewEntries[i].categoryLabel ? cardViewEntries[i].categoryLabel : cardViewEntries[i].category;
            var subCategoryValue = cardViewEntries[i].subCategoryLabel ? cardViewEntries[i].subCategoryLabel : cardViewEntries[i].subCategory;
            var listValue = tempPatientCardArray[categoryKey];
            if ($A.util.isUndefinedOrNull(listValue)) {
                listValue = new Array();
                tempPatientCardArray[categoryKey] = listValue;
            }
            var eachCat = new Object();
            eachCat.displayText = subCategoryValue;
            eachCat.name = subCategoryValue;
            listValue.push(eachCat);
        }

        // Sorting the Categories in Ascending order.
        var keys = Object.keys(tempPatientCardArray);
        keys.sort();
        var patientCardArray = {};
        for (var i = 0; i < keys.length; i++) {
            var lst = tempPatientCardArray[keys[i]];
            lst.sort(function(a, b) {
                return a.displayText.localeCompare(b.displayText);
            });
            patientCardArray[keys[i]] = lst;
        }

        var isMcpEnabled = component.get("v.isMcpEnabled");
        var labelTextMap = {};
        if (isMcpEnabled == "true") {
            this.handleMultipleCarePlan(component, patientCardArray, labelTextMap);
        } else {
            this.handleSingleCarePlan(component, patientCardArray, labelTextMap);
        }
    },

    handleSingleCarePlan: function(component, patientCardArray, labelTextMap) {
        this.processPatientCardEntries(component, patientCardArray, labelTextMap, false);
    },

    handleMultipleCarePlan: function(component, patientCardArray, labelTextMap) {
        var action = component.get("c.getCategories");
        action.setBackground();
        action.setParams({
            "patientId": component.get("v.patientId"),
            "soffSet": "0",
            "srowLimit": this.DEFAULT_NUMBER_CARE_PLANS_ON_PATIENT_CARD,
            "excludeStatus": "Closed"
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var returnMap = response.getReturnValue();
                var keys = Object.keys(returnMap);
                for (var i = 0; i < keys.length; i++) {
                    patientCardArray[keys[i]] = returnMap[keys[i]];
                }
                this.processPatientCardEntries(component, patientCardArray, labelTextMap, true);
            }
            if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        component.set('v.errorMsg', errors[0].message);
                    }
                } else {
                    component.set('v.errorMsg', "Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },

    processPatientCardEntries: function(component, patientCardArray, labelTextMap, isMcpEnabled) {
        var objArray = [];
        var keys = Object.keys(patientCardArray);
        var retrievedCarePlans = 0;
        var totalCarePlans = 0;
        for (var i = 0; i < keys.length; i++) {
            var eachCat = new Object();
            eachCat.key = keys[i];
            eachCat.lValue = patientCardArray[keys[i]];
            for (var j = 0; j < eachCat.lValue.length; j++) {
                this.arrangeDisplayText(eachCat, j, this.MAX_CHARACTERS_ON_LINE);
                if (!$A.util.isUndefinedOrNull(eachCat.lValue[j].id)) {
                    // Key = Case Id, For specific care plan 
                    retrievedCarePlans = retrievedCarePlans + 1;
                    labelTextMap[eachCat.lValue[j].id] = eachCat.lValue[j].name;
                    if (eachCat.lValue[j].hasOwnProperty(this.TOTAL_CARE_PLANS)) {
                        totalCarePlans = parseInt(eachCat.lValue[j][this.TOTAL_CARE_PLANS]);
                    } else {
                        totalCarePlans = parseInt(retrievedCarePlans);
                    }
                } else {
                    labelTextMap[eachCat.lValue[j].name] = eachCat.lValue[j].displayText;
                }
            }
            objArray.push(eachCat);
        }

        component.set("v.dropValues", objArray);
        component.set("v.labelTextMap", labelTextMap);
        if (isMcpEnabled == true) {
            var formattedLabel = HC.format($A.get("$Label.HealthCloudGA.Label_Number_of_Care_Plans_Fetched"), retrievedCarePlans, totalCarePlans);
            component.set("v.labelNumberOfCarePlans", formattedLabel);
        }
    },

    processSelectedDropValue: function(component, selVal) {
        var tabName = component.get("v.labelTextMap")[selVal];
        tabName = tabName + ' ';
        var patientId = component.get('v.patientId');
        var namespaceDash = component.get("v.namespaceDash");
        if (selVal.startsWith(this.CASE_TYPE_PREFIX)) {
            // Open a specific care plan
            HC.openSingleCarePlanSubtab(selVal, patientId, tabName, namespaceDash);
        } else if (selVal == this.CREATE_NEW_CARE_PLAN) {
            var action = component.get("c.getAccountContactDefaultCarePlanRT");
            action.setParams({
                "patientId": component.get("v.patientId")
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var result = response.getReturnValue();
                    var recordTypeId = result.recordTypeId;
                    var contactId = result.contactId;
                    var accountId = result.accountId;
                    if ($A.util.isUndefinedOrNull(recordTypeId) || $A.util.isUndefinedOrNull(contactId) || $A.util.isUndefinedOrNull(accountId)) {
                        // To do : As a team, decide the appropriate message
                        component.set('v.errorMsg', $A.get("$Label.HealthCloudGA.Msg_Error_General"));
                    } else {
                        HC.openNewCarePlanSubtab(recordTypeId, contactId, accountId);
                    }
                }
                if (state === "ERROR") {
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            component.set('v.errorMsg', errors[0].message);
                        }
                    } else {
                        component.set('v.errorMsg', "Unknown error");
                    }
                }
            });
            $A.enqueueAction(action);
        } else {
            this.processValuesFromCustomSettings(component, selVal, patientId);
        }
    },

    processValuesFromCustomSettings: function(component, selVal, patientId) {
        var cardViewEntries = component.get("v.cardViewEntries");
        for (var i = 0; i < cardViewEntries.length; i++) {
            var subCategoryValue = cardViewEntries[i].subCategoryLabel ? cardViewEntries[i].subCategoryLabel : cardViewEntries[i].subCategory;
            var tabUrl = cardViewEntries[i].url;
            if (!$A.util.isUndefinedOrNull(selVal) && selVal.toLowerCase() == subCategoryValue.toLowerCase() && tabUrl) {
                var paramStringResponse = cardViewEntries[i].paramString;
                var pString = [];
                var paramString = '';
                if (paramStringResponse) {
                    if (paramStringResponse.indexOf(',') != -1) {
                        pString = paramStringResponse.split(',');
                        for (var i = 0; i < pString.length; i++) {
                            paramString += pString[i] + '&';
                        }
                    } else {
                        paramString = paramStringResponse + '&';
                    }
                }
                tabUrl = tabUrl + '?';
                if (paramString) {
                    tabUrl = tabUrl + paramString;
                }
                tabUrl = tabUrl + 'recId=' + patientId;
                var recOpenType = cardViewEntries[i].recOpenType ? (cardViewEntries[i].recOpenType).toLowerCase() : '';
                if (recOpenType == 'subtab' || recOpenType == 'sub tab') {
                    HC.openConsoleSubtab(tabUrl, true, subCategoryValue, null, subCategoryValue);
                } else if (recOpenType == 'primarytab' || recOpenType == 'primary tab') {
                    HC.openConsolePrimarytab(tabUrl, true, subCategoryValue, subCategoryValue);
                }
                break;
            }
        }
    },

    arrangeDisplayText: function(eachCat, j, numberOfCharsOnFirstLine) {
        var textLength = (eachCat.lValue[j].displayText).length;
        if (textLength > numberOfCharsOnFirstLine) {
            var firstLine = eachCat.lValue[j].displayText;
            var secondLine = eachCat.lValue[j].displayText;
            firstLine = firstLine.slice(0, numberOfCharsOnFirstLine);
            var lastWhiteSpace = firstLine.lastIndexOf(" ");
            if (lastWhiteSpace != -1) {
                firstLine = firstLine.slice(0, lastWhiteSpace);
            }
            eachCat.lValue[j].displayText = firstLine;
            var firstLineLength = firstLine.length;
            var firstWhiteSpace = -1;

            if (textLength <= (firstLineLength * 2) - 4) {
                secondLine = secondLine.slice(firstLineLength, (firstLineLength * 2) - 4);
                firstWhiteSpace = secondLine.indexOf(" ");
                if (firstWhiteSpace >= 0) {
                    secondLine = secondLine.slice(firstWhiteSpace, (firstLineLength * 2) - 4);
                }
                eachCat.lValue[j].displayTextSecondLine = '... ' + secondLine.trim();
            } else {
                secondLine = secondLine.slice(-(firstLineLength - 4));
                firstWhiteSpace = secondLine.indexOf(" ");
                if (firstWhiteSpace >= 0) {
                    secondLine = secondLine.slice(firstWhiteSpace, (firstLineLength * 2) - 4);
                }
                eachCat.lValue[j].displayTextSecondLine = '... ' + secondLine.trim();
            }
        }
    }
})