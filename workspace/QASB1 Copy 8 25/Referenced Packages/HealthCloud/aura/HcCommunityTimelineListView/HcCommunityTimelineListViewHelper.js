/*
 * Copyright © 2017 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCommunityTImelineListViewHelper
 * @since 210
 */
({
    loadTimeline: function(component, event, helper, filters) {
        var action = component.get("c.getPatientTimelineData");
        component.set("v.showSpinner", true);
        component.set("v.errorMsg", "");

        action.setParams({
            "carePlanId": component.get("v.carePlanId"),
            "accountId": component.get("v.patientId"),
            "pageNo": component.get("v.pageNumber").toString(),
            "pageSize": component.get("v.pageReloadSize").toString(),
            "filters": filters,
            "eventType":component.get("v.eventType")
        });
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                var existingRecords = component.get("v.records");
                component.set("v.records", this.populateActivities(component,existingRecords,response.getReturnValue()));
            } else {
                component.set("v.errorMsg", $A.get("$Label.HealthCloudGA.Msg_Error_Filter_Record_List"));
            }
            component.set("v.showSpinner", false);
        });

        $A.enqueueAction(action);
    },

    populateActivities: function(component, records, recordsToadd){
        var result = new Array();
        var pageReloadSize = component.get("v.pageReloadSize");
        var eventType = component.get("v.eventType");
        //check if there are more records to show
        var showMore = false;
        //backend call tries returning pageReloadSize+1 records if that many records exist, 
        //setting the showMore flag if returned records size is pageReloadSize+1
        if(!$A.util.isEmpty(recordsToadd) && recordsToadd.length === (pageReloadSize + 1)) {
              showMore = true;
        }

        if ($A.util.isEmpty(recordsToadd)) {
            result = records;
        } else if($A.util.isEmpty(records) && !showMore){
            result = recordsToadd ;
        } else {
            result = records;
            var newRecsToAddLength = recordsToadd.length;
            //make sure to not load more than the page size new records
            if(showMore) {
               newRecsToAddLength--;
            }
            for(var i=0 ; i<newRecsToAddLength; i++){
                result.push(recordsToadd[i]);
            }

        }
        if(result.length >= 500) {
           component.set("v.hasLimitReached" , true);
            // when limit is reached, do not show the showMore button
            showMore = false;
        }
        component.set("v.hasMoreRecords" , showMore);
        return result;
    }
})