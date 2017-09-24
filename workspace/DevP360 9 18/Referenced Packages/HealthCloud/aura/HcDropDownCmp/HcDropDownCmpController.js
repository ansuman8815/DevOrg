/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcDropDownCmpController, controller class for HcDropDownCmp Component.
 * @since 196
 */
({
    showList: function(component, event, helper) {
        var selectList = component.find("options").getElement();
        if ($A.util.hasClass(selectList, 'health1-dropdowncmp-dropdown-show')) return;
        $A.util.removeClass(selectList, 'health1-dropdowncmp-dropdown-hide');
        $A.util.addClass(selectList, 'health1-dropdowncmp-dropdown-show');
	},

    hideList: function(component, event, helper) {
        var selectList = component.find("options").getElement();
        $A.util.removeClass(selectList, 'health1-dropdowncmp-dropdown-show');
        $A.util.addClass(selectList, 'health1-dropdowncmp-dropdown-hide');
	},

    selectedItem: function(component, event, helper) {
        var target = (event.srcElement != undefined) ? event.srcElement : event.target;
        var value = (target.innerText != undefined) ? target.innerText.trim() : target.textContent.trim();
        component.set("v.label", value);
        var selectList = component.find("options").getElement();
        $A.util.removeClass(selectList, 'health1-dropdowncmp-dropdown-show');
        $A.util.addClass(selectList, 'health1-dropdowncmp-dropdown-hide');
	}
})