({
    getDefaultCellMarkupObject : function( value, title ) {

        return {
                element: 'aura:text',
                attributes: {
                    value: value
                }   
            };

    },
    
    cellMarkupObjectGenerator : {

        SELECTION : function( itemData, cellMetadata, component ) {
            component.set('v.isSelectionCell', true);
            var selectionType = cellMetadata.selectionAttributes.type.toUpperCase();
            component.set('v.selectionType', selectionType);
            
            return {
                element: 'lightning:input',
                attributes: {
                    value: false,
                    type: selectionType == 'SINGLE' ? 'radio' : 'checkbox',
                    name: component.get('v.tableId'),
                    label: ' ',
                    class: 'slds-align--absolute-center',
                    onchange: component.getReference('c.handleSelectionEvent')
                }   
            };
        },

        DATE : function( itemData, cellMetadata, component ) {
            return {
                element: 'ui:outputDateTime', // ui:outputDate doesn't respect the date format passed, hence not used.
                attributes: {
                    value: itemData[cellMetadata.name],
                    format: component.get('v.userDateFormat')
                }   
            };
        },

        DATETIME : function( itemData, cellMetadata, component ) {
            return {
                element: 'ui:outputDateTime',
                attributes: {
                    value: itemData[cellMetadata.name],
                    format: component.get('v.userDateTimeFormat')
                }   
            };
        },

        PHONE : function( itemData, cellMetadata, component ) {
            return {
                element: 'ui:outputPhone',
                attributes: {
                    value: itemData[cellMetadata.name]
                }   
            };
        }

    },

	generateCellMarkupFromType : function( itemData, cellMetadata, component ) {
        var markupObject = this.getDefaultCellMarkupObject( '', '' );

        if( !$A.util.isEmpty(itemData) && !$A.util.isEmpty(cellMetadata) )
        {
            markupObject = this.getDefaultCellMarkupObject( itemData[cellMetadata.name], cellMetadata.name );
            if( this.cellMarkupObjectGenerator.hasOwnProperty( cellMetadata.type.toUpperCase() ) )
            {
                markupObject = this.cellMarkupObjectGenerator[ cellMetadata.type.toUpperCase() ]( itemData, cellMetadata, component );
            }
        }
        return markupObject;
    }
})