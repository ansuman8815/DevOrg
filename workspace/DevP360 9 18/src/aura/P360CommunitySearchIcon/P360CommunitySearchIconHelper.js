({
	getPatientSearchData : function(component) {
        var action = component.get("c.getSearchPatientData");
        action.setParams({ 
            firstName : component.get("v.fn"),            
            lastName : component.get("v.ln"),
            gender : component.get("v.gn"),
            cinNo : component.get("v.cin"),
            dob : component.get("v.dob")
        });
         // Create a callback that is executed after the server-side action returns
        action.setCallback(this, function(response)
        {
            var state = response.getState();
        	var toastEvent = $A.get("e.force:showToast");
            if (state === "SUCCESS")
            {
                var res = response.getReturnValue();
                component.set("v.res" , res);
                component.set("v.isLoaded","true");
                if(res.length == 0){
                    toastEvent.setParams({
                     "type": "info",
                     "message": "No patients were found matching the search criteria. Please refine your search and try again.",
                     "mode" : "dismissible"
                    });
                    toastEvent.fire();
                }
                $A.createComponent(
                "c:P360CommunityMainPatientSearchResult",
                {
                    "res": res,
                    "isHeader" : "true",
                    "FName": component.get("v.fn"),
                    "LName": component.get("v.ln"),
                    "DOB":  component.get("v.dob"),
                    "Gender":  component.get("v.gn"),
                    "CIN":  component.get("v.cin")
                },
                function(newData, status, errorMessage){
                    
                    if (status === "SUCCESS") { 
                        var body = component.get("v.body");
                        body = newData;
                        component.set("v.body", body);
                    }
                    else if (status === "INCOMPLETE") {
                        console.log("No response from server or client is offline.");
                    }
                    else if (status === "ERROR") {
                        console.log("Error: " + errorMessage);
                        // Show error message
                    }
                });
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