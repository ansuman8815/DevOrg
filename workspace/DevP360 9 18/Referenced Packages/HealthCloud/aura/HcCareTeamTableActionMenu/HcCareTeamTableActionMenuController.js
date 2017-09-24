({
    handleEditMember: function(component, event, helper) {
        helper.raiseCareTeamTableActionEvent( component, 'EditMember' );
    },

    handleAddMemberToCommunity: function(component, event, helper) {
        helper.raiseCareTeamTableActionEvent( component, 'AddMemberToCommunity' );
    },

    handlePrivateMessage: function(component, event, helper) {
        helper.raiseCareTeamTableActionEvent( component, 'PrivateMessage' );
    },

    handleCreateTask: function(component, event, helper) {
        helper.raiseCareTeamTableActionEvent( component, 'CreateTask' );
    },

    handleRemoveMember: function(component, event, helper) {
        helper.raiseCareTeamTableActionEvent( component, 'RemoveMember' );
    }
})