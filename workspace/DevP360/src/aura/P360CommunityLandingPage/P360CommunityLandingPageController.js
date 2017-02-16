({
	handleApplicationEvent : function(component, event) {
      	console.log('ResultValue in landing page');
        component.set("v.search_clicked", event.getParam("Search_Clicked"));
        
        $A.createComponent(
            "c:P360CommunityMainPatientSearchResult",
            {
                "aura:id": "findableAuraId",
                "res": event.getParam("Show_Result")
            },
            function(newData, status, errorMessage){
                if (status === "SUCCESS") { 
                    var body = component.get("v.body");
                    body.push(newData);
                    component.set("v.body", body);
                }
                else if (status === "INCOMPLETE") {
                    console.log("No response from server or client is offline.");
                    // Show offline error
                }
                else if (status === "ERROR") {
                    console.log("Error: " + errorMessage);
                    // Show error message
                }
            }
        );
    }
})