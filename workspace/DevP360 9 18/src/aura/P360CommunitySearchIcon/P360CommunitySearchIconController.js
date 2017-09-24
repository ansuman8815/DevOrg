({
	doInit : function(component, event, helper) {
        var getUrlParameter = function getUrlParameter(sParam) {
            var sPageURL = decodeURIComponent(window.location.search.substring(1)),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;
            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : sParameterName[1];
                }
            }
        };
        
        component.set("v.fn", getUrlParameter('fn'));
        component.set("v.ln", getUrlParameter('ln'));
        component.set("v.cin", getUrlParameter('cin'));
        component.set("v.gn", getUrlParameter('gn'));
        component.set("v.dob", getUrlParameter('dob'));
        
        var toastEvent = $A.get("e.force:showToast");
        var fname 	= getUrlParameter('fn');       // console.log(fname);
        var lname 	= getUrlParameter('ln');		//console.log(lname);
        var gender 	= getUrlParameter('gn');
        var dob 	= getUrlParameter('dob');
        var cinNo 	= getUrlParameter('cin');
        
        // fields required
        if ((typeof cinNo == 'undefined' || cinNo == '' || cinNo == null) && 
            ((typeof fname == 'undefined' || fname == '' || fname == null) || 
             (typeof lname == 'undefined' || lname == '' || name == null))) {
        	toastEvent.setParams({
                 "type": "error",
				 "message": "Please enter First Name and Last Name or Medicaid ID.",
                 "mode" : "dismissible"
                });
            toastEvent.fire();
        }
        else if ((typeof fname != 'undefined' && fname != '' && fname.length > 0) || (typeof lname != 'undefined' && lname != '' && lname.length > 0)) {
            if((fname.length + lname.length) < 3)   { 
              toastEvent.setParams({
                     "type": "error",
                     "message": "To search by name, search criteria has to be specified in both First name and Last name fields, with a minimum of 3 characters in total.",
                     "mode" : "dismissible"
                    });
                    toastEvent.fire();
            }
            else {
                helper.getPatientSearchData(component);
            }
        }
        else {
        	helper.getPatientSearchData(component);
        }
    },
    
	handleApplicationEvent : function(component, event) {
        $A.createComponent(
            "c:P360CommunityMainPatientSearchResult",
            {
                "aura:id": "findableAuraId",
                "res": event.getParam("PatientResult"),
                "FName": event.getParam("FName"),
                "LName": event.getParam("LName"),
                "DOB":  event.getParam("DOB"),
                "Gender":  event.getParam("Gender"),
                "CIN":  event.getParam("CIN")
            },
            function(newData, status, errorMessage){
                if (status === "SUCCESS") { 
                    var body = component.get("v.body");
                    body = newData;
                    component.set("v.body", body);
                }
                else if (status === "INCOMPLETE") {
                    console.log("No response from server or client is offline.");
                }
                else if (status === "ERROR") {
                    console.log("Error: " + errorMessage);
                }
            });
    }
})