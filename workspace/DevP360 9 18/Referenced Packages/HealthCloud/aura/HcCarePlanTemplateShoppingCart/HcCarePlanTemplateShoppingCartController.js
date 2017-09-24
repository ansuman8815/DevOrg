({

    handleRemoveTemplateOnClick : function(component, event, helper) {
        var selectedItem = event.currentTarget; // Get the target object
        var index = selectedItem.dataset.record; // Get its value i.e. the index
        var selectedTemplateList = component.get("v.selectedTemplateList");
        var selectedTemplate = selectedTemplateList[index];
        
        var cmpEvent = component.getEvent("shoppingCartRemoveEvent");
        cmpEvent.setParams({"selectedTemplate" : selectedTemplate});
        cmpEvent.fire();
    }
   
})