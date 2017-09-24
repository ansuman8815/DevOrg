/*
 * Copyright © 2016 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @since 208
 */
({
    firePlanChangedEvent : function(component, event) {
    	var planCmp = component.find("plan");
    	if (!$A.util.isUndefinedOrNull(planCmp)) {
	        var selected = planCmp.get("v.value");
	        var patientId = null;
	        var carePlanId = null;
	        // if nothing was selected return since there's nothing to do
	        if( $A.util.isEmpty(selected) ) {
	            return;
	        } else {
	            var parts = selected.split(" ");
	            if($A.util.isEmpty(parts[0]) && !$A.util.isEmpty(parts[1])){
	                patientId = parts[1];
	            } else if(!$A.util.isEmpty(parts[0])){
	               carePlanId = parts[0];
	            }
	        }
	        
	        // fire the application event for any listeners
	        var carePlanEvent = $A.get("e.HealthCloudGA:HcCommunityEventCarePlanSelected");
	        carePlanEvent.setParams({
	            'carePlanId': carePlanId,
	            'patientId': patientId
	        }).fire();
    	}
    },
    
    assignDefaults : function(component, event){
        // assigning the label to the placeholder text so that it is localized
        var defaultPickerText = component.get("v.picklistDefaultOptionText");
        if(defaultPickerText == 'Select a name and care plan...'){
            component.set("v.picklistDefaultOptionText", $A.get("$Label.HealthCloudGA.CarePlan_Picklist_Placeholder_Default_Text"));
        }
    },
    
    // Retrieve the care plans this user has access to
    // : Call the Apex controller method getCarePlansForCurrentUser and return the list
    getCarePlans : function(component, event) {
        var self = this;
        var action = component.get("c.getCarePlansForCurrentUser");
        var showBirthDate = component.get("v.showBirthDate");
        var includeYearOfBirth = component.get("v.IncludeYearOfBirth");
        
        action.setParams({
              "includeAllCarePlanOption": component.get("v.includeAllCarePlanOption"),
              "showBirthDateOption": showBirthDate,
              "includeBirthDateYearOption": includeYearOfBirth
            });
        action.setCallback(self, function(response) {
            // retrieve response state
            var state = response.getState();
            
            // is component currently valid and response SUCCESS?
            if (component.isValid() && state.toUpperCase() === "SUCCESS") {
                // retrieve actual payload from response
                var carePlans = response.getReturnValue();
                // Incoming payload format:
                // [ { caseId : 'XXXXX', subject : 'Subject string'}, {...}, {...} ]
                
                // only continue if the response has no errors
                if( typeof carePlans.error === 'undefined' ) {
                    var useMonthText = component.get("v.useMonthText");
                    
                    for(var cnt =0; cnt<carePlans.length; cnt++){
                        // We are using + operator for string concatination more often
                        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/concat
                        // http://stackoverflow.com/questions/16124032/js-strings-vs-concat-method
                        var displaytext = '';
                        if(!($A.util.isEmpty(carePlans[cnt].patientFirstName))){
                            displaytext += carePlans[cnt].patientFirstName + ' ';
                        }
                        displaytext += carePlans[cnt].patientLastName;
                        if(!($A.util.isEmpty(carePlans[cnt].patientBirthDay)) && showBirthDate){
                            displaytext += ' (' ;
                            var birthDate = this.getUserLocalizedDate(carePlans[cnt].patientBirthYear, carePlans[cnt].patientBirthMonth, carePlans[cnt].patientBirthDay, includeYearOfBirth, useMonthText);
                            displaytext += birthDate + ')';
                        }
                        displaytext += ' - ' + carePlans[cnt].carePlanName;
                        carePlans[cnt].displayText = displaytext;
                    }
                    
                    if (carePlans.length === 0) {
                        component.set("v.carePlanError", $A.get("$Label.HealthCloudGA.No_Care_Plan_to_display_text"));
                    }
                    // if we have only one care plan trigger the care plan selected event with the single ID
                    else if (carePlans.length === 1) {
                        component.set("v.singleCarePlanText", carePlans[0].displayText);
                        var singleID = carePlans[0].caseId;
                        var planCmp = component.find("plan");
                        var currentID = planCmp.get("v.value");
                        // set the ID of the picker before firing the event
                        planCmp.set("v.value", singleID);
                        
                        // only if it isn't already the current care plan ID
                        if ( singleID != currentID ) {
                            // trigger care plan change event
                            self.firePlanChangedEvent(component, event)
                        }
                    }
                    
                    
                    // update the component attribute to the current value
                    component.set("v.carePlans", carePlans);
                    
                } else {
                    // error in getting Care Plans
                    component.set("v.carePlanError", $A.get("$Label.HealthCloudGA.Msg_Error_Unable_To_Retrive_CarePlan"));
                    
                }
                
                // if error
            } else {
                component.set("v.carePlanError", $A.get("$Label.HealthCloudGA.Msg_Error_Unable_To_Retrive_CarePlan"));
            }
        });
        
        $A.enqueueAction(action);
    },

    // returns a date string in the user's locale selection in Salesforce Setup
    getUserLocalizedDate: function(year, month, day, includeYearOfBirth, useMonthText) {
        var options = {
           day  : '2-digit',
        };

        options['month'] = useMonthText ? 'short' : '2-digit';
        if(includeYearOfBirth){
            options['year'] = 'numeric';
        }

        return(new Date(year,month-1, day).toLocaleString(this.getUserLocaleString(),options));
    },

    // utility method to return a user's locale string
    // retrieve user's locale info and create is as a standard locale string (i.e.: en_US, fr_FR, de_DE)
    getUserLocaleString: function() {
        return $A.get("$Locale.userLocaleLang") + "-" + $A.get("$Locale.userLocaleCountry");
    },
})