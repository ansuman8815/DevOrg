({
    handleCarePlanEvent: function(component, event, helper) {
        if (event.getParam("type") === "EXPAND") {
            helper.expand(component, event, helper);
        } else if (event.getParam("type") === "REFRESH") {
            helper.refresh(component, event, helper);
        }
    },

    expand: function(component, event, helper) {
        var isExpanded = component.get('v.expanded');
        var needFetch = false;
        component.set('v.expanded', !component.get('v.expanded'));
        var goalId = component.get("v.goal.Id")
        if(!isExpanded) {
            var goalId = component.get("v.goal.Id")
            var appEvent = $A.get("e.HealthCloudGA:HcCarePlanCmpEvent");
            appEvent.setParams({ 'type': 'action', 'actionName':'getTasksForGoals','id':goalId,'idType':'goalId','refresh':false});
            appEvent.fire();
        }
    },

    refresh: function(component, event, helper) {
        var goalId = component.get("v.goal.Id")
        var appEvent = $A.get("e.HealthCloudGA:HcCarePlanCmpEvent");
        appEvent.setParams({ 'type': 'action', 'actionName':'getTasksForGoals','id':goalId,'idType':'goalId','refresh':true});
        appEvent.fire();
    }
       
})