/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcMultiDropdownCmpHelper, js front-end helper for HcMultiDropdownCmp component.
 * @since 198
 */
({
    filterOnChanged: function(component,selectedItem) {
        var filterChangedEvent = component.getEvent("filterChangedEvent");
        filterChangedEvent.setParams({
            "selectedId" :  selectedItem});
        filterChangedEvent.fire();
    },

    getSelectedItems: function(component) {
        return (component.get("v.selectedItems"));
    },

    updateSelectedItems: function(selectedItems, updatedId, checked) {
        if ($A.util.isUndefinedOrNull(selectedItems)) {
            throw new Error("Item return list is undefined");
        }
        else {
            let index = selectedItems.indexOf(updatedId);
            if (checked) {
                if (index === -1) {
                    selectedItems.push(updatedId);
                }
            } else {
                if (index >= 0) {
                    selectedItems.splice(index, 1);
                }
            }
        }
        return selectedItems;
    }
})