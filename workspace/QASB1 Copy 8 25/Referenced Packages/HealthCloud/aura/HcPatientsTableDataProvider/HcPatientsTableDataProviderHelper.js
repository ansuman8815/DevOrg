({
    getData: function(actionName, component, event, helper, columnMeta) {

		var selectedViewId = component.get("v.selectedViewId");

		if($A.util.isEmpty(actionName)) {
            actionName = 'getPatientsByView';
        }

        var actionMap = {
        	getPatientsByView : "c.getPatientsByView"
        };

        var actionParamsMap = {
            getPatientsByView : { 
                selectedViewId : $A.util.isUndefinedOrNull( selectedViewId ) ? null : selectedViewId
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
        
        var noDataMessage = $A.get("$Label.HealthCloudGA.Text_No_Patients");

        var xhrStart = new Date().getTime();
        action.setCallback(this, function(response) {
            var xhrEnd = new Date().getTime();
            helper.progressMessage(' Xhr: '+ actionName +'#' + (xhrEnd - xhrStart),component.get('v.startT'));
            if (response.getState() == "SUCCESS") {
                var result = response.getReturnValue();
                if(result != null){
                   
                    var _resultList = result.recordsData;
    
                    var processResult = helper.processResponsePageControl(component, columnMeta, result);
    
                    // Custom result metadata manipulation
                    var resultColMetadata = processResult.colMetadata;
                    var headerColumns = [];
                    for( var ii = 0; ii < resultColMetadata.length; ii++ )
                    {
                        var objectName = resultColMetadata[ii].rawName.split('.')[0];
                        if( objectName != 'account')
                        {
                            resultColMetadata[ii].isSortable = false;
                        }
                        if( resultColMetadata[ii].rawName == 'APP_DRIVER' )
                        {
                            component.set('v.appDriver', resultColMetadata[ii].label);
                        }
                        else
                        {
                            headerColumns.push( resultColMetadata[ii] );
                        }
                    }
    
                    helper.raiseDataFetchedEvent(component,
                                                 processResult.eventType,
                                                 headerColumns,
                                                 _resultList,
                                                 processResult.hasMoreData,
                                                 actionName,
                                                 noDataMessage);
                } else {
                    helper.raiseDataFetchedEvent(component,
                                                 'DataFetch',
                                                 [],
                                                 [],
                                                 false,
                                                 actionName,
                                                 '');
                    return;
                }
            }
            else if (response.getState() === "ERROR") {
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