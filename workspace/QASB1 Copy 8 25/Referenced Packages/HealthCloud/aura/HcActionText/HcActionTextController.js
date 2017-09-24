({
    onInit: function (component, event, helper) {
        component.set('v.linkWithPreview', !HC.isInAlohaConsole());
    },

    handleClick: function (component, event, helper) {
        var objId = component.get("v.objId");
        var label = component.get("v.label");
        HC.openRecordSubTab(objId, label);
    }
})