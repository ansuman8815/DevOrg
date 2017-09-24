/* * Copyright © 2017 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description client controller for HcCommunitySurveyQuestionAnswer component
 * @since 210.
*/
({
	onInit: function(component, event, helper) {
        helper.init(component, event, helper);
	},
    
    handleMore: function(component,event,helper){
      var pageIndex = component.get("v.pageIndex") + 1;
      if(!$A.util.isUndefinedOrNull(pageIndex)){
        component.set("v.pageIndex",pageIndex);
        helper.loadSurveyQuestionAnswer(component, event, component.get("v.pageIndex"));
      }
    }
})