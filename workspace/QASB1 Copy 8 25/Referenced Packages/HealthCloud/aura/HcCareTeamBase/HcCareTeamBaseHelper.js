/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCareTeamBaseHelper, helper class for HcCareTeamBase Component.
 * @since 196
 */
({

    showDetailComponent: function(component, event) {

        var nodeObj = event.getParam("nodeObj");
        component.set("v.memberObj", nodeObj);
        if (!component.get('v.detailCmpInitDone')) {
            this.createDetail(component, true);
        } else {
            var ele = component.find('health1-careteamdetail').getElement();
            $A.util.removeClass(ele, "slds-hide");
            $A.util.removeClass(ele, "fadeOutRight");
            $A.util.addClass(ele, "fadeInRight");
        }
    },

    createDetail: function(cmp, show) {
        $A.createComponent("HealthCloudGA:HcCareTeamDetailCmp", {
                "aura:id": "HcCareTeamDetail",
                "HcCareTeamEvent": cmp.getReference("c.handleCareTeamDetailEvent"),
                "memberObj": cmp.getReference("v.memberObj")
            },
            function(detailComponent, status, errorMessage) {
                if (status === "SUCCESS") {
                    var content = cmp.find("health1-careteamdetail");
                    content.set("v.body", detailComponent);
                    cmp.set('v.detailCmpInitDone', true);
                    if (show) {
                        $A.util.removeClass(content, "slds-hide");
                        $A.util.removeClass(content, "fadeOutRight");
                        $A.util.addClass(content, "fadeInRight");
                    }
                } else {
                    //TODO Error loading Detail Component
                }
            }
        );
    },

    showModalComponent: function(component, event, componentMarkup, caseId) {
        var memberObj = component.get("v.memberObj");
        $A.createComponent(componentMarkup, {
                memberObj: memberObj,
                isHealthConsole: "true",
                caseId: caseId,
                carePlanId: caseId,
                AssignedTo: memberObj ? memberObj.memberId : "",
                fromWhere: "CareTeam",
                userDateFormat: component.get('v.userDateFormat'),
                userDateTimeFormat: component.get('v.userDateTimeFormat')
            },
            function(view, status, errorMessage) {
                component.set("v.modal", view);
            });
    },

    hideDetailComponent: function(component, event) {
        var ele = document.getElementById("health1-careteamdetail");
        $A.util.addClass(ele, "fadeOutRight");
        $A.util.addClass(ele, "slds-hide");
        $A.util.removeClass(ele, "fadeInRight");
    },

    handleCareTeamDetailEvent: function(component, event) {
        var ele = document.getElementById("health1-careteamdetail");
        if (event.getParam("type") === "CANCEL") {
            this.hideDetailComponent(component, event);
        } else if (event.getParam("type") === "REMOVE") {
            var removeMarkup = "HealthCloudGA:HcCareTeamRemoveModalCmp";
            this.showModalComponent(component, event, removeMarkup);
        } else if (event.getParam("type") === "NODECLICK") {
            console.log("Information from care team member Node Click: " + event.getParam("message"));

            //Obtain care team member id/info from above message and set component userId
            this.showDetailComponent(component, event);
        } else if (event.getParam("type") === "REMOVEMODAL") {
            var msg = event.getParam("message");
            this.resetModalComponent(component, event);
            component.set("v.memberObj", "");
            this.hideDetailComponent(component, event);
            var refreshEvent = $A.get("e.HealthCloudGA:HcComponentStatusEvent");
            refreshEvent.setParams({
                "type": "REFRESH_NETWORK",
                "message": msg,
                "status": "SUCCESS"
            });
            refreshEvent.fire();
        } else if (event.getParam("type") === "AddMember") {
            var caseId = event.getParam("message");
            var addMarkup = "HealthCloudGA:HcCareTeamAddMember";
            this.showModalComponent(component, event, addMarkup, caseId);
        } else if (event.getParam("type") === "CANCELMODAL") {
            this.resetModalComponent(component, event);
        } else if (event.getParam("type") === "TASK") {
            var taskMarkup = "HealthCloudGA:HcTask";
            var memberObj = component.get("v.memberObj");
            var caseId = memberObj ? memberObj.parentId : "";

            this.showModalComponent(component, event, taskMarkup, caseId);
        } else if (event.getParam("type") === "EnableCommunity") {
            console.log("show EnableCommunity modal");
            this.showModalComponent(component, event, "HealthCloudGA:HcCareTeamEnableCommCmp");
        } else if (event.getParam("type") === "DirectMessage") {
            console.log("show Direct Message modal");
            this.showModalComponent(component, event, "HealthCloudGA:HcCareTeamDirectMessageCmp");
        } else if (event.getParam("type") === "EditContact") {
            var memberObj = component.get("v.memberObj");
            var contactId = memberObj.memberId;
            HC.invokeEditRecord( null,memberObj.Name, contactId );
        } else if (event.getParam("type") === "ENABLE_COMM_SUCCESS") {
            component.set("v.memberObj", "");
            this.hideDetailComponent(component, event);
            var refreshEvent = $A.get("e.HealthCloudGA:HcComponentStatusEvent");
            refreshEvent.setParams({
                "type": "REFRESH_NETWORK",
                "message": "Successfully Enabled Community user"
            });
            refreshEvent.fire();
        }
    },
    resetModalComponent: function(component, event) {
        var modal = component.get('v.modal');
        if (modal != undefined && modal.length > 0) {
            component.set('v.modal', []);
        }
    },

    getGlobalSettings: function(component, helper) {
        var self = this;
        var action = component.get("c.getGlobalSettings");
        var role;

        action.setCallback(this, function(response) {
            if (action.getState() === "SUCCESS") {
                var returnVal = response.getReturnValue();
                role = returnVal.PATIENT_ROLE;
                component.set("v.patientRole", role);
            } else {
                self.handleError(component, action.getError());
            }
        });
        $A.enqueueAction(action);
    }
})