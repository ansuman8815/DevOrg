({
    handleDynamicList : function(component, event, helper) {
        
        var listName = event.getParam("listName");
        var tableName = event.getParam("tableName");
        var pageName = event.getParam("pageName");
        var dropdownChanged = event.getParam("dropdownChange");
        component.set("v.dropdownChanged",true);
        var whereclause = component.get("v.whereclause");
        var patientid = component.get("v.patientid");
        component.set("v.listName", listName);
        component.set("v.tableName", tableName);
        $A.createComponent(
            "c:P360CommunityDynamicList",
             {
              	"patientid":patientid,
                "empi" : component.get("v.empi"),
              	"whereclause":whereclause,
                "tableName": tableName,
                "listName": listName,
                "pageName": pageName
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