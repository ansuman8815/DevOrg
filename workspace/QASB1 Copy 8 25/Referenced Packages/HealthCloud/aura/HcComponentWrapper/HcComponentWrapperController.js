({
	doInit : function(component, event, helper) {
		var mainComponentSpec = component.get('v.mainComponentSpec');
        if( !$A.util.isEmpty( mainComponentSpec ) )
        {
        	$A.createComponent( mainComponentSpec.componentDef, 
                                mainComponentSpec.attributes,
                               function( mainCmp, status, statusMessage ) {
                                  component.set('v.mainComponent', mainCmp ); 
                               });
        }
	}
})