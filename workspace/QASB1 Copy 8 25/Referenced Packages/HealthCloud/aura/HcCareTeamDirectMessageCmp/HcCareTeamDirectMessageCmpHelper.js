({
    sendMessage: function(component, event, helper) {
        var self = this;
        component.set("v.errorMsg", "");
        var member = component.get("v.memberObj");
        var memberId = member.memberId;
        //For Contact with external User
        if (member.isContact && member.externalUserId != null && member.externalUserId != '') {
            memberId = member.externalUserId;
        }

        this.rpcCall(component.get("c.postMessage"), {
            "messageToSend": component.get("v.messageToSend"),
            "toRecipients": memberId
        }, function(response) {
            if (response.getState() === "SUCCESS") {
                var returnMsg = response.getReturnValue();
                if(returnMsg !== $A.get("$Label.HealthCloudGA.Msg_Send_Private_Success")) {
                    component.find('modal').set('v.modalToast', {
                        'type': 'error',
                        'message': response.getReturnValue()
                    });
                    return;
                }

                // TODO: This part of code should fire event to notice end of the transaction
                var messageEvent = component.getEvent("HcCareTeamEvent");
                messageEvent.setParams({
                    "type": "REMOVEMODAL",
                    "message": returnMsg
                });
                messageEvent.fire();

                $A.get("e.HealthCloudGA:HcComponentStatusEvent").setParams({
                    status: "SUCCESS",
                    message: returnMsg
                }).fire();

                var modal = component.find("modal");
                modal.set('v.isShow', false);
            } else {
                component.find('modal').set('v.modalToast', {
                    'type': 'error',
                    'message': self.getErrorsFromResponse(response.getError())
                });
            }
        });
    },

    messageValidation: function(component) {
        var val = component.find("message").getElement().value.trim();
        if (val == "") {
            return false;
        }
        return true;
    },

    resetValidation: function(component) {
        component.set("v.isMessageValid", true);
    },
    
    getErrorsFromResponse : function (responseError) {
        var errors = [];
        responseError.forEach(function (error) {
            errors.push(error.message);
        });
        return errors.join(' ');
    }
})