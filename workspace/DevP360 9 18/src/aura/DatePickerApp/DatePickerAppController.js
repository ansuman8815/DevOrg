({
	myAction : function(component, event, helper) {
        console.log('myfunction: ');
        console.log(document.getElementById("test"));
		$("#test").datepicker();
        document.getElementById("test").datepicker();
	}
})