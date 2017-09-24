/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description helper of HcCarePlanTemplateDataProvider component
 * @since 196
 */
({
    getData: function(actionName, component, event, helper, columnMeta) {

        var searchKey = component.get("v.searchText");

        if($A.util.isEmpty(actionName)) {
            actionName = "searchCarePlanTemplates"
        }

        var actionMap = {
            searchCarePlanTemplates : "c.searchCarePlanTemplates"
        };        

        var actionParamsMap = {
            DEFAULT : { 
                "searchKey" : searchKey
            }
        };

        var action = helper.getAction(actionName,actionMap,actionParamsMap,component,columnMeta);
        if( $A.util.isEmpty(action)) {
            var errorMsg = $A.get("$Label.HealthCloudGA.Msg_Invalid_Filter_Message");
            var compEvent = component.getEvent("error");
            compEvent.setParams({error:errorMsg});
            compEvent.fire();
            return;
        }

        var xhrStart = new Date().getTime();
        action.setCallback(this, function(response) {
            var xhrEnd = new Date().getTime();
            helper.progressMessage(' Xhr: '+ actionName +'#' + (xhrEnd - xhrStart),component.get('v.startT'));
            if (response.getState() == "SUCCESS") {
                var result = response.getReturnValue();
                var _resultList = result.recordsData;           
                
                var processResult = helper.processResponsePageControl(component,columnMeta,result);
                helper.raiseDataFetchedEvent(component,
                                             processResult.eventType,
                                             processResult.colMetadata,
                                             _resultList,
                                             processResult.hasMoreData,
                                             actionName);
            } else if (response.getState() === "ERROR") {
                // add exception handling
                var errorMsg = helper.getErrorMessage(response);
                var compEvent = component.getEvent("error");
                compEvent.setParams({error:errorMsg});
                compEvent.fire();
            }
        });
        $A.enqueueAction(action);
        
    }
})