({
	loadSobjects : function(component) {
        var action = component.get("c.dynfetchRecords");
        action.setParams({ strQuery : component.get("v.strQuery"),
                          whereQuery : component.get("v.whereQuery"),
                         lstFielddatatype : component.get("v.lstFielddatatype"),
                         patientId : component.get("v.patientId"),
                         recordLimit : component.get("v.recordLimit")
                         });
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.log(state);
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
            console.log(result.lstSobject);
            console.log(result.lstFieldApi);
				component.set("v.lstSobject", result.lstSobject);
                component.set("v.lstFieldApi", result.lstFieldApi);
               // setTimeout(function(){ $('#example').DataTable(); }, 500);
            }
            else if (state === "ERROR") {
                $A.log("Errors", a.getError());
            }
        });
        $A.enqueueAction(action);
	}
})