({
    getData: function (component, event) {
        var parameters = event.getParam('parameters');
        var recordId = parameters.recordId;

        var action = component.get("c.getVisualizationRoot");
        action.setParams({
            "recordId": recordId
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var treeRoot = response.getReturnValue();

                this.raiseDataFetchedEvent(component, treeRoot);

            } else if (state === "ERROR") {

                this.raiseDataErrorEvent(component, response);

            }
        });
        $A.enqueueAction(action);
    }
})