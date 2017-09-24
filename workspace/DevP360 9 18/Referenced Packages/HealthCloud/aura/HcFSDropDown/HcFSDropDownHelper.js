/*
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description helper for the dropdown controller
 * @since 198
*/

({
    addListHandlers: function (component) {
        var selectContainer = component.find("selectContainer").getElement();
        if (component.get("v.selectContainerCSS") != "") {
            $A.util.addClass(selectContainer, component.get("v.selectContainerCSS")); 
        }
    }
})