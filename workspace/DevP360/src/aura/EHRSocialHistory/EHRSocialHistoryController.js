({
    doInit : function(component, event) {
        var action = component.get("c.findByPatientId");
        var patientId = component.get("v.patientId");
        action.setParams({
        	patientId : patientId
    	});

        action.setCallback(this, function(a) {
            component.set("v.EHRSocialHistory", a.getReturnValue());
        });
        $A.enqueueAction(action);
    }
})