/*
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description Controller for the patientDetailComponent
 * @since 196
 */
({
    init: function(component, event, helper) {
        var isPSLRestricted = component.get("v.isPSLRestricted");
        if(!!isPSLRestricted){
          helper.getProfileCardViews(component, helper);
          var namespace = component.toString().match(/markup:\/\/(\w{1,15}):/)[1];
          component.set('v.namespaceDash', $A.util.isEmpty(namespace) ? "" : namespace + '__');
        }
    },

    selectMenuItem: function(component,event, helper){
        var selVal = $A.getComponent(event.getSource().getGlobalId()).get("v.label");
        helper.processSelectedDropValue(component, selVal);
    },
})