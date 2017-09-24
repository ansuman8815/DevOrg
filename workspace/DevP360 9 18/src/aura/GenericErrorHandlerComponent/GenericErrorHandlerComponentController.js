({
	doInit : function(component, event, helper) {
        console.log('Init2');
        //var params = event.getParam('arguments');
        //console.log(params);
        //var title = event.getParam("title");
        //var message = event.getParam("message");
        //console.log(title+message);
        var title = component.get('v.title');
        var message = component.get('v.message');
        console.log('title'+title);
		/*var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": title,
            "message": message,
            "duration": "5000"
        });
        toastEvent.fire();*/
	}
})