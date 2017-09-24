({
    getPatientSearchData : function(component) {
        var spinner = component.find('spinner');
        var action 	= component.get("c.getSearchPatientData");
        var fname 	= component.find("afirstName").get("v.value");
        var lname 	= component.find("alastName").get("v.value");
        var gender 	= component.find("agender").get("v.value");
        var dob 	= $("#DOBId").val();
       	$A.util.removeClass(spinner, 'hideEl');
        $A.util.addClass(spinner, 'showEl');
        
        var cinNo 	= component.find("acin").get("v.value");
        if(typeof fname != 'undefined')
            fname = fname.trim();
        if(typeof lname != 'undefined')
        	lname = lname.trim();
        
        action.setParams({ 
            firstName : component.find("afirstName").get("v.value"),            
            lastName : component.find("alastName").get("v.value"),
            gender : component.find("agender").get("v.value"),
            cinNo : component.find("acin").get("v.value"),
    
            dob : $("#DOBId").val()
           
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
                     "message": "Invalid Date: Please provide valid date in MM/DD/YYYY format.",
                     "mode" : "dismissible"
                    });
                    toastEvent.fire();
                }
                else console.log("Unknown error");
            }              
        });
         $A.enqueueAction(action);
	},
    ToggleCollapseHandler : function(component, event) {  
        var existingText = component.get("v.collpaseText"); 
        var container = component.find("containerCollapsable") ;
        if(existingText === "Collapse [ - ]"){
            component.set("v.collpaseText","Expand [ + ]");
            var patientSearchResult = document.getElementById("patientSearchResult")
            $A.util.removeClass(patientSearchResult, 'PatientResultStart');
            document.getElementById("ExpandMenu").style.boxShadow = "0 0px 5px rgba(0, 0, 0, 0.3)";
            document.getElementById("collapseMenu").style.boxShadow = "none "; 
            $A.util.addClass(container, 'hide');
        }else{
            component.set("v.collpaseText","Collapse [ - ]");
            var patientSearchResult = document.getElementById("patientSearchResult")
            $A.util.addClass(patientSearchResult, 'PatientResultStart');
            $A.util.removeClass(container, 'hide'); 
            document.getElementById("ExpandMenu").style.boxShadow = "0 -4px 9px -5px rgba(0, 0, 0, 0.3)";
            document.getElementById("collapseMenu").style.boxShadow = "0 4px 10px -2px rgba(0, 0, 0, 0.3) ";
        }  
	},
    searchHelperMethod : function(cmp , event, helper) {
        var isHeader = cmp.get("v.isHeader");
        var pathname;
        var toastEvent = $A.get("e.force:showToast");
        var fname 	= cmp.find("afirstName").get("v.value");
        var lname 	= cmp.find("alastName").get("v.value");
        var gender 	= cmp.find("agender").get("v.value");
        var dob 	= $("#DOBId").val();
        var cinNo 	= cmp.find("acin").get("v.value");
        var lengthVal = 0;
        if(typeof fname != 'undefined'){
            fname = fname.trim();
            lengthVal += fname.length;
    	}
        if(typeof lname != 'undefined'){
        	lname = lname.trim();
            lengthVal += lname.length;
        }
        // fields required
        if (((typeof cinNo == 'undefined' || cinNo == '' || cinNo == null) || 
             (typeof fname == 'undefined' || fname == '' || fname == null) || 
             (typeof lname == 'undefined' || lname == '' || name == null))
            && 
            ((typeof dob == 'undefined' || dob == '' || dob == null)|| 
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
            if(lengthVal < 3)   {
                toastEvent.setParams({
                     "type": "error",
                     "message": "To search by name, search criteria has to be specified in both First name and Last name fields, with a minimum of 3 characters in total.",
                     "mode" : "dismissible"
                    });
                    toastEvent.fire();
            }
            else {
                if(window.location.pathname.indexOf('patientsearch') != -1)
                    pathname = window.location.pathname.split('patientsearch')[0];
                else
                    pathname = window.location.pathname;
                    window.history.replaceState(null, null, pathname);
                	helper.getPatientSearchData(cmp);
            }
        }
        else {
            if(window.location.pathname.indexOf('patientsearch') != -1)
                pathname = window.location.pathname.split('patientsearch')[0];
            else
                pathname = window.location.pathname;
            	window.history.replaceState(null, null, pathname);
            	helper.getPatientSearchData(cmp);
        }
	}
})