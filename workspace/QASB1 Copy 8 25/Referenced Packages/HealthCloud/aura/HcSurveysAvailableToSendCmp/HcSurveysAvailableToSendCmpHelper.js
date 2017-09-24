/* * Copyright © 2017 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcSurveysAvailableToSend helper function
 * @since 210.
 */
({
    createSurveyInvitation: function(component, event, helper) {
        // Create the action
        var self = this;
        var action = component.get("c.createSurveyInvitationController");
        var patientId = component.get("v.patientId");
        var surveyVersionId = event.getParam("data").SurveyVersionId;
        var communityId = event.getParam("data").communityId;
        var surveyName = event.getParam("data").Name;
        action.setParams({
            "surveyVersionId": surveyVersionId,
            "patientId": patientId,
            "communityId": communityId,
            "surveyName": surveyName
        });
        // Add callback behavior for when response is received
        action.setCallback(this, function(response) {
            var state = response.getState();
            component.set("v.showSpinner", false);
            var msg;
            var messageBody;
            if (component.isValid() && state === "SUCCESS") {
                msg = $A.get("$Label.HealthCloudGA.Success_Message_for_SurveyInvitation_Creation");
                messageBody = {
                    message: msg
                };
                self.handleComponentMessages(component, messageBody, 'success');
                var refreshEvent = $A.get("e.HealthCloudGA:HcSendToPatientDataChangedEvent");
                refreshEvent.fire();
            } else {
                msg = helper.getErrorMessage(response);
                messageBody = {
                    message: msg
                };
                self.handleComponentMessages(component, messageBody, 'error');
            }
        });

        // Send action off to be executed
        $A.enqueueAction(action);
    },

    handleComponentMessages: function(component, messageBody, type) {
        this.showToast(component, messageBody, true, type);
    },

    getErrorMessage: function(response) {
        var err = response.getError();
        var errors = [];
        for (var i = 0; i < err.length; i++) {
            errors.push(err[i].message);
        }
        var msg = errors.join(' ');
        if ($A.util.isEmpty(msg)) {
            msg = $A.get("$Label.HealthCloudGA.Msg_Error_General");
        }

        return msg;
    }
})