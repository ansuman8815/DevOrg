/** 
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCandidatePatientDataProvider component: provides sort and filtering functionality 
 * for the HcCandidatePatientListView component.
 * @since 198
 */
({
    provide: function(component, event, controller) {
        component.set('v.searchTerm', '');

        var recordsMeta = component.get("v.rowMeta");
        var records = component.get("v.items");
        var sortBy = component.get('v.sortBy');

        // Default to sorting by first column of data
        if (!sortBy) {
            sortBy = recordsMeta.Columns[0];
        }

        var column = sortBy,
            ascending = true;

        if (column && column.indexOf('-') === 0) {
            column = sortBy.slice(1);
            ascending = false;
        }

        if (column) {
            this.sort(records, column, ascending);
        }
    },

    sort: function(records, column, ascending) {
        if (!records)
            return;

        records.sort(function(a, b) {

            var aVal = a[column],
                bVal = b[column],
                ret = 0;
            if ($A.util.isUndefined(aVal) || $A.util.isUndefined(bVal))
                return ret;
            else if (typeof aVal !== 'number') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
                ret = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
            } else {
                ret = parseInt(aVal,10) - parseInt(bVal,10);
            }

            if (!ascending) {
                ret = -ret;
            }

            return ret;
        });
    },

    filter: function(records, searchTerm) {
        if ((typeof searchTerm) !== 'string' || searchTerm.trim() === '') return records;
        searchTerm = searchTerm.trim();

        var result = [];
        records.forEach(function(record, index, all) {
            for (var key in record) {
                if (!record.hasOwnProperty(key) || (typeof record[key]) !== 'string') continue;
                if (record[key].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
                    result.push(record);
                    break;
                }
            }
        });

        return result;
    }
})