({
    doInit: function(component, event, helper) {
        helper.getCarePlanDetailsByPatient(component, event, helper);
    },

    createPanel: function(component, event, helper) {
        helper.createPanel(component, event, helper);
    },
})