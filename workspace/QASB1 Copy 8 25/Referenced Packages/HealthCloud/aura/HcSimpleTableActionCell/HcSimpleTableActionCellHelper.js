({
	actionCellMarkupObjectGenerator : {

        EDIT : function( component ) {
            
            return {
                element: 'lightning:buttonIcon',
                attributes: {
                    iconName: "utility:edit",
                    variant: "bare",
                    class: "slds-m-left--xx-small slds-m-right--x-small",
                    alternativeText: 'Edit',
                    onclick: component.getReference('c.handleEdit')
                }   
            };
        },

        DELETE : function( component ) {
            
            return {
                element: 'lightning:buttonIcon',
                attributes: {
                    iconName: "utility:delete",
                    variant: "bare",
                    class: "slds-m-left--xx-small slds-m-right--x-small",
                    alternativeText: 'Delete',
                    onclick: component.getReference('c.handleDelete')
                }   
            };
        }
    },

    getDefaultActionComponentMarkupObject : function( actionType, component ) {
        var sanitizedActionType = actionType.toUpperCase().trim();
        if( this.actionCellMarkupObjectGenerator.hasOwnProperty( sanitizedActionType ) )
        {
            return this.actionCellMarkupObjectGenerator[ sanitizedActionType ]( component );
        }
    } 
})