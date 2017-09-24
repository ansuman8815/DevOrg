/* Copyright © 2015 salesforce.com, inc. All rights reserved.
* @copyright This document contains proprietary and confidential information and shall not be reproduced,
* transferred, or disclosed to others, without the prior written consent of Salesforce.
* @description TcTextViewer controller, show and hides expanded text
* @since 198
*/

({
    doInit: function(component, event, helper) {
        helper.initialize(component);
    },
    showHide: function(component, event, helper) {
        helper.showHide(component);
    }
})