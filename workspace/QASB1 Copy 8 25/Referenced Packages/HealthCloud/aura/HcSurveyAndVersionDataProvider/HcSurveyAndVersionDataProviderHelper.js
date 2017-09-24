/* * Copyright © 2017 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description Survey and Version Component
 * @since 210.
*/
({
    getData: function(actionName, component, event, helper, columnMeta) {
        var searchKey = component.get("v.searchText");

        if($A.util.isEmpty(actionName)) {
            actionName = 'getSurveysAvailableToPatient';
        }
        var actionMap = {
            getSurveysAvailableToPatient: "c.getSurveysAvailableToPatient"
        };

        var patientId = component.get("v.patientId");
        //Bug in HcAbstractListDataProvider requires a param, remove param once bug is fixed.
        var actionParamsMap = {
            getSurveysAvailableToPatient : {
                "soffSet": "50",
                "searchKey": searchKey
            }
        };
        
        //TODO Need message here
        var nodatamessage = $A.get("$Label.HealthCloudGA.Text_No_Results");
        var action = helper.getAction(actionName,actionMap,actionParamsMap,component,columnMeta);
        if( $A.util.isEmpty(action)) {
            // MD: need different error message label here
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
            if (response.getState() === "SUCCESS") {
                var result = response.getReturnValue();
                var _resultList = result.recordsData;
                var communityList = component.get("v.communityList");
                // loop throught _resultList, set community list
                for (var i = 0; i < _resultList.length; i++) {
                    if (typeof _resultList[i] !== 'undefined' && _resultList[i] !== null) {
                        _resultList[i].communityList = communityList;
                    }
                }
                var processResult = helper.processResponsePageControl(component, columnMeta, result);
                // Custom result metadata manipulation
                    var resultColMetadata = processResult.colMetadata;
                    var headerColumns = [];
                    for( var j = 0; j < resultColMetadata.length; j++ )
                    {
                        var fieldName = resultColMetadata[j].rawName;
                        if( fieldName === 'VersionNumber')
                        {
                            resultColMetadata[j].isSortable = false;
                        }
                    }

                helper.raiseDataFetchedEvent(component,
                    processResult.eventType,
                    resultColMetadata,
                    _resultList,
                    processResult.hasMoreData,
                    actionName,
                    nodatamessage);

            } else if (response.getState() === "ERROR") {
                // add exception handling
                var error = helper.getErrorMessage(response);
                var compEvent2 = component.getEvent("error");
                compEvent2.setParams({error:error});
                compEvent2.fire();
            }
        });
        $A.enqueueAction(action);
    },
    fetchCommunities: function (component, event, helper) {
        // Create the action
        var action = component.get("c.fetchCommunity");
        var patientId = component.get("v.patientId");
        action.setParams({
            "accountId": patientId //should set patientId
        });
        // Add callback behavior for when response is received
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                component.set("v.communityList", response.getReturnValue());
            }
            else if (response.getState() === "ERROR") {
                // add exception handling
                var errorMsg = $A.get("$Label.HealthCloudGA.Msg_Error_General");
                var compEvent = component.getEvent("error");
                compEvent.setParams({error:errorMsg});
                compEvent.fire();
            }
            //This is needed if we want to do AutoInit
            helper.abstractInit(component, event, helper);
        });
        // Send action off to be executed
        $A.enqueueAction(action);
    }
})