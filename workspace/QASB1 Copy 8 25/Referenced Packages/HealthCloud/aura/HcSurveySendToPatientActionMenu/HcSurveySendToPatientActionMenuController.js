/* * Copyright © 2017 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcSurveySendToPatientActionMenu controller function
 * @since 210.
 */
({
    doInit : function(component, event, helper) {
        var communityList = component.get("v.itemData").communityList;
        component.set("v.communityList", communityList);
    },
    handleMenuClick: function(component, event, helper) {
        var communityId = event.getSource().get("v.value");
        if (communityId === 'No Community') {
            // Set error message
            var msg = $A.get("$Label.HealthCloudGA.Msg_Error_Not_Community_Member_for_SurveyInvitation_Creation");
            $A.get("e.HealthCloudGA:HcComponentStatusEvent").setParams({
                status: "ERROR",
                message: msg
            }).fire();
            return;
        }

        var data = component.get('v.itemData');
        data.communityId = communityId;
        var surveyActionEvent = component.getEvent("surveyActionEvent");
        surveyActionEvent.setParams({
            eventType : 'ACTION',
            eventSubType : 'CREATE',
            data : data
        });
        surveyActionEvent.fire();
    }
})