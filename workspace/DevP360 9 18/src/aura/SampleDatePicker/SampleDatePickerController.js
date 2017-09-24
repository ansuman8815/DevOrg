({
	myAction : function(component, event, helper) {
        console.log('myfunction: ');
        console.log(document.getElementById("testId"));
        console.log($("#testId"));
		$("#testId").datepicker();
        //document.getElementById("testId").datepicker();
	}, 
    
    handleDatePickerClick : function(component, event, helper) {
        console.log ('handler')
		$("#testId").datepicker().datepicker("show");;
	}
})