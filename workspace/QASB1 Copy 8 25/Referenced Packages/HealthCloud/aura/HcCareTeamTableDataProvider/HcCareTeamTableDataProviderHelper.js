({
    hiddenColumns : [
        'parentId',
        'memberId',
        'email'
    ],

    getData: function(actionName, component, event, helper, columnMeta) {

        var carePlanId = component.get("v.carePlanId");

        if($A.util.isEmpty(actionName)) {
            actionName = 'getCareTeamMembers';
        }

        var actionMap = {
        	getCareTeamMembers : "c.getCareTeamMembersForCarePlan"
        };

        var actionParamsMap = {
            getCareTeamMembers : { 
                carePlanId : carePlanId
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
        
        var noDataMessage = $A.get("$Label.HealthCloudGA.Text_No_Care_Team_Members");

        var xhrStart = new Date().getTime();
        action.setCallback(this, function(response) {
            var xhrEnd = new Date().getTime();
            helper.progressMessage(' Xhr: '+ actionName +'#' + (xhrEnd - xhrStart),component.get('v.startT'));
            if (response.getState() == "SUCCESS") {
            	var result = response.getReturnValue();
                var _resultList = result.recordsData;

                var processResult = helper.processResponsePageControl(component,columnMeta,result);

                // Custom result metadata manipulation
                var resultColMetadata = processResult.colMetadata;
                var headerColumns = [];
                for( var ii = 0; ii < resultColMetadata.length; ii++ )
                {
                    // TODO: Remove once client side sorting is done
                    if( resultColMetadata[ii].rawName == 'careTeamMemberUserType')
                    {
                        resultColMetadata[ii].isSortable = false;
                    }
                    if( this.hiddenColumns.indexOf( resultColMetadata[ii].rawName ) == -1 )
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
            }
            else if (response.getState() === "ERROR") {
                helper.raiseDataErrorEvent(component, response, noDataMessage);
            }
        });
        $A.enqueueAction(action);
	}
})