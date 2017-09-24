({
	doInit : function(component, event, helper) {
		var action = component.get("c.getLoggedInUser");
        action.setCallback(this,function(response){
        	var state = response.getState();
            if (state == 'SUCCESS') {
            	component.set("v.loggedinUser", response.getReturnValue());
                var result = response.getReturnValue();
                var loggedinUserName = result.FirstName + ' '+result.LastName;
                component.set("v.loggedinUserName", loggedinUserName);
            }
        });
        $A.enqueueAction(action);    
    },
    menuSearchClick : function(component, event, helper) {
        var divComp = document.getElementById("menuDiv");
        var className = document.getElementById("menuDiv").style.display;
        if(className.indexOf("none") != -1)
        {
            if(document.getElementById("quickLinkDiv"))
            document.getElementById("quickLinkDiv").style.display = "none";
            if(document.getElementById("searchLinkDiv"))
            	document.getElementById("searchLinkDiv").style.display = "none";
            else
                document.getElementById("searchLinkDiv1").style.display = "none";
            	document.getElementById("menuDiv").style.display = "block";
        }
        else{
            document.getElementById("menuDiv").style.display = "none";
        }
    }
})