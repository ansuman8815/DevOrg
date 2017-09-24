({

    handleRemoveTemplateOnClick : function(component, event, helper) {
    	var index = event.getSource().get('v.name'); // Get the item index
        var selectedTemplateList = component.get("v.selectedTemplateList");
        var selectedTemplate = selectedTemplateList[index];
        
        var cmpEvent = component.getEvent("shoppingCartRemoveEvent");
        cmpEvent.setParams({"selectedTemplate" : selectedTemplate});
        cmpEvent.fire();
    }
   
})