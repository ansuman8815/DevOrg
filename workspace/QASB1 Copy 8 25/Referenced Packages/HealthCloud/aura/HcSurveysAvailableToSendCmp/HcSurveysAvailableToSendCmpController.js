/* * Copyright © 2017 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcSurveysAvailableToSend controller function
 * @since 210.
 */
({
    handleApplicationEvent: function (component, event, helper) {
        var eventType = event.getParam("status");
        var message = event.getParam("message");
        var messageBody = {
            message: message
        };
        helper.showToast(component, messageBody, true, eventType.toLowerCase());
    },
    onTypeInSearch: function(component, event, helper){
        var searchText = event.getSource().get('v.value');
        helper.typeAheadDelayExecute(function() {
            component.set("v.searchText", searchText);
        });
    },
    handleSurveyInvitationCreationActionEvent: function(component, event, helper){
        component.set("v.showSpinner", true);
        helper.createSurveyInvitation(component, event, helper);
    }
})