/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCareTeamEnablCommCmp Component
 * @since 196
 */
({
    doInit: function(component, event, helper) {
        component.set("v.contentMessage", "Are you sure you want to add " + component.get("v.memberObj").name + " to the community?");
    },
    onSubmit: function(component, event, helper) {
        helper.onSubmit(component, event, helper);
    }
})