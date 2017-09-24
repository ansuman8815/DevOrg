({
    onInit : function(component, event, helper){
        helper.getSurveys(component, event);
    },
    showList : function(component, event, helper) {
        component.set("v.activeComponentId", 'SurveyList');
        helper.getSurveys(component, event);
    },
    showDetails : function(component, event, helper) {
        helper.showSurveyDetails(component, event);
    }
})