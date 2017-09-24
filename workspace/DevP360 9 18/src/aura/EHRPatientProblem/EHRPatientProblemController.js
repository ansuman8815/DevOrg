({
    doInit : function(component, event) {
        var action = component.get("c.findProblemsByPatientId");
        var patientId = component.get("v.patientId");
        action.setParams({
            patientId : patientId,
            recordLimit : component.get("v.recordLimit")
        });
        
        action.setCallback(this, function(a) {
            component.set("v.EHRCondition", a.getReturnValue());
        });
        $A.enqueueAction(action);
    }
})