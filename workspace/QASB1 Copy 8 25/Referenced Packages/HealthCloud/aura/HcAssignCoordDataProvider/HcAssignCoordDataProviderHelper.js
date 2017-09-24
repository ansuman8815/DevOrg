({
    getData: function(actionName, component, event, helper, columnMeta) {
        var searchTerm = component.get("v.searchUsersTerm");

        var actionMap = {
            getInternalUsersByName: "c.getInternalUsersByName"
        };

        var actionParamsMap = {
            DEFAULT:{
                "searchString":searchTerm
            }
        };

        var action = helper.getAction(actionName,actionMap,actionParamsMap,component,columnMeta);
        if( $A.util.isEmpty(action)) {
            // MD: need different error message label here
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

                var processResult = helper.processResponsePageControl(component, columnMeta, result);
                helper.raiseDataFetchedEvent(component,
                    processResult.eventType,
                    processResult.colMetadata,
                    _resultList,
                    processResult.hasMoreData,
                    actionName,
                    '');

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