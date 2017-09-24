/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCareTeamAddMemberHelper, helper class for HcCareTeamAddMember Component.
 * @since 196
 */
({
    showRoles: function (component) {
        var action = component.get("c.getCareTeamRole");
        var patientRole = component.get("v.patientRole");
        action.setCallback(this, function (response) {
            var member = response.getReturnValue();
            for (var i = 0; i < member.length; i++) {
                if (!$A.util.isEmpty(patientRole) && member[i].Name.toLowerCase() === patientRole.toLowerCase()) {
                    member.splice(i, 1);
                }
            }
            component.set("v.roleList", member);
            if($A.util.isEmpty(member) || member.length == 0) {
                var errorMessage = $A.get("$Label.HealthCloudGA.Msg_Error_Create_Care_Team");
                component.find('modal').set('v.modalToast', {
                            'type': 'error',
                            'message': errorMessage
                });
            }
        });
        $A.enqueueAction(action);
    },

    finishButtonClicked: function (component, event) {
        if (component.get("v.createMember")) {
            this.createMember(component, event);
        } else {
            this.addMemberToCareTeam(component, event);
        }
    },

    addMemberToCareTeam: function (component, event) {
        var memToAdd = component.get("v.selectedObj");

        if (null == memToAdd || memToAdd == undefined || null == memToAdd.id || undefined == memToAdd.id) {
            return;
        }
        var action = component.get("c.addTeamMember");
        var caseId = component.get("v.caseId");
        var roleList = component.get("v.roleList");

        var teamRoleId = component.find("health1-careteamrole-select").getElement().value;

        var enableCommunity = false;
        var communityComp = component.find("community-checkbox");
        if ( !$A.util.isUndefinedOrNull( communityComp ) && communityComp.get('v.value')) {
            enableCommunity = true;
        }
        action.setParams({
            "caseId": caseId,
            "memberId": memToAdd.id,
            "teamRoleId": teamRoleId,
            "isExternal": false,
            "enableCommunity": enableCommunity,
            "isCommunityEnabled": !enableCommunity

        });
        action.setCallback(this, function (response) {
            var memberObj = {};
            memberObj["carePlanId"] = component.get("v.caseId");
            if (response.getState() === "SUCCESS") {
                var removeEvent = component.getEvent("HcCareTeamEvent");
                var msg = $A.get("$Label.HealthCloudGA.Msg_Success_Add_Member");
                $A.get("e.HealthCloudGA:HcComponentStatusEvent").setParams({
                    type: 'ADD_MEMBER',
                    status: "SUCCESS",
                    message: msg,
                    memberObj: memberObj
                }).fire();
                removeEvent.setParams({
                    "type": "REMOVEMODAL",
                    "message": msg
                });
                removeEvent.fire();
            } else {
                var errors = [];
                response.getError().forEach(function (error){
                    errors.push(error.message);
                });
                msg = errors.join(' ');
                component.find('modal').set('v.modalToast', {
                    'type': 'error',
                    'message': msg,
                    'memberObj':memberObj
                });
            }
        });
        $A.enqueueAction(action);
    },

    createMember: function (component, event) {
        /*Get the field values from field set Modal*/
        var fieldSetInfo = component.find("MandatorySection").get("v.fieldValueInfo");
        var resultMap = new Object();
        if (!this.validateRequiredFields(fieldSetInfo, resultMap)) {
            /*show required field error message*/
            component.find("MandatorySection").set("v.showValidationErrors", true);
        }
        /*Backend Call to save the Member*/
        else {
            var action = component.get("c.quickCreateIndividual");
            action.setParams({
                "infoMap": resultMap
            });
            action.setCallback(this, function (response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    /*Success */
                    var returnValue = response.getReturnValue();

                    /*Member is created*/
                    if (!$A.util.isEmpty(returnValue)) {
                        returnValue.isUser = false;
                        returnValue.isExternal = this.stringToBool(returnValue.isExternal);
                        returnValue.isCommunityEnabled = this.stringToBool(returnValue.isCommunityEnabled);

                        /*Set selected object*/
                        component.find('health1-careteamaddmember-datatable').set('v.selectedTab', 'EXTERNAL');
                        component.set('v.userSearchString', '');

                        /*Reset data table items*/
                        component.find('health1-careteamaddmember-datatable').find('health1-internal-datatable').set('v.members', []);

                        let member = {
                            id: returnValue.id,
                            column1: returnValue.name,
                            column2: returnValue.accountName
                        };
                        if (returnValue.isCommunityEnabled === "true") {
                           //This column is used to show whether the external member is a user or not
                            member.column3 = $A.get("$Label.HealthCloudGA.Text_Yes");
                        } else {
                            member.column3 = $A.get("$Label.HealthCloudGA.Text_No");
                        }
                        var members = [member];

                        var externalDataTableCmp = component.find('health1-careteamaddmember-datatable').find('health1-external-datatable');
                        externalDataTableCmp.set('v.members', []);
                        externalDataTableCmp.set('v.members', members);
                        externalDataTableCmp.set('v.radioValue', returnValue.id);

                        /*Hide Search and create button*/
                        var searchEle = document.getElementById('health1-careteamaddmember-searchElement');
                        $A.util.addClass(searchEle, 'slds-hide');
                        var quickAddMemEle = document.getElementById('health1-careteamaddmember-quickAddMem');
                        $A.util.addClass(quickAddMemEle, 'slds-hide');

                        /*Render success message*/
                        var successMessage = $A.get("$Label.HealthCloudGA.Msg_Success_Create_External_Member");
                        component.find('modal').set('v.modalToast', {
                            'type': 'success',
                            'message': successMessage
                        });

                        component.set("v.createMember", false);
                        component.set('v.selectedObj', returnValue);

                        /*Go back to the main screen*/
                        this.backButtonClicked(component);

                    } else {
                        var errorMessage = $A.get("$Label.HealthCloudGA.Msg_Error_Member_Create");
                        component.find('modal').set('v.modalToast', {
                            'type': 'error',
                            'message': errorMessage
                        });
                        /* Commenting out due to Aura error need to revisit it
                         *  throw new Error("Error :" + response.getState());
                         */
                    }
                }
                if (state === "ERROR") {
                    /*Aura Error we log the bug */
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            /*Deprecated Need to change $A.error*/
                            var errorMessage = errors[0].message;
                            component.find('modal').set('v.modalToast', {
                                'type': 'error',
                                'message': errorMessage
                            });
                            /* Commenting this due to Aura error need to revisit it
                             *  throw new Error("Error :" + errors[0].message);
                             */
                        }
                    } else {
                        var errorMessage = $A.get("$Label.HealthCloudGA.Msg_Error_Member_Create");
                        component.find('modal').set('v.modalToast', {
                            'type': 'error',
                            'message': errorMessage
                        });
                        /* Commenting out due to Aura error need to revisit it
                         *  throw new Error("Error :" + response.getState());
                         */
                    }
                }
            });
            $A.enqueueAction(action);
        }
    },

    validateRequiredFields: function (fieldSetInfo, resultMap) {
        for (var i = 0; i < fieldSetInfo.length; i++) {
            if (typeof fieldSetInfo[i] != 'undefined') {
                var fieldName = fieldSetInfo[i].field.fieldPath;
                var fieldValue = fieldSetInfo[i].field.value;
                var isRequired = fieldSetInfo[i].field.required || fieldSetInfo[i].field.dbRequired;
                /*Filling the resultMap*/
                resultMap[fieldName] = fieldValue;
                if (isRequired && !fieldValue) {
                    return;
                }
            }
        }
        return true;
    },

    searchUsers: function (component, event) {
        var searchText = document.getElementById("health1-careteamsearch-input").value;
        if (!this.lookupValidation(component, searchText)) return;

        component.set("v.userSearchString", searchText);
        var table = document.getElementById("health1-careteamsearch-table");
        $A.util.removeClass(table, "slds-hide");
    },

    quickAddMember: function (component, event) {
        component.set("v.createMember", true);
        var searchScreen = document.getElementById("health1-addmember-searchScreen");
        $A.util.addClass(searchScreen, "slds-hide");

        var modalCmp = component.find("modal");
        modalCmp.set("v.headerTitle", $A.get("$Label.HealthCloudGA.Header_Create_Member"));
        modalCmp.set("v.index", "2");
        modalCmp.set("v.count", "2");
        modalCmp.set("v.finishButtonText", $A.get("$Label.HealthCloudGA.Button_Label_Save"));

        var quickAddScreen = document.getElementById("health1-addmember-quickCreateMember");
        $A.util.removeClass(quickAddScreen, "slds-hide");
    },

    backButtonClicked: function (component) {
        component.set("v.createMember", false);
        var quickAddScreen = document.getElementById("health1-addmember-quickCreateMember");
        $A.util.addClass(quickAddScreen, "slds-hide");

        var modalCmp = component.find("modal");
        modalCmp.set("v.headerTitle", $A.get("$Label.HealthCloudGA.Header_Add_Member"));
        modalCmp.set("v.index", "1");
        modalCmp.set("v.count", "1");
        modalCmp.set("v.finishButtonText", $A.get("$Label.HealthCloudGA.Button_Label_Add_Member"));

        var searchScreen = document.getElementById("health1-addmember-searchScreen");
        $A.util.removeClass(searchScreen, "slds-hide");
    },

    lookupValidation: function (component, searchText) {
        var specialChars = "*?";
        searchText = searchText.trim();
        for (var i = 0; i < specialChars.length; i++) {
            searchText = searchText.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
        }
        if (searchText.length >= 2) {
            component.set('v.lookupValidated', true);
            return true;
        }
        component.set('v.lookupValidated', false);
        return false;
    },

    resetValidation: function (component) {
        component.set("v.lookupValidated", true);
    },

    getGlobalSettingsAndInit: function (component) {
        var self = this;
        var action = component.get("c.getGlobalSettings");
        var role;

        action.setCallback(this, function (response) {
            if (action.getState() === "SUCCESS") {
                var returnValue = response.getReturnValue();
                component.set("v.globalSettings", returnValue);
                role = returnValue.PATIENT_ROLE;
                component.set("v.patientRole", role);
                self.showRoles(component);
            } else {
                //Remove Comment once Aura bug for logging in console is fixed.
                //throw new Error($A.get("$Label.HealthCloudGA.Msg_Error_General"));
            }
        });
        $A.enqueueAction(action);
    },
})