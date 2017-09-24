({
    onInit: function (component, event, helper) {
        //This is for single care plan context.
        if (component.get("v.expanded")) {
            helper.setExpandedTable(component.find('panelRow'), component);
            component.set("v.expandIconClass", "slds-hide");
        }
    },

    toggleIcon: function (component, event, helper) {
        helper.toggleIcon(component, event);    
    },
    
    expandCollapseCarePlans: function (component, event, helper) {
        if (event.getParam("allCarePlansTabId") === component.get("v.itemData").allCarePlansTabId) {
            helper.expandCollapseCarePlans(component, event);
        }
    }
})