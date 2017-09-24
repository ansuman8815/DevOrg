({
	doInit : function(component, event, helper) {
        var childComponent = component.find('child');
		childComponent.myMethod("Error!!", "Message");
	}
})