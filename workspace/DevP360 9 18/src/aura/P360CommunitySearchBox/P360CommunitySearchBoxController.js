({
	captureEnterCode : function(component, event, helper) {
		var toastEvent = $A.get("e.force:showToast");
        if(event.keyCode === 13){
            var searchTerm = document.getElementById("searchText").value;
            searchTerm = searchTerm.trim();
            var lastChar = searchTerm[searchTerm.length-1];
            if(searchTerm.length < 2){
                toastEvent.setParams({
                     "type": "error",
                     "message": "Your search term must have 2 or more characters.",
                     "mode" : "dismissible"
                    });
                toastEvent.fire();
            }
            else{
            	if(lastChar != '*')
            		searchTerm = searchTerm + '*';
                var evt = $A.get("e.c:P360CommunityGlobalSearchEvent");
                evt.setParams({"searchString": searchTerm});
                evt.setParams({"viewGlobalSearch": true});
                evt.fire();
            }
            if(($( window ).width() <= 768) && ($( window ).width() > 480)){
                var extendside = document.getElementById('mobileSidebar');
                $A.util.removeClass(extendside, 'extendwidth');
                var closeIconvar = document.getElementById('closeIcon');
                $A.util.removeClass(closeIconvar, 'visibleTrue');
            }
            else if($( window ).width() <= 480){
                var mobileMenuDisplay = document.getElementById('mobileSidebar');
                $A.util.addClass(mobileMenuDisplay, 'active');
                $A.util.removeClass(mobileMenuDisplay, 'extendwidth');
                var Mobilemask = document.getElementById('maskMobile');
                $A.util.addClass(Mobilemask, 'active');
                $A.util.removeClass(Mobilemask, 'slds-backdrop slds-backdrop--open');
                var MobilemaskClassOpen = document.getElementById('closeIcon');
                $A.util.addClass(MobilemaskClassOpen, 'hideEl');
                $A.util.removeClass(MobilemaskClassOpen, 'visibleTrue');
                var MobilemaskClassClose = document.getElementById('OpenIcon');
                $A.util.removeClass(MobilemaskClassClose, 'hideEl');
            }
        }
	},
    
    onClickEnter : function(component, event, helper) {
		var toastEvent = $A.get("e.force:showToast");
		var searchTerm = document.getElementById("searchText").value;
		searchTerm = searchTerm.trim();
		var lastChar = searchTerm[searchTerm.length-1];
        if(searchTerm.length < 2){
            toastEvent.setParams({
                "type": "error",
                "message": "Your search term must have 2 or more characters.",
                "mode" : "dismissible"
            });
            toastEvent.fire();
        }
        else{
            if(lastChar != '*')
                searchTerm = searchTerm + '*';
            var evt = $A.get("e.c:P360CommunityGlobalSearchEvent");
            evt.setParams({"searchString": searchTerm});
            evt.setParams({"viewGlobalSearch": true});
            evt.fire();
        }
        if(($( window ).width() <= 768) && ($( window ).width() > 480)){
            var extendside = document.getElementById('mobileSidebar');
            $A.util.removeClass(extendside, 'extendwidth');
            var closeIconvar = document.getElementById('closeIcon');
            $A.util.removeClass(closeIconvar, 'visibleTrue');
        }
        else if($( window ).width() <= 480){
            var mobileMenuDisplay = document.getElementById('mobileSidebar');
            $A.util.addClass(mobileMenuDisplay, 'active');
            $A.util.removeClass(mobileMenuDisplay, 'extendwidth');
            var Mobilemask = document.getElementById('maskMobile');
            $A.util.addClass(Mobilemask, 'active');
            $A.util.removeClass(Mobilemask, 'slds-backdrop slds-backdrop--open');
            var MobilemaskClassOpen = document.getElementById('closeIcon');
            $A.util.addClass(MobilemaskClassOpen, 'hideEl');
            $A.util.removeClass(MobilemaskClassOpen, 'visibleTrue');
            var MobilemaskClassClose = document.getElementById('OpenIcon');
            $A.util.removeClass(MobilemaskClassClose, 'hideEl');
        }
	},
    
    extendSidebar : function(component, event, helper) {
		if(($( window ).width() <= 768) && ($( window ).width() > 480)){
			var extendside = document.getElementById('mobileSidebar');
            $A.util.addClass(extendside, 'extendwidth');
            var closeIconvar = document.getElementById('closeIcon');
            $A.util.addClass(closeIconvar, 'visibleTrue');
        }
    },
    clearInputField : function(component, event, helper) {
        $('#searchText').val('');
        
    },
    doneRendering : function(component, event, helper) {
        $("#focusInput").bind('click', function() {
            if ($("#focusInput").data('clicked', true)){
                $('.search-input-wrapper .clearSearch').css('display','inline-block');
            }
            else{
                $('.search-input-wrapper .clearSearch').css('display','none');
            }
			
        });
        
    }
    
})