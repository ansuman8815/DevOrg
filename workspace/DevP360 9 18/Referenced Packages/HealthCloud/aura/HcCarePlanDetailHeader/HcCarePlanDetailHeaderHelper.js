({
    handleCarePlanClick: function(component, event, helper) {
        var carePlanObj = component.get("v.caseDetail");
        var isSubtabOpened = HC.openSObjectSubtab(carePlanObj.Id, carePlanObj.Subject);
        if (!isSubtabOpened){
            this.showToastMessage("ERROR", $A.get("$Label.HealthCloudGA.Msg_Error_General"));
        }

    },

    handleOwnerClick : function(component, event, helper) {
        var carePlanObj = component.get("v.caseDetail");
        var isSubtabOpened = HC.openSObjectSubtab(carePlanObj.OwnerId, carePlanObj.Owner__Name);
        if (!isSubtabOpened){
            this.showToastMessage("ERROR", $A.get("$Label.HealthCloudGA.Msg_Error_General"));
        }

    },

    showToastMessage: function(status, msg) {
        $A.get("e.HealthCloudGA:HcComponentStatusEvent").setParams({
            status: status,
            message: msg,
        }).fire();
    }
})