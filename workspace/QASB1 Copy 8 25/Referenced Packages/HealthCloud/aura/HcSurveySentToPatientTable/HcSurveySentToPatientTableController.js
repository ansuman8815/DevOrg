/* * Copyright © 2017 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description Sent to patient table controller function
 * @since 210.
*/
({
    onInit : function(component, event, helper) { 
    	var nameLinkFunction = function( itemData ) {

            var recordId = '';
            if( !$A.util.isUndefinedOrNull( itemData[ 'ResponseId' ] ) )
            {
                recordId = itemData[ 'ResponseId' ];
                HC.openRecordSubTab(recordId, itemData[ 'Name' ]);
            }
        };

        var nameLinkResolver = function( itemData ) {
            return !$A.util.isUndefinedOrNull( itemData[ 'ResponseId' ] );
        };


        var columnLinkFunctionMap = {
            Name : nameLinkFunction
        };

        var columnLinkResolverFunctionMap = {
            Name : nameLinkResolver
        }

        component.set('v.columnLinkFunctionMap', columnLinkFunctionMap);
        component.set('v.columnLinkResolverFunctionMap', columnLinkResolverFunctionMap);
        component.set('v.showSpinner', true);
    },

    handleSearchChange: function(component, event, helper) {
        component.set("v.showSpinner",true);
    	helper.getInitialData(component, event, helper);
    }
})