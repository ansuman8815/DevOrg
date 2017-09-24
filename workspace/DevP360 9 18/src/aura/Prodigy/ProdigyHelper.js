({    
    getPatientBannerData : function(component) {
        var action = component.get("c.getPatientBannerData");
        action.setParams({ 
            patientId : component.get("v.patientid")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                component.set("v.patientBannerData", response.getReturnValue());
             }
        });
        $A.enqueueAction(action);
	}
})