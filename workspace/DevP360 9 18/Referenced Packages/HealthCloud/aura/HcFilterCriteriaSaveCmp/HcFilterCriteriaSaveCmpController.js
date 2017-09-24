/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcFilterCriteriaSaveCmpController, controller class for HcFilterCriteriaSaveCmp Component.
 * @since 196
 */
({
    doInit: function(component, event, helper) {
        var filterId = component.get("v.filterIdString");
        if (undefined != filterId || filterId != "")
            helper.getFilterName(component);
    }
})