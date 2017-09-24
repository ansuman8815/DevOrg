/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcMultiSelectDropdownCmpController, js front-end controller for HcMultiSelectDropdownCmp component.
 * @since 196
 */
({
    //Options load
    doInit: function(component, event, helper) {
        helper.fetchCategoryMap(component);

    },
    selectedItem: function(component, event, helper) {
        helper.selectedItem(component, event);
    }
})