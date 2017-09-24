({
    onInit: function(component, event, helper) {
        // See if carePlanId has been passed to the component 
        // (via dynamic creation, custom app, etc...)
        var carePlanIdOnInit = component.get("v.carePlanId");
        // Check for recordId (passed in when on record home page)
        var recordId = component.get("v.recordId");
        // Conceptually we should not have both of these populated,
        // but we will give precedence to passed in Id (carePlanIdOnInit)
        if(!$A.util.isUndefinedOrNull(recordId) && $A.util.isEmpty(carePlanIdOnInit)) {
            carePlanIdOnInit = recordId;
            component.set("v.carePlanId", carePlanIdOnInit);
        }
        // load the care plan tasks if we have a care plan Id
       if(!$A.util.isEmpty(carePlanIdOnInit)) {
            component.set("v.showSpinner", true);
          helper.init(component, event, helper);
       }
    },

    onCarePlanChange: function (component, event, helper) {
        var carePlanId = event.getParam("carePlanId");
        if(!$A.util.isUndefinedOrNull(carePlanId)){
            component.set("v.carePlanId",carePlanId);
            helper.init(component, event, helper);
        }
    },
    handleSelect: function(component, event, helper) {
      var selVal = $A.getComponent(event.getSource().getGlobalId()).get("v.value");
      if(!$A.util.isUndefinedOrNull(selVal)){
        component.set("v.pageIndex",1);
        component.set("v.taskData", []);
        component.set("v.showMore",true);
        helper.getTasks(component, event, component.get("v.pageIndex"));
      }
    },
    handleCheckBoxSelection: function(component,event,helper){
      var taskId = event.getParam("taskId");
      var selected = event.getParam("selected");
      helper.handleCheckBoxSelection(component,taskId,selected);
    },

    handleMore: function(component,event,helper){
      var pageIndex = component.get("v.pageIndex") + 1;
      console.log('********pageIndex1 '+pageIndex);
      if(!$A.util.isUndefinedOrNull(pageIndex)){
        component.set("v.pageIndex",pageIndex);
        helper.getTasks(component, event, component.get("v.pageIndex"));
      }
    }
})