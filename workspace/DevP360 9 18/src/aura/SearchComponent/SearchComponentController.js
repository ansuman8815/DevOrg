({
	SearchEvent : function(component, event, helper) {
        var myEvent = $A.get("e.c:SearchEvent");
        if (myEvent.length>3)
        {
            myEvent.setParams({"searchKey":event.target.value});
        	myEvent.fire();
        }
        
    	
        
	}
    
    
})