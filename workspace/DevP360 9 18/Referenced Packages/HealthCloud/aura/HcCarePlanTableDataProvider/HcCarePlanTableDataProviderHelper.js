({
    getData: function(actionName, component, event, helper, columnMeta) {

        var patientId = component.get("v.patientId");
        if($A.util.isEmpty(actionName)) {
            actionName = 'getCarePlanDetailsByPatient';
        }

        var actionMap = {
            getCarePlanDetailsByPatient : "c.getCarePlanDetailsByPatient"
        };

        var allCarePlansTabId;
        var status = component.get("v.status");
        var excludeStatus = component.get("v.excludeStatus");
        if (status == "Closed") {
            allCarePlansTabId = "closedCases";
        }else if (excludeStatus == "Closed") {
            allCarePlansTabId = "openCases";
        } else {
            allCarePlansTabId = "allCases";
        }

        var actionParamsMap = {
            getCarePlanDetailsByPatient : {
                "patientId": patientId,
                'status' : status,
                'excludeStatus':excludeStatus,
                'retrieveProblems' : false
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
                
                var panelMeta = [];
                var panelRow = [];
                for(var i=0;i<_resultList.length;i++) {
                    var resultRow = {
                        metadata: processResult.colMetadata,
                        row:_resultList[i],
                        Id: _resultList[i].Id,
                        allCarePlansTabId : allCarePlansTabId
                    };
                    panelRow.push(resultRow);
                }
                
                helper.raiseDataFetchedEvent(component,
                                             processResult.eventType,
                                             panelMeta,
                                             panelRow,
                                             processResult.hasMoreData,
                                             actionName);
            } else if (response.getState() === "ERROR") {
                // add exception handling
                var errorMsg = helper.getErrorMessage(response);
                if(errorMsg.indexOf($A.get("$Label.HealthCloudGA.Msg_Component_Has_NoAccess"))!=-1){
                   component.set("v.isPSLEnforced", true);
               }else{
                var compEvent = component.getEvent("error");
                compEvent.setParams({error:errorMsg});
                compEvent.fire();
                }
            }
        });
        $A.enqueueAction(action);
    },
})