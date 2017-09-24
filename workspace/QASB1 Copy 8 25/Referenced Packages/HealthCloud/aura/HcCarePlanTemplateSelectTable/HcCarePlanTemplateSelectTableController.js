({
	onInit : function(component, event, helper) { 
    }, 

    handleSelectionEvent: function(component, event, helper) {
        
        var selectionEvent = component.get("v.selectionEvent");
        var eventType = selectionEvent.getParam('eventType');
        var eventSubType = selectionEvent.getParam('eventSubType');
    	
    	var selected = false;
    	var selectedTemplate = selectionEvent.getParams("data");
        if(eventSubType === 'MULTI_SELECT'){
        	selected = true;
        } else {
        	selected = false;
        }
        
        if (typeof selected === "undefined") {
            return;
        }
        var cmpEvent;
        if (selected) {
            cmpEvent = component.getEvent("selectTemplateAddEvent");
        } else {
            cmpEvent = component.getEvent("selectTemplateRemoveEvent");
        }
        cmpEvent.setParams({"selectedTemplate" : selectedTemplate});
        cmpEvent.fire();
    }, 

    handleSearchChange: function(component, event, helper) {
        component.set("v.showSpinner",true);
    	helper.getInitialData(component, event, helper);
    }
})