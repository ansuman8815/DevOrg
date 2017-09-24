/**
 * Copyright © 2016 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * JS Controller for HcCareTeamApp
 * @since 200
 */
({
    showSystemError: function(cmp, event, helper) {
        // Prevent security errors due to chatter:feed Visualforce component
        //		from being injected into page markup (instead, display in JS console)
        helper.suppressAuraBrowserSecurityError(event);
    }
})