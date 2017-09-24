({
	doInit: function(component, event, helper) {
		var columnLinkFunctionMap = {
            account__name : function( itemData ) {
            	
            	var appDriverFieldMap = {
            		Account: 'account__id',
            		Contact: 'account__primarycontact__c'
            	};
            	
            	var appDriver = component.get('v.dataProvider')[0].get('v.appDriver');
            	
            	var recordId = itemData[ appDriverFieldMap['Account'] ];
            	if( !$A.util.isUndefinedOrNull( appDriver ) && appDriverFieldMap.hasOwnProperty( appDriver ) )
            	{
            		recordId = itemData[ appDriverFieldMap[appDriver] ];
            	}

            	var url = "/" + encodeURIComponent(recordId);
                HC.openConsolePrimarytab(url, true, itemData['account__name'], recordId);
            }
        };

        component.set('v.columnLinkFunctionMap', columnLinkFunctionMap);
        component.set('v.showSpinner', true);
	},

    handleSelectionEvent: function(component, event, helper) {
        // Update v.selectedItems
        helper.getSelectedItems(component);
    }
})