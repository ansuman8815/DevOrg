/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCareTeamRemoveModalCmpController, controller class for HcCareTeamRemoveModalCmp Component.
 * @since 196
 */
({
    onRemove: function(component, event, helper) {
        helper.removeMember(component, event, helper);
    }
})