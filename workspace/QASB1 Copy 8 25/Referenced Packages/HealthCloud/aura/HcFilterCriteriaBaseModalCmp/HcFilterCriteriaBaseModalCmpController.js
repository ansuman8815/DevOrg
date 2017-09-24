/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcFilterCriteriaBaseModalCmpController, controller class for HcFilterCriteriaBaseModalCmp Component.
 * @since 196
 */
({
    doInit: function(component, event, helper) {
        var filterId = component.get("v.filterId");
        var configObject = component.get("v.configObject"); //TODO : replace filterId with configObect.filterId

        if (undefined != filterId && filterId != "") {
            component.set("v.header", $A.get("$Label.HealthCloudGA.Header_Edit_List"));
        }
    },

    nextButton: function(component, event, helper) {
        var filterCriteriaCmp = component.find('filterCriteriaCmp');
        var selectedTab = filterCriteriaCmp.get("v.selectedTab").trim();

        // hide buttons and show spinner while we process
        helper.pleaseWait(component, true, 'modalCmp');
        if (selectedTab == 'tab1') {
            if (helper.validateFilterList(component, event, helper)) {

                helper.validateGroupingAndProceed(component,event,helper);

            } else {
                helper.showModalToast(component,$A.get("$Label.HealthCloudGA.Msg_Missing_Required_Fields") );
            }
        } else if (selectedTab == 'tab2') {
            filterCriteriaCmp.set("v.selectedTab", "tab3");
            filterCriteriaCmp.set("v.nextButtonLabel", $A.get("$Label.HealthCloudGA.Button_Label_Save"));
            helper.calculateIndex(component,event,helper);
        } else if (selectedTab == 'tab3') {
            //CREATE FILTER and CLOSE WINDOW or RETURN to PARENT
            //VALIDATION for tab3
        }
        // hide spinner & show buttons
        helper.pleaseWait(component, false, 'modalCmp');
    },

    saveResult: function(component, event, helper) {
        helper.pleaseWait(component, true, 'modalCmp');
      if (helper.validateFilterName(component, event, helper)) {
          helper.createUpdateFilterList(component, event, helper);

      } else {
          component.set('v.toastObj', {
              'type': 'error',
              'message': $A.get("$Label.HealthCloudGA.Msg_Missing_Required_Fields")
          });
      }
      helper.pleaseWait(component, false, 'modalCmp');
    },

    backButton: function(component, event, helper) {
        var filterCriteriaCmp = component.find('filterCriteriaCmp');
        var selectedTab = filterCriteriaCmp.get("v.selectedTab").trim();

        if (selectedTab == 'tab3') {
            if($A.util.isEmpty(component.get("v.configObject"))) {
                filterCriteriaCmp.set("v.selectedTab", "tab2");
                filterCriteriaCmp.set("v.nextButtonLabel", $A.get("$Label.HealthCloudGA.Button_Label_Next"));
            }
            else{
                filterCriteriaCmp.set("v.selectedTab", "tab1");
                component.set('v.index',1);
                filterCriteriaCmp.set("v.nextButtonLabel", $A.get("$Label.HealthCloudGA.Button_Label_Next"));
            }
        } else if (selectedTab == 'tab2') {
            filterCriteriaCmp.set("v.selectedTab", "tab1");
        }
    },

})