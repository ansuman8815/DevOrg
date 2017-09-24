({
    doInit : function(component, event, helper) {
        var action = component.get("c.getSourceValue");
        action.setParams({"patientId":component.get("v.patientid"),"empi":component.get("v.empi")});
        action.setCallback(this, function(data) {
            var res = data.getReturnValue();
            component.set("v.sourceSystem" , res);
            
        });
        $A.enqueueAction(action);
        
        helper.getPatientData(component,event,helper, component.get("v.patientid"));
        
    },
    selectChange : function(component, event, helper) {        
        helper.getPatientData(component,event,helper, component.find('selSourceVal').get('v.value'));
    },
    mouseOverTooltip: function(component, event, helper) {        
        var a=$(".selectList").find(":selected").text();
        $(".slds-popover.slds-nubbin--left").html(a);
    },
    myAction : function(component, event, helper) {
        $('body').append('<script>svg4everybody();</script>');
    }
    
})