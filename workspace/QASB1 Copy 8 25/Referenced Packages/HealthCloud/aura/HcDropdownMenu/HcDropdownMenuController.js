({

	onTriggerClicked: function(component, event, helper) {
		// fire app event for closing all other menus
		var appEvent = $A.get('e.HealthCloudGA:HcDropDownMenuToggleEvent');
		appEvent.setParams({ "sourceComponent": component });
		appEvent.fire();

		helper.togglePopover(component);
	},

	onOptionClicked: function(component, event, helper) {
		helper.menuSelection(component, event);
		helper.togglePopover(component);
	},

	moveoutPopover: function(component, event, helper) {

		if($A.util.hasClass(component.find('popover').getElement(), 'slds-fall-into-ground')) return;

		if(helper.isMouseoutPopover(component, event)) {
			helper.togglePopover(component);
		}
	},

	// Handle the app event for dropdown menu toggle
	handleAppToggleEvent: function(component, event, helper) {
		helper.closeMenu(component);
	}
})