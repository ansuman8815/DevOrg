/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcAdtConversionDupCheckController, js front-end controller for HcAdtConversionDupCheck component.
 * @since 198
 */
({
    init: function(component, event, helper) {
        helper.setupHeaders(component);

        helper.checkDuplicate(component);
    },

    handleSort: function(component,event,helper){
        if (event.currentTarget && event.currentTarget.dataset.id) {
            var colId = event.currentTarget.dataset.id;
            component.set("v.showSpinner",true);
            helper.sortBy(component,colId);
            component.set("v.showSpinner",false);
        }
    }
})