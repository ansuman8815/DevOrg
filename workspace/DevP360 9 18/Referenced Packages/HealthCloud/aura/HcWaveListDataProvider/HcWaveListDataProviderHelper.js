({
    getData: function(actionName, component, event, helper, columnMeta) {
        if($A.util.isEmpty(actionName)) {
            actionName = 'getWavePatientLists';
        }
        var actionMap = {
            getWavePatientLists: "c.getWavePatientLists"
        };

        //Bug in HcAbstractListDataProvider requires a param, remove param once bug is fixed.
        var actionParamsMap = {
            getWavePatientLists : {
                "soffSet": "10",
            }
        };
        var nodatamessage = $A.get("$Label.HealthCloudGA.Text_No_Wave_Lists");
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