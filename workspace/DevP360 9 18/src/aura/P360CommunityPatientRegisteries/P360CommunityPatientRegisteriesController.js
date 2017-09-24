({
    doInit : function(component, event, helper) {
        helper.setSession (component);
        
	},
    handleRegistry : function(component, event, helper) {
        var whereclause = event.getParam("registry");
        var dropdownChanged = event.getParam("dropdownChanged");
        component.set("v.whereclause",whereclause);
        component.set("v.currentPage", 'Specific registry page');
        helper.setSession (component);
        $A.createComponent(
            "c:P360RegistryDynamicList",
            {
                "whereclause": whereclause
            },
            function(newData, status, errorMessage){
                if (status === "SUCCESS") { 
                    var body = component.get("v.body");
                    body = newData;
                    component.set("v.body", body);
                }
                else if (status === "INCOMPLETE") {
                    console.log("No response from server or client is offline.");
                }
                else if (status === "ERROR") {
                    console.log("Error: " + errorMessage);
                }
            });
    }
    
})