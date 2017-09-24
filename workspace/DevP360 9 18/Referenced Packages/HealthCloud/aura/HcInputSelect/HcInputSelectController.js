({
    changeHandler : function(component, event, helper) {
        var event = component.getEvent('selectChange');
        event.fire();
    }
})