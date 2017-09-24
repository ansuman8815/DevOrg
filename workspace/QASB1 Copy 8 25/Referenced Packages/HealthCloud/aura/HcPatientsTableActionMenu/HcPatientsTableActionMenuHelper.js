({
    raisePatientsTableActionEvent: function( component, eventSubType ) {
        var patientsTableActionEvent = component.getEvent("patientsTableActionEvent");
        patientsTableActionEvent.setParams({
            eventType : 'ACTION',
            eventSubType : eventSubType,
            data : component.get('v.itemData')
        });
        patientsTableActionEvent.fire();
    },

	handleCreateTask : function( component ) {
		this.raisePatientsTableActionEvent( component, 'CreateTask' );
	}
})