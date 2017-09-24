({
    getPatientData : function(component, event, helper, patId) {
        var actiongetPatientData = component.get("c.getPatientData");
        actiongetPatientData.setParams({"patientId":patId});        
        actiongetPatientData.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var res = response.getReturnValue();
                component.set("v.patientData", res);
            }
        });
        $A.enqueueAction(actiongetPatientData);
    }
    
})