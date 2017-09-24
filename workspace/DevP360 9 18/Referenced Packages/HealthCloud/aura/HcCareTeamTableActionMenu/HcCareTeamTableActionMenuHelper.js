({
	raiseCareTeamTableActionEvent : function( component, eventSubType ) {
		var careTeamTableActionEvent = component.getEvent("actionEvent");
        careTeamTableActionEvent.setParams({
            eventType : 'ACTION',
            eventSubType : eventSubType,
            data : component.get('v.itemData')
        });
        careTeamTableActionEvent.fire();
	}
})