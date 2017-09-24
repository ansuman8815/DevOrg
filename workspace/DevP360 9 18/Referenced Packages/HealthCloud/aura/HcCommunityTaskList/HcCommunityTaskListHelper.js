({
    init: function(component, event, helper) {
        component.set("v.showSpinner",true);
        var self=this;
        var taskListMenuItems = [];
        taskListMenuItems.push({"label":$A.get("$Label.HealthCloudGA.Menu_Item_My_Tasks"), "value":$A.get("$Label.HealthCloudGA.Menu_Item_My_Tasks")});
        taskListMenuItems.push({"label":$A.get("$Label.HealthCloudGA.Menu_Item_My_Completed_Tasks"), "value":$A.get("$Label.HealthCloudGA.Menu_Item_My_Completed_Tasks")});

        component.set("v.selectedTaskListMenuItem", $A.get("$Label.HealthCloudGA.Menu_Item_My_Tasks"));
        if (component.get("v.selectedTaskListMenuItem") == $A.get("$Label.HealthCloudGA.Menu_Item_My_Tasks")
            || component.get("v.selectedTaskListMenuItem") == $A.get("$Label.HealthCloudGA.Menu_Item_My_Completed_Tasks")){
            component.set("v.showOwner", false);
        } else {
            component.set("v.showOwner", true);
        }
        component.set("v.taskListMenuItems", taskListMenuItems);
        component.set("v.taskData", []);
        component.set("v.showMore",true);
        self.getTasks(component, event, component.get("v.pageIndex"));
    },

    handleCheckBoxSelection: function(component,taskId,selected){
      component.set("v.showSpinner",true);
      var action = component.get("c.updateTask");
      action.setParams({
        "taskId": taskId,
        "isClosed": selected
      });
      action.setCallback(this, function(response) {
        var state = response.getState()
        if (state !== "SUCCESS") {
          component.set("v.errorMsg",$A.get("$Label.HealthCloudGA.Msg_Error_General"));
        }
        else if(state === "SUCCESS"){
          component.set("v.showSpinner",false);
        }
      });
      $A.enqueueAction(action);
    },

    getTasks: function(component, event, pageIndex) {
      component.set("v.showSpinner",true);
      var filterType = component.get("v.selectedTaskListMenuItem");
      var action = component.get("c.getTasksForCarePlan");
      var actionType = null;
        switch(filterType) {
          case $A.get("$Label.HealthCloudGA.Menu_Item_My_Tasks"):
            actionType = $A.get("$Label.HealthCloudGA.Menu_Item_My_Tasks");
            break;

          case $A.get("$Label.HealthCloudGA.Menu_Item_All_Tasks"):
            actionType = $A.get("$Label.HealthCloudGA.Menu_Item_All_Tasks");
            break;

          case $A.get("$Label.HealthCloudGA.Menu_Item_My_Completed_Tasks"):
            actionType = $A.get("$Label.HealthCloudGA.Menu_Item_My_Completed_Tasks");
            break;

          case $A.get("$Label.HealthCloudGA.Menu_Item_All_Completed_Tasks"):
            actionType = $A.get("$Label.HealthCloudGA.Menu_Item_All_Completed_Tasks");
            break;
        }

        if (!$A.util.isUndefinedOrNull(actionType)) {
            action.setParams({
              "carePlanId": component.get("v.carePlanId"),
              "taskFieldSetName": component.get("v.taskFieldSet"),
              "numOfRecords": '20',
              "pageIndex": pageIndex.toString(),
              "taskType": actionType
            });

            action.setCallback(this, function(response) {
                if (response.getState() === "SUCCESS") {
                    var returnedTasks = response.getReturnValue();
                    this.populateTasks(component, returnedTasks);
                }
                //Error from backend
                else{
                   component.set("v.errorMsg",$A.get("$Label.HealthCloudGA.Msg_Error_General"));
                }
            });

            $A.enqueueAction(action);
        }
      },

    populateTasks: function(component,returnedTasks){
        var recordCount = component.get("v.recordCount");
        if (!$A.util.isUndefinedOrNull(returnedTasks)) {
            var existingTasks = component.get("v.taskData");
            if(existingTasks != null){
                var tasksToadd = returnedTasks.length -1;
                if(returnedTasks.length <= recordCount){
                    tasksToadd = returnedTasks.length;
                    component.set("v.showMore",false);
                }
                for(var i=0 ; i<tasksToadd ; i++){
                    existingTasks.push(returnedTasks[i]);
                }
                component.set("v.taskData", existingTasks);
            }else{
                if(returnedTasks.length > recordCount){
                    for(var i=0 ; i<returnedTasks.length-1 ; i++){
                        existingTasks.push(returnedTasks[i]);
                    }
                }
                else{
                    for(var i=0 ; i<returnedTasks.length ; i++){
                        existingTasks.push(returnedTasks[i]);
                    }
                    component.set("v.showMore",false);
                }
                component.set("v.taskData", existingTasks);
            }
            component.set("v.showSpinner",false);
        }
    }
})