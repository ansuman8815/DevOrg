({
	getProfilePicUrl: function(component, helper) {
			var action = component.get("c.getPicUrl");
			var self = this;
			action.setBackground();
			action.setParams({
					"contId": component.get('v.patientId')
			});
			action.setCallback(this, function(response) {
					var state = response.getState();
					if (state === "SUCCESS") {
							var url = response.getReturnValue();
							component.set("v.picUrl", url);
					}
					if (state === "ERROR") {
							var errors = response.getError();
							if (errors) {
									if (errors[0] && errors[0].message) {
											component.set('v.errorMsg', errors[0].message);
									}
							} else {
									component.set('v.errorMsg', "Unknown error");
							}
					}
			});
			$A.enqueueAction(action);
	},
})