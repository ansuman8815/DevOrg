({
	doInit : function(component, event, helper) {
		var columnLinkFunctionMap = {
            name : function( itemData ) {
                HC.openRecordSubTab(itemData.memberId, itemData.name);
            }
        };

        component.set('v.columnLinkFunctionMap', columnLinkFunctionMap);
        component.set("v.showSpinner", true);  
	},

    handleCareTeamTableEvent : function(component, event, helper) {
        var actionEvent = component.get('v.actionEvent');
        var eventType = actionEvent.getParam('eventType');
        var eventSubType = actionEvent.getParam('eventSubType');
        var eventData = actionEvent.getParam('data');
        
        if( eventType == 'ACTION' )
        {
            helper.handleCareTeamTableAction( component, eventSubType, eventData );
        }
    },

    handleCareTeamModalEvent : function(component, event, helper) {
        helper.handleCareTeamModalEvent( component, event );
        event.stopPropagation();
    }
})