({
	onInit : function(component, event, helper) {
		var itemData = component.get('v.itemData');
        var columnsMetadata = component.get('v.columnsMetadata');
		var defaultActions = component.get('v.defaultActions');
		
		var actionCmpsToCreate = [];

		for( var ii = 0; ii < defaultActions.length; ii++ )
		{
			let actionMarkup = helper.getDefaultActionComponentMarkupObject( defaultActions[ii], component );
			actionCmpsToCreate.push( [ actionMarkup.element, actionMarkup.attributes ] );
		}
		
		var customActionComponentName = component.get('v.customActionComponentName');
		
		if( !$A.util.isEmpty( customActionComponentName ) )
		{
			actionCmpsToCreate.push( [ customActionComponentName, 
										{
											itemData : itemData,
											columnsMetadata : columnsMetadata
										} 
									 ]);
		}

	    $A.createComponents(actionCmpsToCreate, function(actionComponents, status, statusMessages) {
            if( status == "SUCCESS" )
            {
                component.set('v.body', actionComponents);
            }
            else
            {
                var tableErrorEvent = component.getEvent("tableErrorEvent");
                tableErrorEvent.setParams({
                    eventType: 'ERROR',
                    eventSubType: $A.get("$Label.HealthCloudGA.Items_Display_Error"), 
                    data: statusMessages
                });
                tableErrorEvent.fire();
            }
        });
	},

	handleEdit : function(component, event, helper) {
		var actionEvent = component.getEvent("actionEvent");
		actionEvent.setParams({
			"eventType": 'ACTION',
			"eventSubType": 'EDIT', 
			"data": component.get('v.itemData')
		});
		actionEvent.fire();
    },

    handleDelete : function(component, event, helper) {
		var actionEvent = component.getEvent("actionEvent");
		actionEvent.setParams({
			"eventType": 'ACTION',
			"eventSubType": 'DELETE', 
			"data": component.get('v.itemData')
		});
		actionEvent.fire();
    }
})