/*
 * Copyright © 2017 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCommunityTImelineListViewController
 * @since 210
 */
({
    onInit : function(component, event, helper) {
        helper.loadTimeline(component, event, helper, component.get("v.filterString"));
    },
    handleShowMore : function(component, event, helper) {
        //update page number
        component.set("v.pageNumber", component.get("v.pageNumber")+1);
        helper.loadTimeline(component, event, helper, component.get("v.filterString"));
    },
    handleEventChange: function(component, event, helper) {
        //reset the pageNumber, records and flags
        component.set("v.pageNumber", 1);
        component.set("v.records", []);
        component.set("v.hasMoreRecords", true);
        component.set("v.hasLimitReached", false);
        helper.loadTimeline(component, event, helper, component.get("v.filterString"));
    }
})