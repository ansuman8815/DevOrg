({
    handleCarePlanEvent: function(component, event, helper) {
        if (event.getParam("type") === "EXPAND") {
            // On first click get goals will retrieve the goals and then expand
            // Subsequently (get goals === true), respond to expand click
            if (component.get("v.goalsFetched") === true) {
                helper.expand(component, event, helper);
                return true;
            } else {
                helper.getGoals(component, event, helper);
            }
        } else if (event.getParam("type") === "REFRESH") {
            helper.refresh(component, event, helper);
        }
    },
    
    expand: function(component, event, helper) {
        if (component.get("v.expandGoals") === true) {
            helper.expandGoals(component, event, helper);
        }
        component.set('v.expanded', !component.get('v.expanded'));
    }, 
    
    expandGoals: function(component, event, helper) {
        component.set("v.expandGoals", false);
        var expandCollapseEvent = $A.get("e.HealthCloudGA:HcMultipleCarePlanEvent");
        expandCollapseEvent.setParams({
            "type": "Expand all goals",
            "carePlanId" : component.get("v.carePlanId")
        });                
        expandCollapseEvent.fire();
    },

    refresh: function(component, event, helper) {
        // check if goals already retrieved
        component.set("v.showProblemSpinner", true);

        var problemIds = [];
        problemIds.push(component.get("v.problem.Id"));
        
        var action = component.get("c.getGoalsForProblems");
        action.setParams({
            problemIds: problemIds
        });

        action.setCallback(this, function(response) {
            if (response.getState() == "SUCCESS") {
                var goals = response.getReturnValue();
                if(goals != null && goals.length > 0) {
                    for(var i=0;i<goals.length;i++) {
                        if(!isNaN(goals[i].Progress__c) && goals[i].Progress__c != null ) {
                            goals[i].Progress__c =  Number(Math.floor(goals[i].Progress__c));
                        }
                    }
                } else {
                    component.set("v.showProblemSpinner", false);
                }
                component.set("v.goals", []);
                component.set("v.goals", goals);
            } else if (response.getState() === "ERROR") {
                // add exception handling
                component.set("v.infoMessage", helper.getErrorMessage(response));
            }
            
            // required to dismiss the component level spinner initiated on load
            component.set("v.showProblemSpinner", false);
        });
        $A.enqueueAction(action);
        
        return false;
    },

    getGoals: function(component, event, helper) {
        // check if goals already retrieved
        component.set("v.showProblemSpinner", true);

        var problemIds = [];
        problemIds.push(component.get("v.problem.Id"));
        
        var action = component.get("c.getGoalsForProblems");
        action.setParams({
            problemIds: problemIds
        });

        action.setCallback(this, function(response) {
            if (response.getState() == "SUCCESS") {
                var goals = response.getReturnValue();
                if(goals != null && goals.length > 0) {
                    for(var i=0;i<goals.length;i++) {
                        if(!isNaN(goals[i].Progress__c) && goals[i].Progress__c != null ) {
                            goals[i].Progress__c =  Number(Math.floor(goals[i].Progress__c));
                        }
                    }
                } else {
                    component.set("v.showProblemSpinner", false);
                }
                component.set("v.goals", goals);
            } else if (response.getState() === "ERROR") {
                // add exception handling
                component.set("v.infoMessage", helper.getErrorMessage(response));
            }
            if (component.get("v.expandGoals") === true) {
                helper.expandGoals(component, event, helper);
            }
            helper.expand(component, event, helper); 
            component.set("v.goalsFetched", true);
            // required to dismiss the component level spinner initiated on load
            component.set("v.showProblemSpinner", false);
        });
        $A.enqueueAction(action);
        
        return false;
    },

    getErrorMessage : function(response) {
        var err = response.getError();
        var errors = [];
        for(var i = 0; i < err.length; i++) {
            errors.push(err[i].message);
        }
        msg = errors.join(' ');
        if($A.util.isEmpty(msg)) {
            msg = $A.get("$Label.HealthCloudGA.Msg_Error_General");
        }

        return msg;
    }
})