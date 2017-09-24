({
	onOptionClicked: function(component, event, helper) {
		var menuSelectEvt = component.getEvent("menuSelect");
		menuSelectEvt.setParams({
			"selectedItem" : [component] });
		menuSelectEvt.fire();
	}
})