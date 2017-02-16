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
                var res = response.getReturnValue()
                var evt = $A.get("e.c:P360CommunityPatientSearchResult");
                evt.setParams({ "Show_Result": res});
                //evt.setParams({ "Search_Clicked": true});
                evt.fire();
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
	},
    
    ToggleCollapseHandler : function(component, event) {  
        var existingText = component.get("v.collpaseText"); 
        var container = component.find("containerCollapsable") ;
        // var container1 = component.find("containerCollapsable1") ;
        
        if(existingText === "Collapse [ - ]"){
             component.set("v.collpaseText","Expand [ + ]");
            $A.util.addClass(container, 'hide');
           // $A.util.addClass(container, 'showcollapse');
            //$A.util.removeClass(container1, 'PatientSearch');
        }else{
            component.set("v.collpaseText","Collapse [ - ]");
            $A.util.removeClass(container, 'hide'); 
           // $A.util.removeClass(container, 'showcollapse');
            //$A.util.addClass(container1, 'PatientSearch');
        }  
	}
    
})