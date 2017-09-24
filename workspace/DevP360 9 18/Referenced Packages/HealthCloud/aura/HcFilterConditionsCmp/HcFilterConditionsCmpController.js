/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcFilterConditionsCmpController, controller class for HcFilterConditionsCmp Component.
 * @since 196
 */
({
    doInit: function(component, event, helper) {
        var helpUrl = $A.get("$Label.HealthCloudGA.Link_Advanced_Filter_Logic")+$A.get("$Locale.langLocale");
        component.set("v.helpUrl", helper.sanitize(helpUrl));
        helper.initializeFilterBuilder(component);
    },

    doFetchInit: function(component, event, helper) {
        var filterId = component.get("v.filterId");

        // edit existing list & criteria
        if (undefined != filterId && filterId != "") {
            //This will be removed once the functioanlity is up and running completely
            //Can be sent to the component directly from the patient list view when
            //HcFilterCriteriaBaseModalCmp is created dynamically
            helper.fetchFilterString(component);
            helper.populateFilterBuilder(component);

            component.set("v.isEdit", true);
            
            component.set("v.showSpinner", true);
        }
    },

    addRow: function(component, event, helper) {
        helper.addFilterBuilder(component);
    },

    handleDeleteFilterCond: function(component, event, helper) {
        helper.deleteFilterCond(component, event);
    }
})