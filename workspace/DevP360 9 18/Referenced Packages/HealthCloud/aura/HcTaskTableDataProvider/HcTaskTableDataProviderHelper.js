/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description helper of TaskTableDataProvider component
 * @since 196
 */
({
    sort: function(records, column, ascending) {
        records.sort(function(a, b) {
            var aVal = a[column],
                bVal = b[column],
                ret = 0;

            if ($A.util.isUndefined(aVal))
                return 1;
            if($A.util.isUndefined(bVal))
                return -1;

            if (typeof aVal !== 'number') {
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
    }
})