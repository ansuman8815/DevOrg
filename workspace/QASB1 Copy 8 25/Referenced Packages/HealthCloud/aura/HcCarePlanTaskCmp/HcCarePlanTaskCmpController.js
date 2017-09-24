({
    onInit: function(component, event, helper) {
        var infoMessage = $A.get("$Label.HealthCloudGA.Msg_All_Tasks_Related_To_CarePlan");
        component.set("v.infoMessage", infoMessage);
    },
    
    /**
     * This function is called on change event of task filter selection.
     */
    handleFilter: function(component, event, helper) {
        var taskTypeSelection = event.getSource().getLocalId();

        component.set("v.selectedTaskEvent", taskTypeSelection);
        helper.setTaskData(component, event, helper, taskTypeSelection);
    },

    getResultData: function(component, event, helper) {
        helper.setTaskData(component, event, helper, component.get("v.defaultTaskSelection"));
    },

    refresh: function(component, event, helper) {
        if (event.getParam("type") == "refresh") {
            var taskTypeSelection = component.get("v.defaultTaskSelection");
            helper.setTaskData(component, event, helper, taskTypeSelection);
        }
    }
})