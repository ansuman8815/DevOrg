/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCareTeamDataProviderHelper, js front-end helper for HcCareTeamDataProvider component.
 * @since 198
 */
({
    provide: function(component, event) {

        /* IMPORTANT!! Attribute "sortBy" will be auto hookup with dataGrid,
            you don't have to set it manually. */
        var records = component.get('v.items'),
            sortBy = component.get('v.sortBy'),
            column = sortBy,
            ascending = true;

        if (column && column.indexOf('-') === 0) {
            column = sortBy.slice(1);
            ascending = false;
        }

        if (column != null)
            this.sort(records, column, ascending);

        this.fireDataChangeEvent(component, records);
    },

    sort: function(records, column, ascending) {
        records.sort(function(a, b) {
            var aVal = a[column],
                bVal = b[column],
                ret = 0;
            if ($A.util.isUndefined(aVal) || $A.util.isUndefined(bVal))
                return ret;
            else if (!$A.util.isNumber(aVal)) {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
                ret = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
            } else {
                ret = parseInt(aVal) - parseInt(bVal);
            }

            if (!ascending) {
                ret = -ret;
            }

            return ret;
        });
    }
})