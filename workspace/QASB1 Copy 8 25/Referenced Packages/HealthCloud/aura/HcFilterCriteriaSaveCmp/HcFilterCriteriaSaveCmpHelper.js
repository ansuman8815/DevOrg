/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcFilterCriteriaSaveCmpHelper, helper class for HcFilterCriteriaSaveCmp Component.
 * @since 196
 */
({
    getFilterName: function(component) {
        var filterId = component.get("v.filterIdString");
        if (filterId != "" && undefined != filterId) {
            var action = component.get("c.getFilterCriterion");
            action.setParams({
                "filterCriterionId": filterId
            });
            action.setCallback(this, function(result) {
                var res = result.getReturnValue();
                var state = result.getState();
                if (res != undefined && null != res && state === "SUCCESS") {
                    component.set("v.filterName", res);
                } else {
                    //TODO Don't have to throw an error as save validation will prompt the user to populate if blank.                 
                }
            });
            $A.enqueueAction(action);
        }
    }
})