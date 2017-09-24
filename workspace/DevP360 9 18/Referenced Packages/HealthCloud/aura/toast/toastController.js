/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description toastController, js front-end controller for generic toast component.
 * @since 198
 */
({

    closebuttonOnclicked: function(component, event, helper) {
        helper.toggleToastClassHide(component);
    },

    messageUpdated: function(component, event, helper) {
        if (!helper.setToastType(component, event)) return;
        helper.toggleToastClassShow(component);
        helper.autoHide(component);
    },

    showToast: function(component, event, helper) {
        if (event.getParam("hide")) {
            helper.toggleToastClassHide(component);
        } else {
            component.set("v.autoHideErrorAndWarning", event.getParam("autoHideErrorAndWarning"));
            component.set("v.timeout", event.getParam("timeout"));
            component.set("v.content", event.getParam("content"));
        }
    },
})