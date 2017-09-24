({
	onTaskSelect : function(component, onchange) {
		var taskSelected = component.get("v.record.recordData.IsClosed");
        var subjectComp = component.find("subjectId");
        if(taskSelected){
           $A.util.addClass(subjectComp,"hc-text-decoration-subject"); 
        }
        else{
           $A.util.removeClass(subjectComp,"hc-text-decoration-subject"); 
        }
        if(onchange){
            var compEvent = component.getEvent("checkBoxSelectionEvent");
            var recId = component.get("v.record.recordData.Id");
            compEvent.setParam("taskId",recId);
            compEvent.setParam("selected", taskSelected);
            compEvent.fire();
        }
	}
})