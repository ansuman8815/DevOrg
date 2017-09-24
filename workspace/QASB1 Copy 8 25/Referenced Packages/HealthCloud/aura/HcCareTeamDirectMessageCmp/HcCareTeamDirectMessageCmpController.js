({
    init: function(component, event, helper) {
    },

    sendMessage: function(component, event, helper) {
        if(!helper.messageValidation(component)){
            component.set('v.isMessageValid', false);
            return;
        }
        helper.resetValidation(component);
        component.set('v.messageToSend', component.find("message").getElement().value.trim());
        helper.sendMessage(component, event, helper);
    },

    handleKeyPress: function(component, event, helper) {
        helper.resetValidation(component);
    }
})