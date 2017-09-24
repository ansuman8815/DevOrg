({
	getPopulationMetricData : function(component) {
        
		var action = component.get("c.getPatientPopulationData");
        action.setParams({ 
            patientId : component.get("v.patientid")            
           
        });
        
         // Create a callback that is executed after the server-side action returns
        action.setCallback(this, function(response)
        {
            var state = response.getState();
        	
            if (component.isValid() && state === "SUCCESS") {
                component.set("v.populationmetricdata", response.getReturnValue());
            }
            else if (state === "INCOMPLETE") {
                console.log('event Incomplete');
            }
            else if (state === "ERROR") 
            {
                var errors = response.getError();
                if (errors && errors[0] && errors[0].message)  {
                    console.log("Error message: " + errors[0].message);
                }
                else console.log("Unknown error");
            }              
        });
         $A.enqueueAction(action);
	}
})