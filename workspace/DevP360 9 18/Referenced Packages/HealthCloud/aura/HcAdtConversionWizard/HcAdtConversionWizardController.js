/** Copyright © 2015 salesforce.com, inc. All rights reserved.
  * @copyright This document contains proprietary and confidential information and shall not be reproduced,
  * transferred, or disclosed to others, without the prior written consent of Salesforce.
  * @description HcAdtConversionWizardController, js front-end controller for HcAdtConversionWizard component.
  * @since 198
  */
({
    onPrevious: function(component, event, helper) {
        var tabset = component.find("navigationTabset");
        var current = tabset.get("v.selectedTabId");
        var currentIndex = helper.TAB_LIST.indexOf(current);
        if (currentIndex-1>=0) {
            tabset.set("v.selectedTabId", helper.TAB_LIST[currentIndex - 1]);
        }
    },

    onNext: function(component, event, helper) {
        var tabset = component.find("navigationTabset");
        var current = tabset.get("v.selectedTabId");
        var currentIndex = helper.TAB_LIST.indexOf(current);
        if ((currentIndex+1)<helper.TAB_LIST.length) {
            tabset.set("v.selectedTabId", helper.TAB_LIST[currentIndex + 1]);
        }
    },

    onFinish: function(component, event) {
        component.find('summary').submit();
        var modal = component.find("modal");
        modal.set('v.isShow', false);
    },

    onTabActivated: function(component, event) {
        component.find('modal').set('v.index', parseInt(event.source.get('v.name')));
    }
})