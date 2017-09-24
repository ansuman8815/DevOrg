({
    VIEW_ID_ALL: 'all',
    VIEW_ID_CONVERTED: 'con',

    getData: function(actionName, component, event, helper, columnMeta) {
        var action = component.get("c.getDataSet");

        var actionParamsMap = {
            DEFAULT: {
                "objectName": "CandidatePatient__c",
                "fieldSetName": 'CandidatePatientListView',
                "customMetaDataType": "LabelConfig__mdt",
                "conditionMap": null
            }
        };
        if (actionName!=this.VIEW_ID_ALL){
            actionParamsMap.DEFAULT.conditionMap = {"IsConvertedToPatient__c":(actionName===this.VIEW_ID_CONVERTED?"true":"false")};
        }

        var actionMap = {
            getDataSet : "c.getDataSet"
        };

        var action = helper.getAction('getDataSet',actionMap,actionParamsMap,component,columnMeta);

        var xhrStart = new Date().getTime();
        action.setCallback(this, function(response) {
            var xhrEnd = new Date().getTime();
            helper.progressMessage(' Xhr: '+ actionName +'#' + (xhrEnd - xhrStart),component.get('v.startT'));
            if (response.getState() == "SUCCESS") {
                var result = response.getReturnValue();
                var _resultList = result.recordsData;

                var processResult = helper.processResponsePageControl(component, columnMeta, result);
                helper.raiseDataFetchedEvent(component,
                    processResult.eventType,
                    processResult.colMetadata,
                    _resultList,
                    processResult.hasMoreData,
                    actionName,
                    '',
                    result.pageControl.totalRows);

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