({
	clearInputField : function(component, event, helper) {
        console.log("CLEAR");
        var searchTarget = component.find('searchText');
        console.log(searchTarget);
        component.set("searchTarget", '');
    },// Your renderer method overrides go here
})