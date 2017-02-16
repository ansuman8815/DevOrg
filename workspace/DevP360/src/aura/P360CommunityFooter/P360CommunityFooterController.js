({
	doInit : function(component, event, helper) {
        var curyear = new Date().getFullYear();
        component.set("v.CurrentYear", curyear);
		
	}
})