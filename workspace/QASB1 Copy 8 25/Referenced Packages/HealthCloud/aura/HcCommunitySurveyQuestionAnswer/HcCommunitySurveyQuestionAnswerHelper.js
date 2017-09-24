/* * Copyright © 2017 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description helper for HcCommunitySurveyQuestionAnswer component
 * @since 210.
*/
({
    init: function(component, event, helper) {
        component.set("v.questionAnswerRows", []);
        component.set("v.showMore",true);
        this.loadSurveyQuestionAnswer(component, event, component.get("v.pageIndex"));
    },
    
	loadSurveyQuestionAnswer : function(component, event, pageIndex) {
        var action = component.get("c.getSurveyQuestionAnswerDetails");
        var responseID = component.get("v.surveyResponseId");
        action.setParams({
            "surveyResponseId": component.get("v.surveyResponseId"),
            "numOfRecords": component.get("v.recordCount").toString(),
            "pageIndex": pageIndex.toString()
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var returnObj = response.getReturnValue();
                this.populateData(component, returnObj);
            }
        });
        $A.enqueueAction(action);
		
	},
    
    populateData : function(component, returnedData) {
        //set the component attributes from returnObj
        //component.set("v.questionAnswerRows",returnedData);
        var recordCount = component.get("v.recordCount");
        if (!$A.util.isUndefinedOrNull(returnedData)) {
            var existingData = component.get("v.questionAnswerRows");
            if(existingData != null){
                var dataToadd = returnedData.length -1;
                if(returnedData.length <= recordCount){
                    dataToadd = returnedData.length;
                    component.set("v.showMore",false);
                }
                for(var i=0 ; i<dataToadd ; i++){
                    existingData.push(returnedData[i]);
                }
                component.set("v.questionAnswerRows", existingData);
            }else{
                if(returnedData.length > recordCount){
                    for(var i=0 ; i<returnedData.length-1 ; i++){
                        existingData.push(returnedData[i]);
                    }
                }
                else{
                    for(var i=0 ; i<returnedData.length ; i++){
                        existingData.push(returnedData[i]);
                    }
                    component.set("v.showMore",false);
                }
                component.set("v.questionAnswerRows", existingData);
            }
            component.set("v.showSpinner",false);
        }
    }
})