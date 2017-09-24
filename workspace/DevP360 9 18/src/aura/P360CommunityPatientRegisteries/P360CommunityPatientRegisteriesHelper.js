({
	setSession : function(component) {
    	var sessionAction = component.get("c.updateUserSession");
        sessionAction.setParams({          
            currentPage : component.get("v.currentPage"),
            encounterId : component.get("v.encounterId")
        });
        sessionAction.setCallback(this, function(response)
        {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var res = response.getReturnValue();
            }
            else
            {
                console.log('Error');
            }
        });
        $A.enqueueAction(sessionAction);
    }
})