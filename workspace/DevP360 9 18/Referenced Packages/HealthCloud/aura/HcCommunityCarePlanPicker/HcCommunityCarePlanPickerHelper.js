/*
 * Copyright © 2016 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @since 208
 */
({
    firePlanChangedEvent : function(component, event) {
        var selected = component.find("plan").get("v.value");
        
        // if nothing was selected return since there's nothing to do
        if( $A.util.isEmpty(selected) ) { return; }
        
        // fire the application event for any listeners
        var carePlanEvent = $A.get("e.HealthCloudGA:HcCommunityEventCarePlanSelected");
        carePlanEvent.setParams( { 'carePlanId': selected } );
        carePlanEvent.fire();
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
                    var showBirthDate = component.get("v.showBirthDate");
                    
                    for(var cnt =0; cnt<carePlans.length; cnt++){
                        // We are using + operator for string concatination more often
                        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/concat
                        // http://stackoverflow.com/questions/16124032/js-strings-vs-concat-method
                        var displaytext = '';
                        if(!($A.util.isEmpty(carePlans[cnt].patientFirstName))){
                            displaytext += carePlans[cnt].patientFirstName + ' ';
                        }
                        displaytext += carePlans[cnt].patientLastName;
                        if(!($A.util.isEmpty(carePlans[cnt].patientBirthDate)) && showBirthDate){
                            displaytext += ' - ' + carePlans[cnt].patientBirthDate;
                        }
                        if(!($A.util.isEmpty(carePlans[cnt].carePlanName))){
                            displaytext += ' - ' + carePlans[cnt].carePlanName;
                        }
                        carePlans[cnt].displayText = displaytext;
                    }
                    
                    // if we have only one care plan trigger the care plan selected event with the single ID
                    if (carePlans.length === 1) {
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
})