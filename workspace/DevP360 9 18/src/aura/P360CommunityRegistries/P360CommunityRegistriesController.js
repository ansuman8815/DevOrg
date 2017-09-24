({
	doInit : function(component, event, helper) {
        var opts ="<option value=" + '' + ">" + '' + "</option>";
        
        var action = component.get("c.getRegistry");
        action.setCallback(this, function(data) {
            var obj = JSON.parse(JSON.stringify(data.getReturnValue()));
            for(var key in obj) {
            	opts += "<option value=" + key  + ">" +obj[key] + "</option>"
        	}
            document.getElementById("registryId").innerHTML = opts;
            console.log(opts);
        });
        $A.enqueueAction(action);
	},
    selectChange : function(component, event, helper) {
        var registry = document.getElementById("registryId").value ;
        var thisId = registry;
       	var toastEvent = $A.get("e.force:showToast");
        var registryEvent = $A.get("e.c:PatientRegistryEvent");
        if(thisId == ''){
        	toastEvent.setParams({
                     "type": "error",
                     "message": "Please select valid Registry",
                     "mode" : "dismissible"
                    });
                    toastEvent.fire();
            $A.get('e.force:refreshView').fire();
            
        }
        else {
            registryEvent.setParams({ "registry" : thisId });
            registryEvent.setParams({ "listName" : "Patient Registries" });
            registryEvent.setParams({ "tableName" : "table_registry" });
            registryEvent.setParams({ "dropdownChanged" : true });
            registryEvent.fire();
            var patRegCont = document.getElementById("patRegContDiv");  
            $A.util.removeClass(patRegCont, 'patRegContent'); 
            $A.util.addClass(patRegCont, 'patRegResult'); 
            var listContent = document.getElementById("listId");
            $A.util.removeClass(searchBtn, 'listCSS'); 
            $A.util.addClass(listContent, 'listResult'); 
            var searchBtn = document.getElementById("searchIcon");  
            $A.util.removeClass(searchBtn, 'searchIconStyle'); 
            $A.util.addClass(searchBtn, 'listResultSearch');
            document.getElementById("regDisclaimer").style.display = "none";  
        }
    }
    
})