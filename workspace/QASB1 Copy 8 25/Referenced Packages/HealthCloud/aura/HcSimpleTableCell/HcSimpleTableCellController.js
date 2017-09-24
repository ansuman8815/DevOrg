({
	onInit : function(component, event, helper) {

		var itemData = component.get('v.itemData');
        var cellMetadata = component.get('v.cellMetadata');

        var cellMarkup = helper.generateCellMarkupFromType( itemData, cellMetadata, component );

		$A.createComponent(cellMarkup.element, cellMarkup.attributes,
            function(newCmp, status, statusMessage) {
                if( typeof cellMetadata.linkFunction == "function" ) {
                    var isLink = true;
                    if( typeof cellMetadata.linkResolver == "function" ) {
                        isLink = cellMetadata.linkResolver( itemData );
                    } 
                    if( isLink ) {
                        component.set('v.linkFunction', cellMetadata.linkFunction );
                    }
                    component.set('v.isLink', isLink);
                }
                component.set('v.body', newCmp);    
            }
        );
	},

    handleClick : function(component, event, helper) {
        var isSelectionCell = component.get('v.isSelectionCell');

        if( !isSelectionCell )
        {
            var isLink = component.get('v.isLink');
            var linkFunction = component.get('v.linkFunction');
            var itemData = component.get('v.itemData');
            if( isLink && !$A.util.isEmpty(linkFunction) )
            {
                linkFunction( itemData );
                return;
            }
            var pointerEvent = component.getEvent("pointerEvent");
            var cellItemdata = { 
                itemData: component.get('v.itemData'),
                cellMetadata: component.get('v.cellMetadata')
            }
            pointerEvent.setParams({
               "eventType": 'POINTER',
               "eventSubType": 'CLICK', // TODO: Determine type of pointer event from dom mouse event
               "data": cellItemdata
            });

            pointerEvent.fire();
        }
    },

    handleSelectionEvent : function(component, event, helper) {
        // TODO: Click on anywhere in the cell to toggle the selection component state

        var selectionType = component.get('v.selectionType');

        if( !$A.util.isEmpty(selectionType) )
        {
            var selectionComponent = component.get('v.body')[0];
            var isSelected = selectionComponent.get('v.checked');

            if( selectionType == 'MULTI' )
            {
                selectionType = selectionType + '_' + ( isSelected ? 'SELECT' : 'DESELECT' );
            }

            var selectionEvent = component.getEvent("selectionEvent");
            selectionEvent.setParams({
               "eventType": 'SELECTION',
               "eventSubType": selectionType, 
               "data": component.get('v.itemData')
            });

            selectionEvent.fire();      
        }
    },

    handleReferenceClick : function(component, event, helper) {
        var itemData = component.get('v.itemData');
        var cellMetadata = component.get('v.cellMetadata');

        if( cellMetadata.hasOwnProperty('lookupIdProperty') ) {
            HC.openRecordSubTab( itemData[cellMetadata.lookupIdProperty], itemData[cellMetadata.name] );
        } else {
            console.error('Lookup Id property not found for ' + itemData[cellMetadata.name] + '; Name field : ' + cellMetadata.name);
        }
    }
})