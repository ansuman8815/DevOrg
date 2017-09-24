({
	setSelectedRecordType : function(component, event, helper) {
        var recordType = event.getSource().get('v.value');
		component.set('v.selectedRecordType', recordType);
	}
})