/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description controller of TaskTableDataProvider component
 * @since 196
 */
({
    init: function(component, event, helper) {
        if (component.get('v.sortBy') == null || component.get('v.items') == null) return;

        var records = component.get('v.items'),
            sortBy = component.get('v.sortBy'),
            column = sortBy,
            ascending = true;

        if (column && column.indexOf('-') === 0) {
            column = sortBy.slice(1);
            ascending = false;
        }
        helper.sort(records, column, ascending);

        helper.fireDataChangeEvent(component, records);

    },

    onChange: function(cmp, event, helper){
        // dataprovider requires this to be defined, but we weren't using it...
    }
})