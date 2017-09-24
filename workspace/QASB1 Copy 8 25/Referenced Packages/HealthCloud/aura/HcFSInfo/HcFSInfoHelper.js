({
    getFields: function(component, helper) {
        var action = component.get("c.getFields");
        var typeName = component.get("v.sObjectName");
        var fsName = component.get("v.fieldSetName");
        var recordId = component.get("v.recordId");
        var recordType = component.get("v.recordType");
        var self = this;
        action.setParams({typeName: typeName, fsName: fsName, recordTypes: recordType,recordId : recordId,operation : "EDIT"});
        action.setCallback(this, function(a) {
            var fields = a.getReturnValue();
            if(fields == null)
                fields = [];
            component.set("v.fields", fields);
            if(this.showLayout){
                this.showLayout(component, helper);
            }
        });

        $A.enqueueAction(action);
    },
})