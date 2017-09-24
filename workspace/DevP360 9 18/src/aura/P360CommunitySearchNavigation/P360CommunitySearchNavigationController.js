({
    doInit : function(component, event, helper) {
    var action = component.get("c.getLoggedInUserProfile");
        action.setCallback(this,function(response){
        	var state = response.getState();
            if (state == 'SUCCESS') {
               component.set("v.profilename", response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },
	registryClick : function(component, event, helper) {
		var evt = $A.get("e.force:navigateToURL");
        evt.setParams({
             "url": "/patientregistries",
             isredirect : true
        });
        evt.fire();
	},
	helpClick : function(component, event, helper) {
		var evt = $A.get("e.force:navigateToURL");
        evt.setParams({
             "url": "/help",
             isredirect : true
        });
        evt.fire();
	},
	myAction : function(component, event, helper) {
        $('body').append('<script>svg4everybody();</script>');
	}
})