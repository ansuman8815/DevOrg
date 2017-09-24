/*
 * Copyright © 2017 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCommunityTimeline
 * @since 210
 */

({
    populateCategories: function(component, event, helper){
        var action = component.get("c.getFilters");
        //since filter config is not expected to change frequently, making the server-side action as storable to use cache
        action.setStorable(true);
        component.set("v.showSpinner", true);
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                var records = response.getReturnValue();
                
                if (!$A.util.isUndefinedOrNull(records) && records.length > 0) {

                    var filterCategories = [];
                    var eachCat = new Object();
                    var catItemArr = new Array();
                    for (let item of records) {
                        var eachItem = new Object();
                        eachItem.id = item;
                        eachItem.friendlyName = item;
                        eachItem.selected = true;
                        catItemArr.push(eachItem);
                    }

                    eachCat.key = "Config Types";
                    eachCat.lValue = catItemArr;
                    filterCategories.push(eachCat);
                    component.set("v.filterCategories", filterCategories);
                    component.set("v.filters", records);

                }
                else {
                    // no configs for empower/language
                    component.set("v.timelineConfigsForEmpower", false);
                }
            } else {
                component.set("v.errorMsg", $A.get("$Label.HealthCloudGA.Msg_Error_Filter_Record_List"));
            }
            component.set("v.showSpinner", false);
        });

        $A.enqueueAction(action);
    },

    getStringForList: function(records, separator){
        var returnVal = "";
        if(!$A.util.isUndefinedOrNull(records) && records.length > 0){
            for(var i=0; i<records.length; i++){
                returnVal  = returnVal + records[i] + separator;
            }
            returnVal = returnVal.substring(0, returnVal.length-1);
        }
        return returnVal;
    }
   
})