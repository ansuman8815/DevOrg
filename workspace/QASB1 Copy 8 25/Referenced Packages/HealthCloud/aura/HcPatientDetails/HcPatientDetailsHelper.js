({
	getPatientData: function(component, helper) {
		var action = component.get("c.getPatientDetails");
		action.setBackground();
		action.setStorable();
		action.setParams({
			"contId": component.get('v.patientId')
		});
		action.setCallback(this, function(response) {
			var state = response.getState();
			if (state === "SUCCESS") {
				var result = response.getReturnValue();
				component.set('v.patientData', result);
			}
			if (state === "ERROR") {
				this.handleError(component, action.getError());
			}
		});
		$A.enqueueAction(action);
	}
})