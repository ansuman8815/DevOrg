({
    handleCarePlanEvent: function(component, event, helper) {
        helper.handleCarePlanEvent(component, event, helper);
    },
    
    expandCollapseAllGoals: function(component, event, helper) {
        var type = event.getParam("type");
        var carePlanId = event.getParam("carePlanId");
        var expanded = component.get('v.expanded');
        if (!expanded && (type === "Expand all problems and goals" || type === "Expand all goals") && carePlanId == component.get("v.carePlanId") ||
                expanded && (type === "Collapse all problems and goals" || type === "Collapse all goals")  && carePlanId == component.get("v.carePlanId")) {
            var goalHeader = component.find("goalHeader");
            goalHeader.expand();
        }
    }
})