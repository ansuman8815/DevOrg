/* * Copyright © 2017 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description Sent to patient data provider helper function
 * @since 210.
*/

({
	getData: function(actionName, component, event, helper, columnMeta) {

        var patientId = component.get("v.patientId");
        var searchKey = component.get("v.searchText");

        if($A.util.isEmpty(actionName)) {
            actionName = "getSurveysSentToPatient"
        }

        var actionMap = {
            getSurveysSentToPatient : "c.getSurveysSentToPatient"
        };        

        var actionParamsMap = {
            getSurveysSentToPatient : { 
                "patientId" : patientId,
                "searchKey" : searchKey
            }
        };

        var nodatamessage = $A.get("$Label.HealthCloudGA.Text_No_Results");
        var action = helper.getAction(actionName,actionMap,actionParamsMap,component,columnMeta);
        if( $A.util.isEmpty(action)) {
            var errorMsg = $A.get("$Label.HealthCloudGA.Msg_Error_General");
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
                                             actionName,
                                             nodatamessage);
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