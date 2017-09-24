/* Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcTextViewer helper
 * @since 198
 */

({
    initialize: function(component) {
        var showMore = $A.get("$Label.HealthCloudGA.Msg_Show_More");
        var showLess = $A.get("$Label.HealthCloudGA.Msg_Show_Less");
        component.set("v.showMore", showMore);
        component.set("v.showLess", showLess);
        var txtVal = component.get("v.value");
        if (typeof txtVal != 'undefined') {
            var txtDiv = component.find('Healthcare_innerDiv');
            if (txtVal.length < 200) {
                component.set("v.showToggle", false);
                $A.util.addClass(txtDiv, "Healthcare-TextViewer-cDetail");
            } else {
                component.set("v.showToggle", true);
                $A.util.addClass(txtDiv, "Healthcare-TextViewer-truncateTxt");
            }
        } else
            component.set("v.showToggle", false);

    },
    showHide: function(component) {
        var wrapDiv = component.find('Healthcare_outerDiv');
        var txtDiv = component.find('Healthcare_innerDiv');
        var show = component.get("v.show");
        if (show) {
            component.set("v.show", false);
            $A.util.removeClass(txtDiv, "Healthcare-TextViewer-truncateTxt");
            $A.util.addClass(txtDiv, "Healthcare-TextViewer-cDetail");
        } else {
            component.set("v.show", true);
            $A.util.addClass(txtDiv, "Healthcare-TextViewer-truncateTxt");
            $A.util.removeClass(txtDiv, "Healthcare-TextViewer-cDetail");
        }
    }
})