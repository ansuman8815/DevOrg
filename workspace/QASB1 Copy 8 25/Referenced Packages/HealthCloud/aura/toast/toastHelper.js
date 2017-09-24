/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description toastHelper, js front-end helper for generic toast component.
 * @since 198
 */
({
    autoHide: function(component) {
        var self = this;
        if(component.get('v.typeClass') === 'slds-theme--success' || component.get('v.autoHideErrorAndWarning') == true){
            window.setTimeout(function () {
                self.toggleToastClassHide(component);
            }, component.get('v.timeout'), component);
        }
    },
    
    toggleToastClassHide: function(component) {
        $A.util.addClass(component, 'slds-fall-into-ground');
        $A.util.removeClass(component, 'slds-rise-from-ground');
    },

    toggleToastClassShow: function(component) {
        $A.util.removeClass(component, 'slds-fall-into-ground');
        $A.util.addClass(component, 'slds-rise-from-ground');
    },

    setToastType: function(component, event) {
        var type = event.getParams().value.type.toLowerCase();
        switch (type) {
            case 'normal':
                component.set('v.typeClass', '');
                return true;
            case 'success':
                component.set('v.typeClass', 'slds-theme--success');
                return true;
            case 'warning':
                component.set('v.typeClass', 'slds-theme--warning');
                return true;
            case 'error':
                component.set('v.typeClass', 'slds-theme--error');
                return true;
        }
        return false;
    }
})