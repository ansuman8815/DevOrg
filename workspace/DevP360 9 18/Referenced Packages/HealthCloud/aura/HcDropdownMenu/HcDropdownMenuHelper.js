({
	togglePopover: function(component) {
		$A.util.toggleClass(component.find('popover').getElement(), 'slds-rise-from-ground');
		$A.util.toggleClass(component.find('popover').getElement(), 'slds-fall-into-ground');
	},

	menuSelection: function(component, event) {
		var selectedItem = event.getParam('selectedItem')[0];
		var selectedObj = selectedItem.get('v.item');

		if(selectedItem.get('v.isSelected'))
			return;
		this.cleanupSelection(component);
		component.set('v.selected', selectedObj);
		selectedItem.set('v.isSelected', true);
	},

	cleanupSelection: function(component) {
		var menuItems = component.find('menulist').get('v.body');
		menuItems.forEach(function(item, index){
			item.set('v.isSelected', false);
		});
	},

	isMouseoutPopover: function(component, event) {
		var e = event.toElement || event.relatedTarget;
		var parent = component.find('popover-solid').getElement();

		while (e && e.nodeName && e.nodeName != 'body') {
			if(e == parent) return false;
			e = e.parentNode;
		}
		return true;
	},

	// Close the dropdown menu
	closeMenu: function(component) {
		$A.util.removeClass(component.find('popover').getElement(), 'slds-rise-from-ground');
		$A.util.addClass(component.find('popover').getElement(), 'slds-fall-into-ground');
	}

})