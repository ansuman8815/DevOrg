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
    /*
    ,
    viewAll : function(component) {
        var patientId = component.get("v.patientId");
        sforce.console.getEnclosingPrimaryTabId(function(result) {
      		sforce.console.openSubtab(result.id, '/apex/EHRImmunization?patientId='+patientId , true, 'Immunization', null);
    	});
    }
    */
})