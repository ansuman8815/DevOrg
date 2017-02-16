({
    searchClick : function(cmp, event, helper) {
        var fname 	= cmp.find("afirstName").get("v.value");
        var lname 	= cmp.find("alastName").get("v.value");
        var gender 	= cmp.find("agender").get("v.value");
        var dob 	= cmp.find("adateofbirth").get("v.value");
        var cinNo 	= cmp.find("acin").get("v.value");
        // fields required
        if ((typeof cinNo == 'undefined' || cinNo == '' || cinNo == null) && 
            ((typeof fname == 'undefined' || fname == '' || fname == null) || 
             (typeof lname == 'undefined' || lname == '' || name == null))) {
            //console.log('If loop');
            cmp.set("v.errorMessage", "Enter First Name & Last Name (OR) CIN Number to search for a Patient");
        } else {
            //console.log('Else loop');
            cmp.set("v.errorMessage", null);
            cmp.find("afirstName").set("v.errors", null);
            cmp.find("alastName").set("v.errors", null);
            cmp.find("agender").set("v.errors", null);
            cmp.find("adateofbirth").set("v.errors", null);
            cmp.find("acin").set("v.errors", null);
        	helper.getPatientSearchData(cmp);
        }
    },
    clearOnClick : function(cmp, event, helper) {
        cmp.find("afirstName").set("v.value", null);
        cmp.find("alastName").set("v.value", null);
        cmp.find("agender").set("v.value", null);
        cmp.find("adateofbirth").set("v.value", null);
        cmp.find("acin").set("v.value", null);
    },
    getGenderVal : function(cmp,event, helper){
		var picklistValue = cmp.find("agender").get("v.value");
	}
})