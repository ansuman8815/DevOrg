/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCarePlanHeaderHelper, js front-end helper for HcCarePlanHeader component.
 * @since 198
 */
({
        createComponent: function(component) {
            $A.createComponent("HealthCloudGA:HcActionCmp", {
                "createLabel": component.get("v.createActionButtonLabel"),
                "createId": component.get("v.createActionButtonId"),
                "editLabel": component.get("v.editActionButtonLabel"),
                "editId": component.get("v.editActionButtonId"),
                "carePlanId": component.get("v.carePlanId"),
                "problemId": component.get("v.problemId"),
                "goalId": component.get("v.goalId")
            }, function(newCmp) {
                if (newCmp.isValid() && component.isValid()) {
                    component.set("v.actionButton", newCmp);
                }
            });
        },

        carePlanHeaderCheckBoxMethod: function(component, event) {
            //To do - Do this only when checkBoxSelectedChanged
            var params = event.getParam('arguments');
            var checked = false;
            if (params) {
                checked = params.checked;
            }

            component.find("checkbox").set("v.value", checked);
        }
})