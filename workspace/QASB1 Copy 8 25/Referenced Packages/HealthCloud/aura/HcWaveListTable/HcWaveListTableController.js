({
	doInit: function(component, event, helper) {
		component.set("v.showSpinner", true); 
    },
    
    handleSelectionEvent: function(component, event, helper) {
        var selectedItems = helper.getSelectedItems(component);
        if (!$A.util.isEmpty(selectedItems)){
            component.set("v.selected", selectedItems[0]);
        }
    }
})