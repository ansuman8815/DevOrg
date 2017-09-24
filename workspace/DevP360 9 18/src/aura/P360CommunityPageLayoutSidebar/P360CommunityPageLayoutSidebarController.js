({
    mobileMenuClick : function(component, event, helper) {
    	var mobileMenuDisplay = document.getElementById('mobileSidebar');
       	$A.util.addClass(mobileMenuDisplay, 'active');
        var Mobilemask = document.getElementById('maskMobile');
      	$A.util.addClass(Mobilemask, 'active');
       var MobilemaskClass = document.getElementById('maskMobile');
        $A.util.removeClass(MobilemaskClass, 'slds-backdrop slds-backdrop--open');
        var MobilemaskClassOpen = document.getElementById('closeIcon');
        $A.util.addClass(MobilemaskClassOpen, 'hideEl');
        var MobilemaskClassClose = document.getElementById('OpenIcon');
        $A.util.removeClass(MobilemaskClassClose, 'hideEl');
      	var extendside = document.getElementById('mobileSidebar');
        $A.util.removeClass(extendside, 'extendwidth');
        var closeIconvar = document.getElementById('closeIcon');
        $A.util.removeClass(closeIconvar, 'visibleTrue');
    },
    
	myAction : function(component, event, helper) {
        $('body').append('<script>svg4everybody();</script>');
     

	},
    mobileMenuClickOpen : function(component, event, helper) {
    	var mobileMenuDisplay = document.getElementById('mobileSidebar');
        $A.util.removeClass(mobileMenuDisplay, 'active');
        var Mobilemask = document.getElementById('maskMobile');
        $A.util.removeClass(Mobilemask, 'active');
         var MobilemaskClass = document.getElementById('maskMobile');
        $A.util.addClass(MobilemaskClass, 'slds-backdrop slds-backdrop--open');
        var MobilemaskClassOpen = document.getElementById('closeIcon');
        $A.util.removeClass(MobilemaskClassOpen, 'hideEl');
        var MobilemaskClassClose = document.getElementById('OpenIcon');
        $A.util.addClass(MobilemaskClassClose, 'hideEl');
    },
    getContent : function(component, event, helper) {
        	document.getElementById("menuDiv").style.display = "none";
            document.getElementById("searchLinkDiv").style.display = "none";
        	document.getElementById("quickLinkDiv").style.display = "none";
    }
      
    
})