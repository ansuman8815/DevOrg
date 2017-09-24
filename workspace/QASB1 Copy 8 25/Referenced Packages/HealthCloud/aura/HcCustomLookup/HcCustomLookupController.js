/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCustomLookupController, js front-end controller for HcCustomLookup component.
 * @since 198
 */
({
    doInit: function(component, event, helper) {
        var recId = component.get("v.selectedId");
        var sObjectName = component.get("v.Sobject");
        if (recId != 'null' && recId != '' && recId != $A.get("$Label.HealthCloudGA.Text_Lookup_NoResults") && !$A.util.isEmpty(sObjectName) ) {
            helper.retrieveData(component);
        }
    },

    searchRecords: function(component, event, helper) {
        component.set("v.renderResult", false);
        component.set("v.errorMsg","");
        var lookupValue = component.find("lookupValue").getElement().value.trim();
        var specialChars = "*?";
        var str = lookupValue;
        for (var i = 0; i < specialChars.length; i++) {
            str = str.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
        }
        if(str.length==1){
            component.set("v.errorMsg",$A.get("$Label.HealthCloudGA.Msg_Member_Search"));
        }
        else{
            helper.searchRecords(component, lookupValue); 
        }
    },
    searchRecordsOnKeyUp: function(component, event, helper) {
        component.set("v.errorMsg","");
        component.set("v.renderResult", false);
        var allowSearchOnEnter = component.get("v.allowSearchOnEnter");
        var allowKeyUpSearch = component.get("v.allowKeyUpSearch");

        var lookupValue = '';
        var lookupElement = component.find("lookupValue").getElement();
        if (!$A.util.isUndefined(lookupElement)) {
            lookupValue = lookupElement.value.trim();
        }
        var specialChars = "*?";
        var str = lookupValue;
        for (var i = 0; i < specialChars.length; i++) {
            str = str.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
        }
        if(str.length==1){
            component.set("v.errorMsg",$A.get("$Label.HealthCloudGA.Msg_Member_Search"));
        }
        else{
            if (allowKeyUpSearch) {
                helper.searchRecords(component, lookupValue);
            } else if (allowSearchOnEnter) {
                if (helper.isEnterKeyPressed(event)) {
                    helper.searchRecords(component, lookupValue);
                }
            }
        } 
    },

    toggleLookupList : function(component, event, helper) {
        if(event.type === "blur") {
            component.set("v.renderResult", false);
        }
    },
    
    processSelected: function(component, event, helper) {
        var theTarget = event.srcElement || event.target;
        var selId = HC.getDataAttribute(theTarget, "role");
        var selName = theTarget.innerText;
        component.set("v.renderResult", false);
        if (!$A.util.isUndefinedOrNull(selId)) {
            component.set("v.selectedId", selId);
            helper.processSelected(component, selId, selName);
        }
    }
})