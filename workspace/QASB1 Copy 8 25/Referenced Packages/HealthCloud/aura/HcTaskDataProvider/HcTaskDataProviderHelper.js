({

    getData: function(actionName, component, event, helper, columnMeta) {
        var carePlanId = component.get("v.carePlanId");
        if($A.util.isEmpty(carePlanId)) {
            console.log('carePlanId is not provided');
            this.getCarePlanId(component,event,actionName,helper,columnMeta);
        }else {
            this._getData(actionName, component, event, helper, columnMeta);
        }
    },  

    getCarePlanId : function(component, event,actionName,helper,columnMeta) {
        var carePlanId = component.get("v.carePlanId");
        if($A.util.isEmpty(carePlanId)) {
            var action = component.get("c.getCarePlanIdFromPatientId");
            action.setParams({
                "patientId": component.get("v.patientId")
            });
            action.setCallback(this, function(result) {
                if (result.getState() === "SUCCESS") {
                    carePlanId = result.getReturnValue();
                    component.set("v.carePlanId", carePlanId);
                    this._getData(actionName, component, event, helper, columnMeta);
                }
                //Error from backend
                else {
                    throw new Error($A.get("$Label.HealthCloudGA.Msg_Error_General"));
                }
            });
            $A.enqueueAction(action);
        }

    },

    _getData: function(actionName, component, event, helper, columnMeta) {

        var carePlanId = component.get("v.carePlanId");
        var goalId = component.get("v.goalId");
        var goalIds = [goalId];
        if($A.util.isEmpty(actionName)) {
            actionName = 'getAllTasksForPlan';
        }

        var actionMap = {
            getAllTasksForPlan : "c.getAllTasksForPlan",
            getUncategorizedTasksForPlan : "c.getUncategorizedTasksForPlan",
            getCategorizedTasksForPlan : "c.getCategorizedTasksForPlan",
            getTasksForGoals : "c.getTasksForGoals"
        };        

        var actionParamsMap = {
            DEFAULT : { 
                "carePlanId": carePlanId
            },
            getTasksForGoals : {
                "goalIds": goalIds
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

        var noDataMessage = $A.get("$Label.HealthCloudGA.Text_No_Tasks");
        var actionNoDataMessageMap = {
            getUncategorizedTasksForPlan : $A.get("$Label.HealthCloudGA.Text_No_Unrelated_Tasks"),
            getCategorizedTasksForPlan : $A.get("$Label.HealthCloudGA.Text_No_Related_Tasks")
        };
        if( actionNoDataMessageMap.hasOwnProperty( actionName ) )
        {
            noDataMessage = actionNoDataMessageMap[ actionName ];
        }

        var xhrStart = new Date().getTime();
        action.setBackground();
        action.setCallback(this, function(response) {
            var xhrEnd = new Date().getTime();
            helper.progressMessage(' Xhr: '+ actionName +'#' + (xhrEnd - xhrStart),component.get('v.startT'));
            if (response.getState() == "SUCCESS") {
                var result = response.getReturnValue();
                var _resultList = result.recordsData;

                /* Any custom result manipulations */
                for(var i=0;i<_resultList.length;i++) {
                    var task = _resultList[i];
                    if(!$A.util.isEmpty(task.Owner)) {
                        var currentOwner = task.Owner;
                        task.Owner = JSON.parse( currentOwner );
                    }
                    if(!$A.util.isEmpty(task.Who)) {
                        var currentOwner = task.Who;
                        task.Who = JSON.parse( currentOwner );
                    }
                }                
                
                var processResult = helper.processResponsePageControl(component,columnMeta,result);
                helper.raiseDataFetchedEvent(component,
                                             processResult.eventType,
                                             processResult.colMetadata,
                                             _resultList,
                                             processResult.hasMoreData,
                                             actionName,
                                             noDataMessage);
            } else if (response.getState() === "ERROR") {
                // add exception handling
                var errorMsg = helper.getErrorMessage(response);
                var compEvent = component.getEvent("error");
                compEvent.setParams({error:errorMsg});
                compEvent.fire();
            }
        });
        $A.enqueueAction(action);
    },
})