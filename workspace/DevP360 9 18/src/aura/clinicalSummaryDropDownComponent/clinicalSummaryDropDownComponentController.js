({
	 selectChange : function(component, event, helper) {
        
       var selected = component.find("sel").get("v.value");
        
       component.set("v.SelectedOption", selected);
        
         //var evntVar = component.getevent("Ltng_DropDown_Toggle_Event");
        var evntVar = $A.get("e.c:clinicalSummaryDropDownEvent");
        evntVar.setParams({"SelOp":selected});
        evntVar.fire();
     }
})