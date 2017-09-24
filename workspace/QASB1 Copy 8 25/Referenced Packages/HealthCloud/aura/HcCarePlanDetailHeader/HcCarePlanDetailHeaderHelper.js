({
    handleCarePlanClick: function(component, event, helper) {
        var carePlanObj = component.get("v.caseDetail");
        HC.openRecordSubTab(carePlanObj.Id, carePlanObj.Subject);
    },

    handleOwnerClick : function(component, event, helper) {
        var carePlanObj = component.get("v.caseDetail");
        HC.openRecordSubTab(carePlanObj.OwnerId, carePlanObj.Owner__Name);
    }
})