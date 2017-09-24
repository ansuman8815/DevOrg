({
    doInit : function(component, event, helper) {  
        component.set("v.showSpinner", true);  
    }, 

    handleCarePlanEvent : function(component, event, helper) {
        var type  = event.getParam('type');
        var actionName = event.getParam('actionName');
        var evtId = event.getParam('id');
        var refresh = event.getParam('refresh');
        var goalId = component.get('v.goalId');
        var dataFetchState = component.get('v.dataFetchState');

        if(type === 'action') {
            component.set('v.currentAction',actionName);
            //Since this is a app event, we get events for all instances
            if(evtId === goalId && (refresh || dataFetchState == 'IDLE')) {
                component.set("v.showSpinner",true);
                helper.getInitialData(component,event,helper,actionName);        
            }
        }
    },

    handleActionEvent: function(component, event, helper) {
        
        var actionEvent = component.get('v.actionEvent');
        var eventType = actionEvent.getParam('eventType');
        var eventSubType = actionEvent.getParam('eventSubType');

        if( eventType == 'ACTION' && eventSubType == 'EDIT' )
        {
            helper.editTask( component, actionEvent.getParam('data') );
        }
    }
     
})