/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description modalController, js front-end controller for modal component.
 * @since 198
 */
({
    doInit: function(component, event, helper) {
        var confirmationMessage = component.get('v.confirmationMessage');
        if(!$A.util.isEmpty(confirmationMessage)) {
          $A.createComponent('ui:outputText', {
              value: confirmationMessage,
              class: 'slds-align--absolute-center'
            }, 
            function(cmp, status, statusMessage) {
              if(status === 'SUCCESS') {
                component.set('v.body', cmp);
              }
            });
        }
    },

    onModalToggled: function(component, event, helper) {
        helper.noBodyScroll(component);
        if(!$A.util.isEmpty(component.get('v.confirmationMessage')) && component.set('v.isShow') === false) {
          component.destroy();
        }
    },

    onCancelClicked: function(component, event, helper) {
        component.set('v.isShow', false);
        var cancelEvent = component.getEvent("cancelEvent");
        cancelEvent.fire();
    },

    onBackClicked: function(component, event, helper) {
        var index = component.get('v.index');
        component.set('v.index', index-- >= 1 ? index : 1);
        var backEvent = component.getEvent("backEvent");
        backEvent.fire();
    },

    onNextClicked: function(component, event, helper) {
        if(component.get("v.allowNavigation")){
          var index = component.get('v.index');
          var count = component.get('v.count');
          component.set('v.index', index++ <= count ? index : count);
          var nextEvent = component.getEvent("nextEvent");
          nextEvent.fire();
        }
        else{
          var nextEvent = $A.get("e.HealthCloudGA:HcFilterCriteriaBaseEvent");
          nextEvent.setParams({"action":"next"})
          nextEvent.fire();
        }
    },

    onFinishClicked: function(component, event, helper) {
        var finishEvent = component.getEvent("finishEvent");
        finishEvent.fire();
        // Hide on finish if it is a confirmation modal
        if(!$A.util.isEmpty(component.get('v.confirmationMessage'))) {
          component.set('v.isShow', false);
        }
    }
})