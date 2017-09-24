({
	sideBarHelperMethod : function(component) {
        if( document.getElementById("ClinicalSummary") != null)
        	document.getElementById("ClinicalSummary").classList.remove('active');
        if( document.getElementById("SocialSummary") != null)
        	document.getElementById("SocialSummary").classList.remove('active');
        if( document.getElementById("EncounterSummary") != null)
        	document.getElementById("EncounterSummary").classList.remove('active');
        if( document.getElementById("Demographics") != null)
        	document.getElementById("Demographics").classList.remove('active');
        if( document.getElementById("DiagnosticReports") != null)
        	document.getElementById("DiagnosticReports").classList.remove('active');
        if( document.getElementById("LaboratoryResults") != null)
        	document.getElementById("LaboratoryResults").classList.remove('active');
        if( document.getElementById("Populations") != null)
        	document.getElementById("Populations").classList.remove('active');
        if( document.getElementById("ClinicalNotes") != null)
        	document.getElementById("ClinicalNotes").classList.remove('active');
	},
    setSession : function(component) {
    	var sessionAction = component.get("c.updateUserSession");
        sessionAction.setParams({          
            currentPage : component.get("v.currentPage"),
            encounterId : component.get("v.encounterId")
        });
        sessionAction.setCallback(this, function(response)
        {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var res = response.getReturnValue();
            }
            else
            {
                console.log('Error');
            }
        });
        $A.enqueueAction(sessionAction);
    },
    logHIPAAAuditHelperMethod : function(component, event, helper) {
        var action =component.get("c.logHIPAAAudit");
        action.setParams({"empi":component.get("v.empi"),
                          "hc_DataComponent":component.get("v.currentPage")});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
            }
        });
        $A.enqueueAction(action);
    }
})