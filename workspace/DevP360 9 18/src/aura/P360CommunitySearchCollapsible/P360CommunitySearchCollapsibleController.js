({
    doInit : function(cmp, event, helper) {
        var gender = cmp.find("agender").get("v.value");
        var selectedGender = cmp.get("v.Gender");
        if(selectedGender != null && selectedGender !='')
        {
            cmp.find("agender").set("v.value",selectedGender);
        }
        else if((typeof selectedGender == 'undefined' || selectedGender == '' || selectedGender == null) && (typeof gender == 'undefined' || gender == '' || gender == null)){
            cmp.find("agender").set("v.value","");
            $A.util.addClass(cmp.find("agender"), "placeholder");
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
        //$(component.find("adateofbirth").getElement()).attr('placeholder' , 'test dob');
    },
    handleDatePickerClick : function(component, event, helper) {
        setTimeout(function() {
            $(".Inputs2Column.hasDatepicker").focus();
        }, 100);
		$("#DOBId").datepicker().datepicker("show");
	},
    captureEnterCode : function(cmp, event, helper) {
		if (event.keyCode == 13) { 	
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
	searchClick : function(cmp, event, helper) {
        helper.searchHelperMethod(cmp, event, helper);
    },
    clearOnClick : function(cmp, event, helper) {
        cmp.find("afirstName").set("v.value", "");
        cmp.find("alastName").set("v.value", "");
        cmp.find("agender").set("v.value", "");
        cmp.find("acin").set("v.value", "");
        $A.util.addClass(cmp.find("agender"), "placeholder");
        //cmp.find("adateofbirth").set("v.value", "");
        $("#DOBId").val("");
        //document.getElementById("dobPlaceholder").innerHTML = " DOB (MM/DD/YYYY)";
    },
    ToggleCollapse : function(component, event, helper) { 
		helper.ToggleCollapseHandler(component, event);
	},
    onSelectChange : function(cmp, event, helper) {
        var gender = cmp.find("agender").get("v.value");
      
        if(typeof gender == 'undefined' || gender == '' || gender == null){
            cmp.find("agender").set("v.value","");
           	$A.util.addClass(cmp.find("agender"), "placeholder");
        }
        else
            $A.util.removeClass(cmp.find("agender"), "placeholder");
    }
})