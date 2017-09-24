/**
* Copyright © 2015 salesforce.com, inc. All rights reserved.
* @copyright This document contains proprietary and confidential information and shall not be reproduced,
* transferred, or disclosed to others, without the prior written consent of Salesforce.
* @description HcFilterConditionsCmpHelper, helper class for HcFilterConditionsCmp Component.
* @since 196
*/
({
    initializeFilterBuilder: function(component) {
        var cond = new Object();
        cond.RowNumber__c = 1;
        cond.ObjectName__c = $A.get("$Label.HealthCloudGA.Field_Label_Record_Name");
        cond.FieldName__c = $A.get("$Label.HealthCloudGA.Field_Label_Filter_Field");
        cond.Operator__c = $A.get("$Label.HealthCloudGA.Field_Label_Filter_Criteria");
        cond.Value__c = "";
        cond.Type__c = "Type";
        var temp = [];
        temp.push(cond);
        component.set("v.condBody", temp);
    },

    addFilterBuilder: function(component) {
        var temp = component.get("v.condBody");
        var currLength = temp.length + 1;
        var cond = new Object();
        cond.RowNumber__c = currLength;
        cond.ObjectName__c = $A.get("$Label.HealthCloudGA.Field_Label_Record_Name");
        cond.FieldName__c = $A.get("$Label.HealthCloudGA.Field_Label_Filter_Field");
        cond.Operator__c = $A.get("$Label.HealthCloudGA.Field_Label_Filter_Criteria");
        cond.Value__c = "";
        cond.Type__c = "Type";
        temp.push(cond);
        component.set("v.condBody", temp);
    },

    deleteFilterCond: function(component, event) {
        var temp = component.get("v.condBody");
        var index = parseInt(event.getParam("rowNumber"));
        var index = index - 1;

        if (undefined != temp && temp != "") {
            var deleteConditionsArray = component.get("v.toBeDeletedConditions");
            var deleteRecordId = temp[index].Id;
            if(!$A.util.isEmpty(deleteRecordId)){
              deleteConditionsArray.push(temp[index].Id);
              component.set("v.toBeDeletedConditions",deleteConditionsArray);
            }
            // remove the target row
            if (index > -1) {
                temp.splice(index, 1);
            }

            // renumber the rows
            for (var i = 0; i < temp.length; i++) {
                temp[i].RowNumber__c = i + 1;
            }

            component.set("v.condBody", temp);
        }
    },

    fetchFilterString: function(component){
      var filterId = component.get("v.filterId");
      var self = this;
      if(!$A.util.isEmpty(filterId)){
        var action = component.get("c.fetchFilterString");
        action.setParams({
            "filterId": filterId
        });
        action.setCallback(this, function(result) {
            var res = result.getReturnValue();
            var state = result.getState();
            if (!$A.util.isUndefinedOrNull(res) && state.toUpperCase() === "SUCCESS") {
                component.set("v.filterString", res);
            } else {
                //TODO 1. Handle failure condition
                console.log("ERROR!! => " + state);
                console.log(res);
            }
        });
        $A.enqueueAction(action);
      }
    },

    populateFilterBuilder: function(component) {
        var filterId = component.get("v.filterId");
        var self = this;

        if (filterId != "" && undefined != filterId) {
            var action = component.get("c.getFilterConditionsByFilterCriterionId");

            action.setParams({
                "filterCriterionId": filterId
            });

            action.setCallback(this, function(result) {
                var res = result.getReturnValue();
                var state = result.getState();

                if (res != undefined && null != res && state.toUpperCase() === "SUCCESS") {

                    component.set("v.condBody", res);

                } else {
                    component.set("v.conditionsError",$A.get("$Label.HealthCloudGA.Msg_Error_conditions"))
                    console.log("ERROR!! => " + state);
                    console.log(res);
                }
                component.set("v.showSpinner", false);
            });
            $A.enqueueAction(action);
        }
    },

    createFilterCond: function(fltrCondMap) {
        var cond = new Object();
        cond.RowNumber__c = fltrCondMap.RowNumber__c;
        cond.ObjectName__c = fltrCondMap.ObjectName__c;
        cond.FieldName__c = fltrCondMap.FieldName__c;
        cond.Operator__c = fltrCondMap.Operator__c;
        cond.Value__c = fltrCondMap.Value__c;
        cond.Type__c = fltrCondMap.Type__c;
        return cond;

    }

})