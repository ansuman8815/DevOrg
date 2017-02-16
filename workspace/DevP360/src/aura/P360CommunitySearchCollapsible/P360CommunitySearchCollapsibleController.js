({
	searchClick : function(cmp, event, helper) {
        console.log('Search..');
        /*
        var evt = $A.get("e.force:navigateToURL");
        evt.setParams({
             "url": "/patientSearchResult"
        });
        evt.fire()*/
    },
    clearOnClick : function(cmp, event, helper) {
        console.log('Clear..');
        cmp.find("afirstName").set("v.value", null);
        cmp.find("alastName").set("v.value", null);
        cmp.find("agender").set("v.value", null);
        cmp.find("adateofbirth").set("v.value", null);
        cmp.find("acin").set("v.value", null);
    },
    ToggleCollapse : function(component, event, helper) { 
		helper.ToggleCollapseHandler(component, event);
	}
})