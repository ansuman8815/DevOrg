({
    onLeadValidationCompleted : function(component, event, helper) {
        // If the new value of isValidationComplete is true 
        // (ie., server-side lead validation process has completed), then hide the spinner
        if( event.getParam('value') )
        {
            $A.util.addClass( component.find('leadsLoadSpinner'), "slds-hide");
        }
    },

	onLeadResultsChanged : function(component, event, helper) {
		var leadResults = event.getParam('value');

        if( leadResults.length > 0 ) 
        {
            $A.util.addClass( component.find('leadsLoadMessageContainer'), "slds-hide");
            $A.util.removeClass( component.find('leadsTable'), "slds-hide"); 
        }
        else
        {
            $A.util.removeClass( component.find('validationSuccessMsg'), "slds-hide"); 
        }

	}
})