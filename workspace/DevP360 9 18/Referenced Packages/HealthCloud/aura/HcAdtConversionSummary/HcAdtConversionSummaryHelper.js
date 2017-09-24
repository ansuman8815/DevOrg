/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcAdtConversionSummaryHelper, js front-end helper for HcAdtConversionSummary component.
 * @since 198
 */
({
    MSG_TYPE: "CanPatConvStatus",

    setupHeaders: function(component){
        var nameLabel = $A.get("$Label.HealthCloudGA.Field_Label_Candidate_Patient_Name");
        var mrnLabel = $A.get("$Label.HealthCloudGA.Field_Label_MRN");
        var coordLabel = component.get('v.coordinatorRole').toUpperCase();
        var colHeaders = [
            {name:"name", label:nameLabel, sortOrder:"", isSortable:true},
            {name:"mrn", label:mrnLabel, sortOrder:"", isSortable:true},
            {name:"coordinator", label:coordLabel, sortOrder:"", isSortable:false},
        ];
        component.set('v.headerColumns',colHeaders);
    },

    sortBy: function(component,colId){
        var ascending = true;
        var columns = component.get('v.headerColumns');
        for (var i = 0; i < columns.length; i++) {
            var column = columns[i];
            if (colId === column.name) {
                if (column.sortOrder == '') {
                    column.sortOrder = 'A';
                } else if (column.sortOrder == 'D') {
                    column.sortOrder = 'A';
                } else {
                    column.sortOrder = 'D';
                    ascending = false;
                }
            }
            else{
                column.sortOrder = '';
            }
        }
        component.set('v.headerColumns', columns);

        var records = component.get('v.entries');
        records.sort(function(a, b) {
            var aVal = a[colId],
                bVal = b[colId],
                ret = 0;

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
        component.set('v.entries',records);
    }
})