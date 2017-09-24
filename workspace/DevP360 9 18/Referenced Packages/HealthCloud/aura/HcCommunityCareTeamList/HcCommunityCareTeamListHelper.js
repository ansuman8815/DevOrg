/*
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCommuityCareTeamListHelper
 * @since 208
 */

({
    loadMembers: function(component, event, helper) {
        var action = component.get("c.getCareTeamMembersForCmty");
        component.set("v.showSpinner", true);
        component.set("v.errorMsg", "");
        var patients = [];
        var teamMembers = [];
        action.setParams({
            "carePlanID": component.get("v.carePlanId"),
            "patientCardFieldSetName": component.get("v.PatientFieldSet"),
            "teamMemberFieldSetName": component.get("v.TeamMemberFieldSet")
        });
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                var records = response.getReturnValue();
                component.set("v.records", records);
                if (!$A.util.isUndefinedOrNull(records) && records.length > 0) {
                    component.set("v.emptyStateMsg","");
                    for (var i = 0; i < records.length; i++) {
                        if (records[i].isPatient) {
                            patients.push(records[i]);
                        } else {
                            teamMembers.push(records[i]);
                        }
                    }
                    component.set("v.showSpinner", false);
                }
                else if(records.length == 0){
                    component.set("v.showSpinner", false);
                    component.set("v.emptyStateMsg",$A.get("$Label.HealthCloudGA.Msg_No_CareTeam_Members"));
                }
            } else {
                component.set("v.showSpinner", false);
                component.set("v.errorMsg", $A.get("$Label.HealthCloudGA.Msg_Error_Filter_Record_List"));
            }
            component.set("v.patients", patients);
            component.set("v.teamMembers", teamMembers);
             component.set("v.showSpinner", false);
        });

        $A.enqueueAction(action);
    },
})