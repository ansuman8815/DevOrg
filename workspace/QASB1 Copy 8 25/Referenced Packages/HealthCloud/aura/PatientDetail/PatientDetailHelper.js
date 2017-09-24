({
    isPSLRestricted: function(component) {
        var self = this;
        var action = component.get("c.isPSLRestricted");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var isPSLRestricted = response.getReturnValue();
                if (!$A.util.isUndefinedOrNull(isPSLRestricted)) {
                    component.set("v.isPSLRestricted", isPSLRestricted);
                }
            }
            if (state === "ERROR") {
                var errors = response.getError();
                self.handleError(component, errors);
            }
        });
        $A.enqueueAction(action);
    },
})

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
        var self = this;
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
                        var messageBody = {
                            message: $A.get("$Label.HealthCloudGA.Msg_Error_General")
                        };
                        self.showToast(component, messageBody, true, 'error');
                    } else {
                        HC.openNewCarePlanSubtab(recordTypeId, contactId, accountId);
                    }
                }
                if (state === "ERROR") {
                    self.handleError(component, action.getError());
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