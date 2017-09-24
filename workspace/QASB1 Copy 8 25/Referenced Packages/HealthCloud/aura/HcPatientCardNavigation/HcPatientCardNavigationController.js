({
    init: function(component, event, helper) {
        helper.getProfileCardViews(component);
    },

    selectMenuItem: function(component, event, helper) {
        var selVal = $A.getComponent(event.getSource().getGlobalId()).get("v.label");
        helper.processSelectedDropValue(component, selVal);
    }
})