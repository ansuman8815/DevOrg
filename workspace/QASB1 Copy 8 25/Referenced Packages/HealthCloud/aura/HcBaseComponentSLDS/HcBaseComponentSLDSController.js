({
    doInit: function(component, event, helper) {
        var namespace = component.getDef().getDescriptor().getNamespace();
        component.set('v.namespace', $A.util.isEmpty(namespace) ? "c" : namespace);
        component.set('v.namespaceDash', $A.util.isEmpty(namespace) ? "" : namespace + '__');

        if (component.get('v.globalSettings') == null) {
            helper.rpcCall(component.get("c.getGlobalSettings"), null, function(response) {
                if (response.getState() === "SUCCESS") {
                    component.set('v.globalSettings', response.getReturnValue());
                } else {
                    throw new Error("Error getting Org Community status:" + response.getState());
                }
            });
        }
    }
})