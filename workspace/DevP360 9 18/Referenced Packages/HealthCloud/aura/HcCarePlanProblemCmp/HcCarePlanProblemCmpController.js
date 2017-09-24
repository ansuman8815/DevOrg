({
    getProblemGoals: function (component, event, helper) {
        helper.getGoals(component, event, helper);
    },

    handleCarePlanEvent: function (component, event, helper) {
        helper.handleCarePlanEvent(component, event, helper);
    },

    expandCollapseAllProblems: function (component, event, helper) {
        var type = event.getParam("type");
        var carePlanId = event.getParam("carePlanId");
        var expanded = component.get('v.expanded');
        if (!expanded && type === "Expand all problems and goals" && carePlanId == component.get("v.carePlanId") ||
            expanded && type === "Collapse all problems and goals" && carePlanId == component.get("v.carePlanId")) {
            component.set("v.expandGoals", true);
            var cmpHeader = component.find("problemHeader");
            cmpHeader.expand();
        }
    }
})