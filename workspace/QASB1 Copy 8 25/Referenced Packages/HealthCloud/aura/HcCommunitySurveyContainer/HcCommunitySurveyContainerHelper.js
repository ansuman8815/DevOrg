({
	getSurveys : function(component, event) {
        var action = component.get("c.getSurveysForUser");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var returnedData = response.getReturnValue();
                if(!$A.util.isUndefinedOrNull(returnedData)){
                    component.set("v.responseData", returnedData);
                }
            }
        });
        $A.enqueueAction(action);
    },

	showSurveyDetails : function(component, event) {
        component.set("v.activeComponentId", 'SurveyDetails');
        var responseId = event.target.getAttribute("data-data");
        $A.createComponent("HealthCloudGA:HcCommunitySurveyDetailsTabSet", {
            surveyResponseId: responseId
        		},
            	function(detailComponent, status, errorMessage){
            		if(status==="SUCCESS"){
           				var content = component.find("survey-details");
            			content.set("v.body", detailComponent);
        			}
        		}
            );
    }
})