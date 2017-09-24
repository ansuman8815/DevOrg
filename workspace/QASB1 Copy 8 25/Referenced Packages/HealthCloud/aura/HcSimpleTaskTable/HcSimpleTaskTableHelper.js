({
    getInitialData : function(cmp,evt,hlp,action) {
        var dataProvider = cmp.get('v.dataProvider');
        var provideEvent = dataProvider[0].get("e.provide");
        var parameters = {'type':'DataFetch','action':action};
        var eventData = {"parameters" : parameters};
        provideEvent.setParams(eventData);
        provideEvent.fire();
    },

    editTask: function(component, taskObject) {
        
        var action = component.get("c.retrieveTask");
        var taskId = taskObject.Id;
        action.setParams({
            "taskId": taskId
        });
        action.setCallback(this, function(response) {
            var memberObj = {};
            memberObj["carePlanId"] = component.get("v.carePlanId");
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log('retrieve task by id:' + taskId);
                var task = response.getReturnValue();
                
                var appEvent = $A.get("e.HealthCloudGA:HcCarePlanCmpEvent");
                appEvent.setParams({
                    "type": "Edit Task",
                    "taskType": "UpdateTask",
                    "taskId": taskId, 
                    "SObject": task,
                    "carePlanId": component.get("v.carePlanId")
                });
                appEvent.fire();
            } else {
                $A.get("e.HealthCloudGA:HcComponentStatusEvent").setParams({
                    status: "ERROR",
                    message: "Task Edit Failed! Task Not Found",
                    memberObj: memberObj
                }).fire();
            }
            
        });
        $A.enqueueAction(action);

    }

})