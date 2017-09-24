({
    handleActive: function(component, event) {
    	var tab = event.getSource();
    	var tabId = tab.get('v.id');

        var carePlanId =  component.getReference("v.carePlanId");
        var patientId = component.getReference("v.patientId");

        var carePlanTabEvent = component.getEvent("HcCarePlanTabEvent");
        if (carePlanTabEvent != null) {
            carePlanTabEvent.setParams({
                "tabId": tabId,
            });
            carePlanTabEvent.fire();
        }

    	if( tabId == 'tasks' && !component.get("v.isTasksTabLoaded"))
    	{
    		$A.createComponent("HealthCloudGA:HcCarePlanTaskCmp", {
	            	"startT": new Date().getTime(),
					"carePlanId": carePlanId,
					"patientId": patientId
	        	}, 
	        	function (contentComponent, status, error) {
		            if (status === "SUCCESS") 
		            {
		                tab.set('v.body', contentComponent);
		                // prevent future activation once loaded
						component.set("v.isTasksTabLoaded", true);
		            } 
		            else 
		            {
		            	var errorMessage = $A.get("$Label.HealthCloudGA.Items_Display_Error"); 
		                var toastCmp = component.find('toast-message-carePlanTabs');
				        toastCmp.set('v.content', {
				            type: 'error',
				            message: errorMessage
				        });
				        console.error( errorMessage, error );
		            }
	        	}
	        );
    	}
        else if( tabId == 'careTeam' && !component.get("v.isCareTeamTabLoaded"))
        {

            $A.createComponent("HealthCloudGA:HcCareTeamTableContainer", {
                    "startT": new Date().getTime(),
                    "carePlanId": carePlanId
                }, 
                function (contentComponent, status, error) {
                    if (status === "SUCCESS") 
                    {
                        tab.set('v.body', contentComponent);
                        // prevent future activation once loaded
                        component.set("v.isCareTeamTabLoaded", true);
                    } 
                    else 
                    {
                        var errorMessage = $A.get("$Label.HealthCloudGA.Items_Display_Error");
                        var toastCmp = component.find('toast-message-carePlanTabs');
                        toastCmp.set('v.content', {
                            type: 'error',
                            message: errorMessage
                        });
                        console.error( errorMessage, error );
                    }
                }
            );
        }
    }
})