({
	getPatientName : function(component) {
        var action = component.get("c.getPatientName");
        action.setParams({ 
            patientId : component.get("v.patientid")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                component.set("v.result", response.getReturnValue());
             }
        });
        $A.enqueueAction(action);
	},
    getPatientDob : function(component) {
        var action = component.get("c.getPatientDob");
        action.setParams({ 
            patientId : component.get("v.patientid")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                component.set("v.dob", response.getReturnValue());
             }
        });
        $A.enqueueAction(action);
	}
})