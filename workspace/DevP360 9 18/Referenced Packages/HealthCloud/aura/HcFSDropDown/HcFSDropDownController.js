/*
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description Controller for the dropdown
 * @since 198
*/

({
    onInit: function (component, event, helper) {
            helper.addListHandlers(component);
        },
        
    showList: function (component, event, helper) {
        component.set("v.renderMenu",true);
        
    },
    hideList: function (component, event, helper) {
       var selVal = event.target.innerText;
        component.set("v.selectedValue",selVal);
         component.set("v.renderMenu",false);    
    }
})