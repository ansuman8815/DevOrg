({
	getPatientSearchData : function(component) {
        var action = component.get("c.getSearchAccountData");
        
        action.setParams({ 
            firstName : component.find("afirstName").get("v.value"),            
            lastName : component.find("alastName").get("v.value"),
            gender : component.find("agender").get("v.value"),
            cinNo : component.find("acin").get("v.value"),
            dob : component.find("adateofbirth").get("v.value")
        });
         // Create a callback that is executed after the server-side action returns
        action.setCallback(this, function(response)
        {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var res = response.getReturnValue();
                console.log(res);
                console.log(res.length);
                if(res.length > 0){
                    var evt = $A.get("e.c:SearchResult");
                    evt.setParams({ "Show_Result": res});
                    evt.setParams({ "Search_Clicked": true});
                    console.log(evt.getParam("Show_Result"));
                    evt.fire();
                }
                else{
                    component.set("v.errorMessage", '0 record(s) found');
                }
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