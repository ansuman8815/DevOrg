({
    doInit: function(component, event, helper) {
        var metaLabels = component.get("v.caseMetaDataList");
        var metaDataMap = {};
        if(!$A.util.isEmpty(metaLabels)) {
            for (var i = 0; i < metaLabels.length; i++) {
                metaDataMap[metaLabels[i].name] = metaLabels[i];
            }
            component.set("v.metaDataMap", metaDataMap);
        }
    },

    handleCarePlanClick: function(component, event, helper) {
        helper.handleCarePlanClick(component, event, helper);
    },

    handleOwnerClick: function(component, event, helper) {
        helper.handleOwnerClick(component, event, helper);
    }
})