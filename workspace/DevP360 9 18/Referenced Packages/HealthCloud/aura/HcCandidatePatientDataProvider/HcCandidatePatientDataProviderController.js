/** 
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCandidatePatientDataProvider component: provides sort and filtering functionality 
 * for the HcCandidatePatientListView component. 
 * @since 198
 */
({
    init: function(component, event, helper) {
        if (component.get('v.rowMeta') == null || component.get('v.items') == null) {
            return;
        }

        var records = component.get('v.items'),
            searchTerm = component.get('v.searchTerm'),
            sortBy = component.get('v.sortBy'),
            column = sortBy,
            ascending = true;

        if (column && column.indexOf('-') === 0) {
            column = sortBy.slice(1);
            ascending = false;
        }

        if (records) {
            var filteredRecords = helper.filter(records, searchTerm);
            helper.sort(filteredRecords, column, ascending);
            helper.fireDataChangeEvent(component, filteredRecords);
        }
    },

    provide: function(component, event, helper) {
        if (component.get('v.rowMeta') == null || component.get('v.items') == null) {
            return;
        }

        var records = component.get('v.items');
        helper.provide(component, event, this);
        helper.fireDataChangeEvent(component, records);
    }
})