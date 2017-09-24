({
	onActionClicked : function(component, event, helper) {
		var actionName = event.getParam('value');
		helper[actionName](component);
	}
})