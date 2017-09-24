/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcMultiDropdownCmpController, js front-end controller for HcMultiDropdownCmp component.
 * @since 198
 */
({
    onItemCheckboxClick: function(component, event, helper) {
        let clickId = event.currentTarget.id;

        let checkboxes = component.find('health1-multiselectDropdownItem-input');

        if (!$A.util.isUndefinedOrNull(checkboxes) && !Array.isArray(checkboxes)){
            checkboxes = [checkboxes];
        }

        for(let i=0; i<checkboxes.length; i++ ){
            if (checkboxes[i].get('v.value')==clickId){
                let checked = checkboxes[i].get('v.checked');

                let selectedItems = component.get('v.selectedItems');
                selectedItems = helper.updateSelectedItems(selectedItems,clickId,!checked);

                checkboxes[i].set('v.checked', !checked);
                component.set('v.selectedItems',selectedItems);
                helper.filterOnChanged(component,(checked?null:clickId));
                break;
            }
        }
    }
})