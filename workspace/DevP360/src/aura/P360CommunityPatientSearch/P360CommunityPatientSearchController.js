({
    searchClick : function(cmp, event, helper) {
        console.log('M inside search');
        var fname 	= cmp.find("afirstName").get("v.value");
        var lname 	= cmp.find("alastName").get("v.value");
        var gender 	= cmp.find("agender").get("v.value");
        var dob 	= cmp.find("adateofbirth").get("v.value");
        var cinNo 	= cmp.find("acin").get("v.value");
        var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1;
        if(mm<10) { mm='0'+mm } 
		var yy = today.getFullYear();
        var dateVal = yy+'-'+mm+'-'+dd;
        console.log(dateVal);
        console.log(dob);
        cmp.set("v.errorMessage", '');
        
        // fields required
        if ((typeof cinNo == 'undefined' || cinNo == '' || cinNo == null) && 
            ((typeof fname == 'undefined' || fname == '' || fname == null) || 
             (typeof lname == 'undefined' || lname == '' || name == null))) {
            cmp.set("v.errorMessage", "Enter First Name & Last Name (OR) CIN Number to search for a Patient");
        }
        else if ((fname != '' || lname != '') && (dob != null)) {
            console.log('Enterrrrr');
            if ((typeof fname != 'undefined' && fname.length < 3) || (typeof lname != 'undefined' && lname.length < 3)) {
            	cmp.set("v.errorMessage", "Enter minimum of 3 characters for First Name and Last Name");
            }
            if(dob != '' && dob > dateVal){
                console.log(dob);
                cmp.set("v.errorMessage", "Date of Birth cannot be in future");
            }
        } 
        else {
            cmp.set("v.errorMessage", '');
            cmp.find("afirstName").set("v.errors", '');
            cmp.find("alastName").set("v.errors", '');
            cmp.find("agender").set("v.errors", '');
            cmp.find("adateofbirth").set("v.errors", '');
            cmp.find("acin").set("v.errors", '');
        	helper.getPatientSearchData(cmp);
        }
    },
    clearOnClick : function(cmp, event, helper) {
        cmp.find("afirstName").set("v.value", '');
        cmp.find("alastName").set("v.value", '');
        cmp.find("agender").set("v.value", '');
        cmp.find("adateofbirth").set("v.value", '');
        cmp.find("acin").set("v.value", '');
    }
})