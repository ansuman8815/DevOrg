({
	getPatientSearchData : function(component) {
        var spinner = component.find('spinner');
        var action = component.get("c.getSearchPatientData");
        var fname 	= component.find("afirstName").get("v.value");
        var lname 	= component.find("alastName").get("v.value");
        var gender 	= component.find("agender").get("v.value");
        var dob 	= $("#DOBId").val();
        var cinNo 	= component.find("acin").get("v.value");
        $A.util.removeClass(spinner, 'hideEl');
        $A.util.addClass(spinner, 'showEl');
        if(typeof fname != 'undefined')
            fname = fname.trim();
        if(typeof lname != 'undefined')
        	lname = lname.trim();
        action.setParams({ 
            firstName : fname,            
            lastName : lname,
            gender : gender,
            cinNo : cinNo,
            dob : dob
        });
         // Create a callback that is executed after the server-side action returns
   
        action.setCallback(this, function(response)
        {
            var state = response.getState();
        	var toastEvent = $A.get("e.force:showToast");
            $A.util.removeClass(spinner, 'showEl');
            $A.util.addClass(spinner, 'hideEl');
            if (state === "SUCCESS")
            {
                var res = response.getReturnValue();
                if(res.length > 0){
                    var evt = $A.get("e.c:SearchResult");
                    evt.setParams({ "PatientResult": res});
                    evt.setParams({ "Search_Clicked": true});
                    evt.setParams({"FName": fname});
                    evt.setParams({"LName": lname});
                    evt.setParams({"DOB": dob});
                    evt.setParams({"Gender": gender});
                    evt.setParams({"CIN": cinNo});
                    evt.fire();
                } 
                else{
                    toastEvent.setParams({
                     "type": "info",
                     "message": "No patients were found matching the search criteria. Please refine your search and try again.",
                     "mode" : "dismissible"
                    });
                    toastEvent.fire();
                }
            }
            else if (state === "INCOMPLETE") {
                console.log('event Incomplete');
            }
            else if (state === "ERROR") 
            {
                var errors = response.getError();
               
                if (errors && errors[0] && errors[0].message)  {
                    console.log("Error message: " + errors[0].message);
                    toastEvent.setParams({
                     "type": "error",
                     "message":"Invalid Date: Please provide valid date in MM/DD/YYYY format.",
                     "mode" : "dismissible"
                    });
                    toastEvent.fire();
                }
                else console.log("Unknown error");
            }              
        }); 
         $A.enqueueAction(action);
	},
	getPatientSearchDataCount : function(component) {
        var action = component.get("c.getSearchAccountDataCount");
        var urlEvent;
        var toastEvent = $A.get("e.force:showToast");
        var fname = component.find("afirstName").get("v.value");
        var lname = component.find("alastName").get("v.value");
        var gender 	= component.find("agender").get("v.value");
        var dob 	= $("#DOBId").val();
        var cinNo 	= component.find("acin").get("v.value");
        action.setParams({ 
            firstName : fname,            
            lastName : lname,
            gender : gender,
            cinNo : cinNo,
            dob : dob
        });
         // Create a callback that is executed after the server-side action returns
        action.setCallback(this, function(response)
        {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var res = response.getReturnValue();
                if(res > 0){
                    var urlParam = '';
                    if(typeof fname != 'undefined' && fname != '')
                        urlParam = "fn="+fname;
                    if(typeof lname != 'undefined' && lname != ''){
                        if(urlParam !='') urlParam += "&ln="+lname;
                    	else urlParam = "ln="+lname;
                    }
                    if(typeof cinNo != 'undefined' && cinNo != ''){
                        if(urlParam !='') urlParam += "&cin="+cinNo;
                    	else urlParam = "cin="+cinNo;
                    }
                        
                    if(typeof gender != 'undefined' && gender != ''){
                        if(urlParam !='') urlParam += "&gn="+gender;
                    	else urlParam = "gn="+gender;
                    }
                        
                    if(typeof dob != 'undefined' && dob != null && dob != ''){
                        if(urlParam !='') urlParam += "&dob="+dob;
                    	else urlParam = "dob="+dob;
                    }
                        
                    urlEvent = $A.get("e.force:navigateToURL");
                    urlEvent.setParams({
                        "url": "/patientsearch?"+urlParam
                    });
                    urlEvent.fire();
            	}
                else{
                    toastEvent.setParams({
                     "type": "info",
                     "message": "No patients were found matching the search criteria. Please refine your search and try again.",
                     "mode" : "dismissible"
                    });
                    toastEvent.fire();
                }
            }
            else if (state === "INCOMPLETE") {
                console.log('event Incomplete');
            }
            else if (state === "ERROR") 
            {
                var errors = response.getError();
                if (errors && errors[0] && errors[0].message)  {
                    toastEvent.setParams({
                    "type": "error",
                    "message":"Invalid Date: Please provide valid date in MM/DD/YYYY format.",
                    "mode" : "dismissible"
                    });
                    toastEvent.fire();
                }
                else console.log("Unknown error");
            }              
        });
         $A.enqueueAction(action);
	},
    searchHelperMethod : function(cmp1 , event, helper) {
        var isHeader = cmp1.get("v.isHeader");
        var toastEvent = $A.get("e.force:showToast");
        var fname 	= cmp1.find("afirstName").get("v.value");
        var lname 	= cmp1.find("alastName").get("v.value");
        var gender 	= cmp1.find("agender").get("v.value");
        var dob 	= $("#DOBId").val();
        var cinNo 	= cmp1.find("acin").get("v.value");
        var lengthVal = 0;
        if(typeof fname != 'undefined'){
            fname = fname.trim();
            lengthVal += fname.length;
    	}
        if(typeof lname != 'undefined'){
        	lname = lname.trim();
            lengthVal += lname.length;
        }
        if (((typeof cinNo == 'undefined' || cinNo == '' || cinNo == null) ||
             (typeof fname == 'undefined' || fname == '' || fname == null) || 
             (typeof lname == 'undefined' || lname == '' || name == null))
             && 
            ((typeof dob == 'undefined' || dob == '' || dob == null) ||
             (typeof fname == 'undefined' || fname == '' || fname == null) || 
             (typeof lname == 'undefined' || lname == '' || name == null))) {
        	toastEvent.setParams({
                 "type": "error",
				 "message": "Please enter First Name and Last Name along with CIN or DOB",
                 "mode" : "dismissible"
                });
            toastEvent.fire();
        }
        else if ((typeof fname != 'undefined' && fname != '' && fname.length > 0) || (typeof lname != 'undefined' && lname != '' && lname.length > 0)) {
            if(lengthVal < 3){
              	toastEvent.setParams({
                     "type": "error",
                     "message": "To search by name, search criteria has to be specified in both First name and Last name fields, with a minimum of 3 characters in total.",
                     "mode" : "dismissible"
                    });
              	toastEvent.fire();
            }
            else if(isHeader == "false"){
                helper.getPatientSearchData(cmp1);
            }
            else{
                helper.getPatientSearchDataCount(cmp1);
            }
        }
        else if(isHeader == "false"){
            helper.getPatientSearchData(cmp1);
        }
        else
        	helper.getPatientSearchDataCount(cmp1);
        if(document.getElementById("searchLinkDiv"))
        	document.getElementById("searchLinkDiv").style.display = "none";
        else
            document.getElementById("searchLinkDiv1").style.display = "none";
    }
})