({
	doInit : function(component, event, helper) {
        
		var action = component.get("c.getFAQs");
        action.setCallback(this,function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                component.set("v.faqs", response.getReturnValue());
            }
        });
    	$A.enqueueAction(action);
        
        
        var sessionAction = component.get("c.updateUserSession");
        sessionAction.setParams({          
            currentPage : component.get("v.currentPage"),
            encounterId : component.get("v.encounterId")
        });
        sessionAction.setCallback(this, function(response)
        {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var res = response.getReturnValue();
            }
            else
            {
                console.log('Error');
            }
        });
        $A.enqueueAction(sessionAction);
	},
    highlightSearchv1 : function(component, event, helper) {
        var text = component.find("searchText").get("v.value");
        $( "#accordion" ).accordion({
            collapsible: true,
            active: false,
        });
        var textContainer = $("[id*=qsnid]");
        for(var i=0; i < textContainer.length; i++){
            if(textContainer[i].innerText.toLowerCase().indexOf(text.toLowerCase()) != -1){
                textContainer[i].style.display = "list-item";
            }
            else{
                textContainer[i].style.display = "none";
            }
        }
	},
    scriptsLoaded : function(component, event, helper) {
        setTimeout(function() {
        $( "#accordion" ).accordion({
      		collapsible: true,
             active: false,
    	});
            }, 1500);
    },
    toggle : function(component, event, helper) {
        helper.toggleHandler(component, event);
    }
})