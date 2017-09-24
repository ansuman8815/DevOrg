/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCareTeamSearchMemberTableCmpController, controller class for HcCareTeamSearchMemberTable Component.
 * @since 196
 */
({
    onTabClick: function(component, event, helper) {
        var internalTab = document.getElementById("health1-careteamsearch-internal--tab");
        var internalTabDataTable = document.getElementById("health1-careteamsearch-internal--datatable");
        var externalTab = document.getElementById("health1-careteamsearch-external--tab");
        var externalTabDataTable = document.getElementById("health1-careteamsearch-external--datatable");
        var selectedTab = component.get("v.selectedTab");

        if (null == selectedTab || selectedTab == "") {
            //Toggle internal Table Classes
            $A.util.addClass(internalTab, "slds-active");
            $A.util.addClass(internalTabDataTable, "slds-show");
            $A.util.removeClass(internalTabDataTable, "slds-hide");
            component.set("v.selectedTab", "INTERNAL");

        } else if (selectedTab == "INTERNAL") {
            helper.onInternalTabClick(component, event, helper);
            helper.retrieveInternalUsers(component);
        } else if (selectedTab == "EXTERNAL") {
            helper.onExternalTabClick(component, event, helper);
            helper.retrieveExternalUsers(component);
        }        
    },

    onInternalTabClick: function(component, event, helper) {
        helper.onInternalTabClick(component, event, helper);
        helper.retrieveInternalUsers(component);
    },

    onExternalTabClick: function(component, event, helper) {
        helper.onExternalTabClick(component, event, helper);
        helper.retrieveExternalUsers(component);
    },
    
    toggleSpinner: function(component, event, helper) {
        helper.toggleSpinner(event.getParam("isVisible"), component);
    }

})