({

    validateGroupingAndProceed: function(component, event, helper) {
        var toastCmp = component.find("modalCmp").find("toast-message");
        toastCmp.closeToast();
        var conditionCmp = component.find('filterCriteriaCmp').find("FilterConditionSelector");
        var groupingString = conditionCmp.get("v.filterString");
        var conditions = conditionCmp.get("v.condBody");
        var rows = [];
        var groupSplits = [];
        var isValid = true;
        for (var i = 0; i < conditions.length; i++) {
            rows.push(String(conditions[i].RowNumber__c));
        }

        // To validate if grouping string is only referencing numbers from the added rows
        if (!$A.util.isEmpty(groupingString)) {
            //Added to auto format filter string.
            groupingString = groupingString.toLowerCase().replace(/\s/g,'');
            var formatGroupingString = '';
            for(var i=0; i<groupingString.length; i++){
               var eachCh = groupingString.charAt(i);
               if(eachCh == "(" || eachCh == ")" || !isNaN(eachCh) || eachCh == "r" || eachCh == "d")
               formatGroupingString += groupingString.charAt(i) + " ";
               else
               formatGroupingString += groupingString.charAt(i);         
            }
            conditionCmp.set("v.filterString",formatGroupingString);
            groupingString = formatGroupingString;
            groupSplits = groupingString.split(" ");
            for (var i = 0; i < groupSplits.length; i++) {
                var currentEntity = groupSplits[i].replace("(", "").replace(")", "");
                if ($A.util.isEmpty(currentEntity)) continue;
                if (!isNaN(currentEntity) && rows.indexOf(currentEntity) == -1) {
                    isValid = false;
                }
                else if(isNaN(currentEntity)){
                  currentEntity = currentEntity.toLowerCase();
                  if(currentEntity != 'and' && currentEntity != 'or')
                  isValid = false;
                }
            }
        }

        if (isValid) {
            this.rpcCall(
                component.get("c.validateFilterLogic"),
                {
                    "expression": groupingString
                },
                function(result){
                    var validGrouping = false;
                    if(result.getReturnValue() != null && result.getState() === "SUCCESS"){
                        validGrouping = result.getReturnValue();
                    }
                    if (validGrouping){
                        // If valid calculate the tab index, and sets v.selectedTab to the new tab index
                        helper.calculateIndex(component,event,helper);
                    }
                    else{
                        helper.showModalToast(component,$A.get("$Label.HealthCloudGA.Msg_Error_Invalid_Filter_Logic") );
                    }
                }
            );
        }
        else{
            helper.showModalToast(component,$A.get("$Label.HealthCloudGA.Msg_Error_Invalid_Filter_Logic") );
        }
    },

    calculateIndex: function(component, event, helper) {
        var action = event.getParam("action");
        var index = component.get('v.index');
        if (action === "next") {
            component.set('v.index', index++ <= 3 ? index : 3);
        } else if (action === "back") {
            component.set('v.index', index-- >= 1 ? index : 1);
        }
        component.find('filterCriteriaCmp').set("v.selectedTab", "tab" + index);
    },

    validateFilterList: function(component, event, helper) {

        var isCheckPass = true;
        var filterCriteriaCmp = component.find('filterCriteriaCmp');
        var conditionRowBody = filterCriteriaCmp.find("FilterConditionSelector").get("v.condBody");
        var filterConditions = [];

        for (var j = 0; j < conditionRowBody.length; j++) {
            var filterCond = conditionRowBody[j];

            // if we have a default Type for condition, error
            if (filterCond.Type__c == "Record" ||
                filterCond.Type__c == "Tag") {
                isCheckPass = false;
                break;
            }
            // if we have a default or undefined ObjectName for condition, error
            if ($A.util.isEmpty(filterCond.ObjectName__c) ||
                filterCond.ObjectName__c == $A.get("$Label.HealthCloudGA.Field_Label_Record_Name")) {
                isCheckPass = false;
                break;
            }
            // if we have a default or undefined Field for condition, error
            if ($A.util.isEmpty(filterCond.FieldName__c) || filterCond.FieldName__c == $A.get("$Label.HealthCloudGA.Field_Label_Filter_Field")) {
                isCheckPass = false;
                break;
            }
            // if we have a default or undefined Operator for condition, error
            if ($A.util.isEmpty(filterCond.Operator__c) || filterCond.Operator__c == $A.get("$Label.HealthCloudGA.Field_Label_Filter_Criteria")) {
                isCheckPass = false;
                break;
            }
            // if we have an undefined or empty Value for condition, set to empty string
            if ($A.util.isEmpty(filterCond.Value__c)) {
                filterCond.Value__c = "";
            }
        }

        return isCheckPass;
    },

    validateFilterName: function(component, event, helper) {
        var isCheckPass = true;
        var filterCriteriaCmp = component.find('filterCriteriaCmp');
        var savComp = filterCriteriaCmp.find("FilterSave").get("v.filterName");
        if ($A.util.isEmpty(savComp.trim())) {
            isCheckPass = false;
        }
        return isCheckPass;
    },

    showModalToast: function(component, message){
        component.set('v.toastObj', {
            'type': 'error',
            'message': message
        });
    },

    createUpdateFilterList: function(component, event, helper) {
        helper.toggleSpinner(true,component);
        var self = this;
        var filterCriteriaCmp = component.find('filterCriteriaCmp');
        var isCreate = (undefined == filterCriteriaCmp.get("v.filterId") || component.get("v.filterId") == "");
        var successfulMessage = isCreate ? $A.get("$Label.HealthCloudGA.Msg_Success_Filter_List_Create") : $A.get("$Label.HealthCloudGA.Msg_Success_Filter_List_Edit");
        var failureMessage = isCreate ? $A.get("$Label.HealthCloudGA.Msg_Error_Filter_List_Create") : $A.get("$Label.HealthCloudGA.Msg_Error_Filter_List_Edit");
        var conditionRowBody = filterCriteriaCmp.find("FilterConditionSelector").get("v.condBody");
        var toBeDeletedConditions = filterCriteriaCmp.find("FilterConditionSelector").get("v.toBeDeletedConditions");
        var filterConditions = conditionRowBody;
        var filterGrouping = filterCriteriaCmp.get("v.filterString");


        // columns selection
        var columns = filterCriteriaCmp.find("FilterColumnSelector").get("v.columnFields");
        var filterName = filterCriteriaCmp.find("FilterSave").get("v.filterName");
        var action;

        // if creating
        if (isCreate) {

            action = filterCriteriaCmp.get("c.createFilterList");
            action.setParams({
                "filterName": String(filterName),
                "filterConditions": JSON.stringify(filterConditions),
                "filterColumns": JSON.stringify(columns),
                "groupingString": filterGrouping
            });

            // if updating
        } else {
            action = filterCriteriaCmp.get("c.updateFilterList");
            action.setParams({
                "filterId": String(component.get("v.filterId")),
                "filterName": String(filterName),
                "filterConditions": JSON.stringify(filterConditions),
                "filterColumns": JSON.stringify(columns),
                "groupingString": filterGrouping,
                "toBeDeletedConditions": toBeDeletedConditions
            });

        }

        action.setCallback(this, function(result) {
            var res = result.getReturnValue();
            var state = result.getState();

            if (res != undefined && null != res && state.toUpperCase() === "SUCCESS") {
                var closeEvent = $A.get("e.HealthCloudGA:HcComponentStatusEvent");
                var filterId = JSON.parse(res).Id;
                var filterSobject = JSON.parse(res);
                var memberObj = {
                    'filterId': filterId
                };

                helper.pleaseWait(component, false, 'modalCmp');

                closeEvent.setParams({
                    "status": "SUCCESS",
                    "message": String(successfulMessage),
                    "memberObj": memberObj
                });
                closeEvent.fire();
                helper.toggleSpinner(false,component);

                // if error
            } else {
                var closeEvent = $A.get("e.HealthCloudGA:HcComponentStatusEvent");

                component.set('v.toastObj', {
                    'type': 'error',
                    'message': String(failureMessage)
                });

                closeEvent.setParams({
                    "status": "FAILURE",
                    "message": String(failureMessage)
                });
                closeEvent.fire();
                helper.toggleSpinner(false,component);
            }

        });

        $A.enqueueAction(action);
    }
})