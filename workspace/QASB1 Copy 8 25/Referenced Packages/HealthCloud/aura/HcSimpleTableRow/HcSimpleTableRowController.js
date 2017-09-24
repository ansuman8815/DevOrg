({
	doInit : function(component, event, helper) {
		var namespace = component.toString().match(/markup:\/\/(\w{1,15}):/)[1];
		var item = component.get('v.item');
		var headerColumns = component.get('v.headerColumns');
		
		var userDateFormat = component.get('v.userDateFormat');
		var userDateTimeFormat = component.get('v.userDateTimeFormat');

		var cellsToCreate = []; 
		var uniqueCellId; 
		for( var i = 0; i < headerColumns.length; i++ ) 
		{
			uniqueCellId = component.get('v.id') + '_cell_' + headerColumns[i].name;
			var cellCmp = ["HealthCloudGA:HcSimpleTableCell", {
                            'aura:id' : uniqueCellId,
							id : uniqueCellId,
							tableId : component.get('v.tableId'),
                			class: component.get('v.cellClass'),
                            itemData : item,
                            cellMetadata : headerColumns[i],
                            userDateFormat : userDateFormat,
                            userDateTimeFormat : userDateTimeFormat
                          }];

            if( headerColumns[i].type == 'ACTION' )
            {
                var actionAttributes = headerColumns[i].actionAttributes;
                // TODO: Remove replace once SFX/aura stops indiscriminately replacing 'HealthCloudGA:' occurrences with the namespace
                var customActionComponentName = actionAttributes.customActionComponentName && actionAttributes.customActionComponentName.replace('c' + ':', namespace+':')

                cellCmp = [ "HealthCloudGA:HcSimpleTableActionCell", {
                                'aura:id' : uniqueCellId,
                                id : uniqueCellId,
	                			class: component.get('v.cellClass'),
                                itemData : item,
                                columnsMetadata : headerColumns,
                                defaultActions : actionAttributes.defaultActions,
                                customActionComponentName : customActionComponentName
                            }];
            }
		  	cellsToCreate.push( cellCmp );
		}

        $A.createComponents(cellsToCreate, function(newCells, status, statusMessages) {
            if( status == "SUCCESS" )
            {
                component.set('v.cells', newCells);
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
	}
})