({
    doInit : function(component, event, helper) {
        helper.loadSobjects(component);
    },
    
    handleEvent2 : function(component, event, helper) {
        
        var strQuery = event.getParam("strQuery");
        var whereQuery = event.getParam("whereQuery");
        var lstFieldLabel = event.getParam("lstFieldLabel");
        var headerLabel = event.getParam("headerLabel");
        var pageName = event.getParam("pageName");
        
        component.set("v.strQuery", strQuery);
        component.set("v.whereQuery", whereQuery);
        component.set("v.lstFieldLabel", lstFieldLabel);
        component.set("v.headerLabel", headerLabel);
        component.set("v.pageName", pageName);
        
        helper.loadSobjects(component);
    },
    
    viewAll : function(component) {
        var patientId = component.get("v.patientId");
        var headerLabel = component.get("v.headerLabel");
        var pageName = component.get("v.pageName");
        sforce.console.getEnclosingPrimaryTabId(function(result) {
      		sforce.console.openSubtab(result.id, '/apex/clinicalSummaryViewAll?patientId='+patientId+'&page='+pageName , true, headerLabel, null);
    	});
    }
})