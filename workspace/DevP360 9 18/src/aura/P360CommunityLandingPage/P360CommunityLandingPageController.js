({
	handleApplicationEvent : function(component, event) {
        component.set("v.search_clicked", event.getParam("Search_Clicked"));
        $A.createComponent(
            "c:P360CommunityMainPatientSearchResult",
            {
                "aura:id": "findableAuraId",
                "res": event.getParam("PatientResult"),
                "FName":event.getParam("FName"),
                "LName":event.getParam("LName"),
                "DOB":event.getParam("DOB"),
                "Gender":event.getParam("Gender"),
                "CIN":event.getParam("CIN")
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
    },

    
})