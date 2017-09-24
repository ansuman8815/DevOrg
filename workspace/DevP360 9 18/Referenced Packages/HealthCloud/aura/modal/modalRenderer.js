/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description modalRenderer, custom renderer for modal component.
 * @since 198
 */
({
    afterRender: function(component, helper) {
        //set id attribute for aria-controls
        helper.noBodyScroll(component);
        this.superAfterRender();
    },

    unrender: function(component, helper) {
        //set isShow attribute to trigger and animate close of modal
        component.set('v.isShow', false);
        this.superUnrender();
    }
})