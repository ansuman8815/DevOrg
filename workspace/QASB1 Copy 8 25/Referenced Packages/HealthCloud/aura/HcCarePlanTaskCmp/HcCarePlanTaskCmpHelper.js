/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCarePlanTaskCmpHelper, js front-end helper for HcCarePlanTaskTable component.
 * @since 198
 */

({
        /**
         * Populates the task data based on filter selected
         */
        setTaskData: function(component, event, helper, filterType) {
            
            var action = null;
            var infoMessage = $A.get("$Label.HealthCloudGA.Msg_Invalid_Filter_Message");

            // set action & info message based on case
            switch(filterType) {
              case "All Tasks":
                action = "getAllTasksForPlan";
                infoMessage = $A.get("$Label.HealthCloudGA.Msg_All_Tasks_Related_To_CarePlan");
                break;

              case "Unrelated Tasks":
                action = "getUncategorizedTasksForPlan";
                infoMessage = $A.get("$Label.HealthCloudGA.Msg_Unrelated_Tasks_In_CarePlan");
                break;

              case "Related Tasks":
                action = "getCategorizedTasksForPlan";
                infoMessage = $A.get("$Label.HealthCloudGA.Msg_Tasks_Related_To_Problem_In_CarePlan");
                break;
            }

            // push info message to component
            component.set("v.infoMessage", infoMessage);
            var appEvent = $A.get("e.HealthCloudGA:HcCarePlanCmpEvent");
            appEvent.setParams({ 'type': 'action', 'actionName':action,'refresh':true});
            appEvent.fire();

        }
})