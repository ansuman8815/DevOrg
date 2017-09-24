({
	onInit : function(component, event, helper) {
        helper.onTaskSelect(component,false);
        var recordData = component.get("v.record").recordData;
        var maxNumberOfFields = component.get("v.maxNumberOfFields");
        var validFieldIndex = 0;
        var fields = component.get("v.record.objectFields");
        var showMore = false;
        for(var i=0;i<fields.length;i++){
            var fieldApi = fields[i].fieldApi;
            if(fieldApi !== 'Subject' && fieldApi !== 'IsClosed' && fieldApi !== 'ActivityDate'){
                var fieldValue = recordData[fieldApi];
                if(!$A.util.isUndefinedOrNull(fieldValue)){
                    validFieldIndex++; 
                }
            }
        }
        showMore = validFieldIndex > maxNumberOfFields ? true : false;
        component.set("v.showMore",showMore);
    },
    
    showMore : function(component, event, helper) {
		component.set("v.maxNumberOfFields",100);
        var rec = component.get("v.record");
        component.set("v.record",{});
        component.set("v.record",rec);
        component.set("v.showMore",false);
	},
    
    onTaskSelect : function(component, event, helper) {
        helper.onTaskSelect(component,true);
	}
})