({
    STANDARD_BUTTON: 'standardButton',
    MEMBERSHIP: 'membership',
    GROUP: 'group',
    CARE_PLAN: 'careplan',
    RELATIONSHIP: 'relationship',
    
    deleteContactContactRelation: function(cmp, event, helper) {
        var action = cmp.get("c.deleteContactContactRelation");
            action.setParams({
                "identifier": cmp.get("v.recordId")

            });
            action.setCallback(this, function(response) {
                if (response.getState() === "SUCCESS") {
                    this.showSuccessToast(cmp, event, $A.get("$Label.HealthCloudGA.Msg_Success_Remove_Member"));
                } else {
                    this.showErrors(cmp, response);
                }
            });
            $A.enqueueAction(action);
    }, 
    
    removeAccountRelations: function(cmp, event, helper) {
        var action = cmp.get("c.deleteMembersOnGroups");
        var isRelationship = cmp.get("v.actionTypes")[0] == this.RELATIONSHIP ? 'true' : 'false';
        action.setParams({
                "identifier": cmp.get("v.recordId"),
                "isRelationship": isRelationship
            });
            
            action.setCallback(this, function(response) {
                if (response.getState() === "SUCCESS") {
                    var msg = $A.get("$Label.HealthCloudGA.Msg_Success_Remove_Member");
                    this.showSuccessToast(cmp, event, $A.get("$Label.HealthCloudGA.Msg_Success_Remove_Member"));
                } else {
                    this.showErrors(cmp, response);
                }
            });
            $A.enqueueAction(action);
    },
    
    removeCareTeamMember: function(component, event, helper) {
        var self = this;
        var action = component.get("c.relTabRemoveCareTeamMember");
        action.setParams({
            "identifier": component.get("v.recordId")
        });
        action.setCallback(this, function(response) {
            var returnMsg = response.getReturnValue();
            var msg;
            if (response.getState() === "SUCCESS") {
                this.showSuccessToast(component, event, $A.get("$Label.HealthCloudGA.Msg_Success_Remove_Member"));
            } else {
                this.showErrors(component, response);
            }
        });
        $A.enqueueAction(action);
    },
    
    refreshView: function(cmp) {
        var refreshEvent = $A.get("e.HealthCloudGA:HcComponentStatusEvent");
        refreshEvent.setParams({
                "status": "SUCCESS",
                "type": "REMOVE_RELATIONSHIP",
                "message": "Successfully Removed Member"
            });
        refreshEvent.fire();
    },

    showErrors: function(component, response) {
        var errors = [];
        response.getError().forEach(function (error){
            errors.push(error.message);
        });
        var msg = errors.join(' ');
        this.showToast(component, {message: msg}, true, 'error');        
    },

    showSuccessToast: function(component, event, msg) {
        this.showToast(component, {message: msg}, true, 'success');
        this.refreshView(component,event);
    }
})