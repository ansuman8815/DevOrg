({
    isSurveyEnabled: function(component) {
        var self = this;

        var rpc = component.get("c.isSurveyEnabled");

        rpc.setCallback(this, function(action) {
            if (action.getState() === "SUCCESS") {
                var isSurveyEnabled = action.getReturnValue();
                component.set("v.isSurveyEnabled", isSurveyEnabled);
            } else {
                self.handleError(component, action.getError());
            }
        })

        $A.enqueueAction(rpc);
    },

    handleActive: function(component, event) {
        var self = this;
        var tab = event.getSource();
        var tabId = tab.get('v.id');

        if (tabId == 'availableToSend' && !component.get("v.isAvailableToSendTabLoaded")) {
            $A.createComponent("HealthCloudGA:HcSurveysAvailableToSendCmp", {
                    "startT": new Date().getTime(),
                    "patientId": component.get("v.patientId")
                },
                function(contentComponent, status, error) {
                    if (status === "SUCCESS") {
                        tab.set('v.body', contentComponent);
                        // prevent future activation once loaded
                        component.set("v.isAvailableToSendTabLoaded", true);
                    } else {
                        var errorMessage = $A.get("$Label.HealthCloudGA.Items_Display_Error");
                        var messageBody = {
                            message: errorMessage
                        };
                        self.showToast(component, messageBody, true,'error');
                        console.error(errorMessage, error);
                    }
                }
            );
        }
    }
})