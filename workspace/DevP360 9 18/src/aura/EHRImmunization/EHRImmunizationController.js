({
    doInit : function(component, event) {
        var action = component.get("c.findImmunizationByPatientId");
        var patientId = component.get("v.patientId");
        action.setParams({
            patientId : patientId,
            recordLimit : component.get("v.recordLimit")
        });
        
        action.setCallback(this, function(a) {
            component.set("v.EHRImmunization", a.getReturnValue());
        });
        $A.enqueueAction(action);
    }
})