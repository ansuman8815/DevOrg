({
    /* Method to capture logic when clicked on help icon */
	helpClick : function(component, event, helper) {
		console.log('Help...');
        var evt = $A.get("e.force:navigateToURL");
        evt.setParams({
             "url": "/help",
             isredirect : true
        });
        evt.fire();
	},
    /* Method to capture logic when clicked on quick link icon */
	quickLinkClick : function(component, event, helper) {
		console.log('Quick Links...');
        var divComp = document.getElementById("quickLinkDiv");
        var className = document.getElementById("quickLinkDiv").className;
        if(className.indexOf('slds-hide') != -1)
        {
        	$A.util.addClass(divComp, 'slds-show');
        	$A.util.removeClass(divComp, 'slds-hide');
        	document.getElementById("searchLinkDiv").style.display = "none";
        }
        else{
        	$A.util.removeClass(divComp, 'slds-show');
        	$A.util.addClass(divComp, 'slds-hide');
        }
	},
    /* Method to capture logic when clicked on search icon */
    searchClick : function(component, event, helper) {
  		console.log('Search Links...');
        var quickLinkComp = document.getElementById("quickLinkDiv");
        var divComp = document.getElementById("searchLinkDiv");
  		var className = document.getElementById("searchLinkDiv").style.display;
        if(className.indexOf("none") != -1){
        	$A.util.removeClass(quickLinkComp, 'slds-show');
        	$A.util.addClass(quickLinkComp, 'slds-hide');
        	document.getElementById("searchLinkDiv").style.display = "block";
    	}
        else
        	document.getElementById("searchLinkDiv").style.display = "none";
    }
})