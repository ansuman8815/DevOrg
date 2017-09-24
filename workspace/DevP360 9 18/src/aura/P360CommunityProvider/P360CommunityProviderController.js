({
    doInit : function(component, event, helper) {
        var action = component.get("c.getproviderValues");
        var pracId = component.get("v.whereClause");
        action.setParams({"encounterPracId" : pracId});
        action.setCallback(this, function(data) {
            var result=data.getReturnValue();
            component.set("v.practitioners" , result);
        });
        $A.enqueueAction(action); 
    },  
    clinkOnClose : function(component, event, helper) {	
        if(document.getElementById("providerNotes"))
        	document.getElementById("providerNotes").style.display = "none";
        $("#column2Div").css("margin-top","0px");
        var cmpDiv1 = document.getElementById("column1Div");
        var cmpDiv2 = document.getElementById("column2Div");
        var cmpDiv4 = document.getElementById("column4Div");  
        $A.util.removeClass(cmpDiv1, 'slds-backdrop slds-backdrop--open');
        $A.util.removeClass(cmpDiv2, 'slds-backdrop slds-backdrop--open');
        $A.util.removeClass(cmpDiv4, 'slds-backdrop slds-backdrop--open');
        if($( window ).width() <= 767){
            $('.footer').css('position','relative');
        }
        var CommunityCloseIconEvent = $A.get("e.c:CommunityCloseIconEvent");
        CommunityCloseIconEvent.fire();
    }
})