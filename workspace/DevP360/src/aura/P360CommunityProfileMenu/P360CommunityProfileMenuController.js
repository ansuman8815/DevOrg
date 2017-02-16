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
    	console.log('Menu Search Click');        
        var divComp = document.getElementById("menuDiv");
        var className = document.getElementById("menuDiv").className;
        console.log(className);
        if(className.indexOf('slds-hide') != -1)
        {
        	$A.util.addClass(divComp, 'slds-show');
        	$A.util.removeClass(divComp, 'slds-hide');
        }
        else{
        	$A.util.removeClass(divComp, 'slds-show');
        	$A.util.addClass(divComp, 'slds-hide');
        }
    }
})