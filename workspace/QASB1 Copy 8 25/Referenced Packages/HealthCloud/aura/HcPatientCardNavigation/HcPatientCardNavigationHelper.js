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
    /* LABEL_WARMERS: [
        $Label.HealthCloudGA.Engagement,
        $Label.HealthCloudGA.Tab_Timeline,
        $Label.HealthCloudGA.All_Care_Plans,
        $Label.HealthCloudGA.Tab_Careplan,
        $Label.HealthCloudGA.Tab_Careplan_Template_Wizard,
        $Label.HealthCloudGA.Tab_Assessment,
        $Label.HealthCloudGA.Tab_Collaboration,
        $Label.HealthCloudGA.Tab_Relationship
    ]*/
    LABELS_MAP: {},
    RETRIEVED_LABELS_MAP: {},
    ARE_LABELS_RETRIEVED: false,

    getProfileCardViews: function(component) {
        var self = this;
        var action = component.get("c.getCardViewDropdowns");
        action.setStorable();
        action.setCallback(this, function(response) {
            this.LABELS_MAP = {};
            var labelsCount = 0;
            var addToLabelsMap = function(labelName) {
                if(!$A.util.isEmpty(labelName) && !self.LABELS_MAP.hasOwnProperty(labelName)) {
                    labelsCount += 1;
                    self.LABELS_MAP[labelName] = 1;
                }
            };
            var state = response.getState();
            if (state === "SUCCESS") {
                var cardViewEntries = new Array();
                var cvd = response.getReturnValue();
                if (!$A.util.isUndefinedOrNull(cvd)) {
                    for (var i = 0; i < cvd.length; i++) {
                        if (cvd[i].hasOwnProperty('isMcpEnabled') && !$A.util.isUndefinedOrNull(cvd[i].isMcpEnabled)) {
                            component.set("v.isMcpEnabled", cvd[i].isMcpEnabled);
                        } else {
                            var obj = new Object();
                            obj.sortOrder = cvd[i].SubtabSortOrder__c;
                            obj.category = cvd[i].Category__c;
                            obj.subCategory = cvd[i].Sub_Category__c;
                            obj.url = cvd[i].Url__c;
                            obj.defaultSubtab = cvd[i].DefaultSubtab__c;
                            obj.paramString = cvd[i].Param_String__c;
                            obj.recOpenType = cvd[i].Rec_Open_Type__c;
                            obj.categoryLabel = cvd[i].CategoryLabel__c;
                            obj.subCategoryLabel = cvd[i].SubcategoryLabel__c;
                            addToLabelsMap(cvd[i].CategoryLabel__c);                            
                            addToLabelsMap(cvd[i].SubcategoryLabel__c);
                            cardViewEntries.push(obj);
                        }
                    }
                }
                component.set("v.cardViewEntries", cardViewEntries);
                if(labelsCount > 0 && !this.ARE_LABELS_RETRIEVED) {
                    var retrievedLabelsCount = 0;
                    for(var labelKey in this.LABELS_MAP) {
                        if(this.LABELS_MAP.hasOwnProperty(labelKey)) {
                            (function(labelToRetrieve) {
                                $A.get('$Label.HealthCloudGA.'+labelToRetrieve, function(label) {
                                    retrievedLabelsCount += 1;
                                    self.RETRIEVED_LABELS_MAP[labelToRetrieve] = label;
                                    if(retrievedLabelsCount == labelsCount) {
                                        self.ARE_LABELS_RETRIEVED = true;
                                        self.processPatientCardViewData(component, cardViewEntries);
                                    }
                                });
                            })(labelKey);
                        }
                    }
                } else {
                    this.processPatientCardViewData(component, cardViewEntries);
                }
            }
            if (state === "ERROR") {
                this.handleError(component, action.getError());
            }
        });
        $A.enqueueAction(action);
    },

    processPatientCardViewData: function(component, cardViewEntries) {
        var self = this;
        var tempPatientCardArray = {};
        var patientId = component.get('v.patientId');
        for (var i = 0; i < cardViewEntries.length; i++) {
            var categoryLabel = cardViewEntries[i].categoryLabel;
            var subCategoryLabel = cardViewEntries[i].subCategoryLabel;
            var categoryKey = $A.util.isEmpty(categoryLabel) || !this.RETRIEVED_LABELS_MAP.hasOwnProperty(categoryLabel) ? cardViewEntries[i].category : this.RETRIEVED_LABELS_MAP[categoryLabel] ;
            var subCategoryValue = $A.util.isEmpty(subCategoryLabel) || !this.RETRIEVED_LABELS_MAP.hasOwnProperty(subCategoryLabel) ? cardViewEntries[i].subCategory : this.RETRIEVED_LABELS_MAP[subCategoryLabel];
            if (cardViewEntries[i].defaultSubtab == "true" && component.get('v.isRenderedInPatientConsole')) {
                this.launchConsoleTab(cardViewEntries[i].url, cardViewEntries[i].paramString, patientId, 'subtab', subCategoryValue, false);
            }
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
        action.setStorable();
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
                this.handleError(component, action.getError());
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
        if (selVal.startsWith(this.CASE_TYPE_PREFIX)) {
            // Open a specific care plan
            HC.openSingleCarePlanSubtab(selVal, patientId, tabName);
        } else if (selVal == this.CREATE_NEW_CARE_PLAN) {
            var action = component.get("c.getAccountContactDefaultCarePlanRT");
            action.setStorable();
            action.setParams({
                "patientId": component.get("v.patientId")
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var result = response.getReturnValue();
                    var contactId = result.contactId;
                    var accountId = result.accountId;
                    if ($A.util.isUndefinedOrNull(contactId) || $A.util.isUndefinedOrNull(accountId)) {
                        // To do : As a team, decide the appropriate message
                        this.showToast(component, {message: $A.get("$Label.HealthCloudGA.Msg_Error_General")}, true, 'error');
                    } else {
                        HC.openNewCarePlan(accountId, contactId);
                    }
                }
                if (state === "ERROR") {
                    this.handleError(component, action.getError());
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
            var subCategoryLabel = cardViewEntries[i].subCategoryLabel;
            var subCategoryValue = $A.util.isEmpty(subCategoryLabel) || !this.RETRIEVED_LABELS_MAP.hasOwnProperty(subCategoryLabel) ? cardViewEntries[i].subCategory : this.RETRIEVED_LABELS_MAP[subCategoryLabel];
            var tabUrl = cardViewEntries[i].url;
            if (!$A.util.isUndefinedOrNull(selVal) && selVal.toLowerCase() == subCategoryValue.toLowerCase() && tabUrl) {
                var paramStringResponse = cardViewEntries[i].paramString;
                var recOpenType = cardViewEntries[i].recOpenType ? (cardViewEntries[i].recOpenType).toLowerCase() : '';
                this.launchConsoleTab(tabUrl, paramStringResponse, patientId, recOpenType, subCategoryValue, true);
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
    },

    launchConsoleTab: function(tabUrl, paramStringResponse, patientId, recOpenType, tabName, isTabActive) {
        var paramEntries = new Array();
        if (!$A.util.isUndefinedOrNull(paramStringResponse)) {
            paramStringResponse.split(',');
        }
        var paramMap = {};
        for (let i = 0; i < paramEntries.length; i++) {
            let paramEntry = paramEntries[i].split('=');
            if (!$A.util.isEmpty(paramEntry[0])) {
                paramMap[paramEntry[0].trim()] = paramEntry[1];
            }
        }
        paramMap.recId = patientId;
        if (recOpenType == 'subtab' || recOpenType == 'sub tab') {
            HC.openConsoleSubTab(tabUrl, isTabActive === true, tabName, null, tabName, paramMap);
        } else if (recOpenType == 'primarytab' || recOpenType == 'primary tab') {
            HC.openConsolePrimaryTab(tabUrl, isTabActive === true, tabName, tabName, paramMap);
        }
    }
})