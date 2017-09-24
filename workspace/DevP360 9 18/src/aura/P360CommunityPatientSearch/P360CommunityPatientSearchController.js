({
    doInit : function(cmp, event, helper) {
        var gender = cmp.find("agender").get("v.value");
        if(typeof gender == 'undefined' || gender == '' || gender == null){
            cmp.find("agender").set("v.value","");
           	$A.util.addClass(cmp.find("agender"), "placeholder");
        }
        if(cmp.get("v.isHeader") == 'false'){
            var action = cmp.get("c.updateUserSession");
            action.setParams({          
                currentPage : cmp.get("v.currentPage"),
                encounterId : cmp.get("v.encounterId")
            });
            action.setCallback(this, function(response)
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
             $A.enqueueAction(action);
        }
    },
    initDatePicker : function(component, event, helper) {
     
        $("#DOBId").datepicker({
            changeMonth: true,
            changeYear:true,
    		yearRange:"-100:+0", 
            showOtherMonths: true,
            selectOtherMonths: true,
        	monthNamesShort: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        });
    },
    handleDatePickerClick : function(component, event, helper) {
		$("#DOBId").datepicker().datepicker("show");
	},
    captureEnterCode : function(cmp, event, helper) {            
		if(event.keyCode === 13){
            if(document.getElementById("column1Div")){
                var cmpDiv1 = document.getElementById("column1Div");
                if(cmpDiv1.classList.contains("slds-backdrop") ){
                    $A.util.removeClass(cmpDiv1, 'slds-backdrop slds-backdrop--open');
                    var headerL = document.getElementById("headerL");    
                    $A.util.removeClass(headerL, 'slds-backdrop slds-backdrop--open');
                    $(".Logo ,.onlyDeskText,.onlyMobileText").css({ opacity: 1 });
                    $(".Logo").css({'pointer-events':'all','margin-top':'0px','padding-left':'0px'});
                    $(".onlyDeskText").css({'margin-top':'0px'});
                }
            }
            else if(document.getElementById("searchColl")){
                var searchColl1 = document.getElementById("searchColl");
                if(searchColl1.classList.contains("slds-backdrop") ){
                    $A.util.removeClass(searchColl1, 'slds-backdrop slds-backdrop--open');
                    var headerL = document.getElementById("headerL");    
                    $A.util.removeClass(headerL, 'slds-backdrop slds-backdrop--open');
                    $(".Logo ,.onlyDeskText,.onlyMobileText").css({ opacity: 1 });
                    $(".Logo").css({'pointer-events':'all','margin-top':'0px','padding-left':'0px'});
                    $(".onlyDeskText").css({'margin-top':'0px'});
                }
            }
			if( navigator.userAgent.toLowerCase().indexOf('firefox') > -1 || navigator.userAgent.toLowerCase().indexOf('chrome') > -1 || navigator.userAgent.toLowerCase().indexOf("safari") > -1 ){
                $("#patientSearchDiv").click();
                helper.searchHelperMethod(cmp, event, helper);
			}
			else{
				$(".ButtonSearch ").focus(); 
                $(".ButtonSearch ").click();
           }
            
        }
    },
    searchClick : function(cmp1, event, helper) { 
        if(document.getElementById("column1Div")){
            var cmpDiv1 = document.getElementById("column1Div");
            if(cmpDiv1.classList.contains("slds-backdrop") ){ 
                $A.util.removeClass(cmpDiv1, 'slds-backdrop slds-backdrop--open');
                var headerL = document.getElementById("headerL");    
                $A.util.removeClass(headerL, 'slds-backdrop slds-backdrop--open');
                $(".Logo ,.onlyDeskText,.onlyMobileText").css({ opacity: 1 });
                $(".Logo").css({'pointer-events':'all','margin-top':'0px','padding-left':'0px'});
                $(".onlyDeskText").css({'margin-top':'0px'});
            }
        }
        else if(document.getElementById("searchColl")){
                var searchColl1 = document.getElementById("searchColl");
                if(searchColl1.classList.contains("slds-backdrop") ){
                    $A.util.removeClass(searchColl1, 'slds-backdrop slds-backdrop--open');
                    var headerL = document.getElementById("headerL");    
                    $A.util.removeClass(headerL, 'slds-backdrop slds-backdrop--open');
                    $(".Logo ,.onlyDeskText,.onlyMobileText").css({ opacity: 1 });
                    $(".Logo").css({'pointer-events':'all','margin-top':'0px','padding-left':'0px'});
                    $(".onlyDeskText").css({'margin-top':'0px'});
                }
            }
        helper.searchHelperMethod(cmp1, event, helper); 
        
        
    },
    clearOnClick : function(cmp, event, helper) {
        cmp.find("afirstName").set("v.value", "");
        cmp.find("alastName").set("v.value", "");
        cmp.find("agender").set("v.value", "");
        cmp.find("acin").set("v.value", "");
        $A.util.addClass(cmp.find("agender"), "placeholder");
        $("#DOBId").val("");
    },
    onSelectChange : function(cmp, event, helper) {
        $("#DOBId").datepicker().datepicker("hide");
        var gender = cmp.find("agender").get("v.value");
        if(typeof gender == 'undefined' || gender == '' || gender == null){
            cmp.find("agender").set("v.value","");
            $A.util.addClass(cmp.find("agender"), "placeholder");
        }
        else
            $A.util.removeClass(cmp.find("agender"), "placeholder");
    },
    closePatSearch : function(cmp, event, helper) {
        var headerL = document.getElementById("headerL");    
        $A.util.removeClass(headerL, 'slds-backdrop slds-backdrop--open');
        $(".Logo ,.onlyDeskText,.onlyMobileText").css({ opacity: 1 });
        $(".Logo").css({'pointer-events':'all','margin-top':'0px','padding-left':'0px'});
        $(".onlyDeskText").css({'margin-top':'0px'});
        if(document.getElementById("column1Div")){
        	var cmpDiv1 = document.getElementById("column1Div");    
        	$A.util.removeClass(cmpDiv1, 'slds-backdrop slds-backdrop--open');
        }
        if(document.getElementById("searchColl")){
        	var searchColl = document.getElementById("searchColl");    
        	$A.util.removeClass(searchColl, 'slds-backdrop slds-backdrop--open');
        }
        if(document.getElementById("searchLinkDiv"))
        	document.getElementById("searchLinkDiv").style.display = "none";
        if(document.getElementById("searchLinkDiv1"))
        	document.getElementById("searchLinkDiv1").style.display = "none";
    }
})