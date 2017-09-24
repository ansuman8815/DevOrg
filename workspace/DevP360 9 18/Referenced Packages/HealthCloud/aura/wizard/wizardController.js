({
	onCancelClicked : function(component, event, helper) {
  		var context = component.get("v.userContext");
  		var returnUrl = component.get("v.returnUrl");
   		
   		if(typeof context !== "undefined") 
      {
          // Theme4d — Modern “Lightning Experience” Salesforce theme
    			// Theme4t — Salesforce1 mobile Salesforce theme
    			if(context == 'Theme4t' || context == 'Theme4d') 
    			{
              // 'VF in S1 or LEX';
              sforce.one.back(true);
          } 
         	else 
         	{
              // 'VF in Classic'; 
              window.location.assign( returnUrl );
         	}
      } 
      else 
      {
        	console.log('Standalone Lightning Component');
         	var event = $A.get("e.force:navigateBack");
         	event.fire();
    	}
    	var cancelEvent = component.getEvent("cancelEvent");
      cancelEvent.fire();
	},

	onBackClicked: function(component, event, helper) {
      var index = component.get('v.index');
      component.set('v.index', index-- >= 1 ? index : 1);
      var backEvent = component.getEvent("backEvent");
      backEvent.fire();
  },

  onNextClicked: function(component, event, helper) {
      var index = component.get('v.index');
      var count = component.get('v.count');
      component.set('v.index', index++ <= count ? index : count);
      var nextEvent = component.getEvent("nextEvent");
      nextEvent.fire();
  },

  onFinishClicked: function(component, event, helper) {
      var finishEvent = component.getEvent("finishEvent");
      finishEvent.fire();
  }
})