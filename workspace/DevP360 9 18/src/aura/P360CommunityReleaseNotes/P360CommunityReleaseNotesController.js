({
	doInit : function(component, event, helper) {
        var action =component.get("c.getReleaseNoteUrl");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                
                var src=response.getReturnValue();
                component.set("v.src", src);
            }
        });
        $A.enqueueAction(action);
		
	}
})