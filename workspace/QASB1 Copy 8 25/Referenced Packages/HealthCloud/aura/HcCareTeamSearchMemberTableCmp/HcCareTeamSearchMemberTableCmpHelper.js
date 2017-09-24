/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCareTeamSearchMemberTableCmpHelper, helper class for HcCareTeamSearchMemberTable Component.
 * @since 196
 */
({
    onInternalTabClick: function(component, event, helper) {
        var internalTab = document.getElementById("health1-careteamsearch-internal--tab");
        var internalTabDataTable = document.getElementById("health1-careteamsearch-internal--datatable");
        var externalTab = document.getElementById("health1-careteamsearch-external--tab");
        var externalTabDataTable = document.getElementById("health1-careteamsearch-external--datatable");
        var selectedTab = component.get("v.selectedTab");
        if (null != internalTab) {
            //Toggle internal Table Classes
            $A.util.addClass(internalTab, "slds-active");
            $A.util.addClass(internalTabDataTable, "slds-show");
            $A.util.removeClass(internalTabDataTable, "slds-hide");
            //Toggle External Table Classes
            $A.util.removeClass(externalTab, "slds-active");
            $A.util.removeClass(externalTabDataTable, "slds-show");
            $A.util.addClass(externalTabDataTable, "slds-hide");
            component.set("v.selectedTab", "INTERNAL");
            /*var memberSelectedEvent = $A.get("e.HealthCloudGA:HcComponentStatusEvent");
            memberSelectedEvent.setParams({
                "type": "AddMemberSelected",
                "memberObj": ""
            });
            memberSelectedEvent.fire();*/
        }
    },

    onExternalTabClick: function(component, event, helper) {
        var internalTab = document.getElementById("health1-careteamsearch-internal--tab");
        var internalTabDataTable = document.getElementById("health1-careteamsearch-internal--datatable");
        var externalTab = document.getElementById("health1-careteamsearch-external--tab");
        var externalTabDataTable = document.getElementById("health1-careteamsearch-external--datatable");
        var selectedTab = component.get("v.selectedTab");
        if (null != selectedTab) {
            //Toggle internal Table Classes
            $A.util.removeClass(internalTab, "slds-active");
            $A.util.removeClass(internalTabDataTable, "slds-show");
            $A.util.addClass(internalTabDataTable, "slds-hide");
            //Toggle External Table Classes
            $A.util.addClass(externalTab, "slds-active");
            $A.util.addClass(externalTabDataTable, "slds-show");
            $A.util.removeClass(externalTabDataTable, "slds-hide");
            component.set("v.selectedTab", "EXTERNAL");
            /*var memberSelectedEvent = $A.get("e.HealthCloudGA:HcComponentStatusEvent");
            memberSelectedEvent.setParams({
                "type": "AddMemberSelected",
                "memberObj": ""
            });
            memberSelectedEvent.fire();*/
        }
    },

     retrieveInternalUsers: function(component) {
        var self = this;
        self.showSpinner(true);

        // Initialize server rpc call to "getPatientsByViewForTable" method in "PatientListViewController"
        var rpc = component.get("c.getInternalUsersByNameForAddMemberSearch");
        rpc.setParams({
            'searchString': component.get("v.userSearchString"),
            'caseId': component.get("v.caseId")
        });

        rpc.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                if (null != response.getReturnValue()) {
                    var column = response.getReturnValue().meta.columnsHeaderMap;
                    var entries = response.getReturnValue().recordsData;
                    if (undefined != entries) {
                        for (let i = 0; i < entries.length; i++) {
                            entries[i].isExternal = false;
                            entries[i].isCommunityEnabled = this.stringToBool(entries[i].isCommunityEnabled);
                        }
                    }
                    component.find("health1-internal-datatable").set("v.column1Label", column['name']);
                    component.find("health1-internal-datatable").set("v.column2Label", column['userRoleName']);
                    component.find("health1-internal-datatable").set("v.items", []);
                    let members = [];
                    for (var index = 0; index < entries.length; index++) {
                        let member = {
                            id: entries[index].id,
                            column1: entries[index].name,
                            column2: entries[index].userRoleName
                        };
                        members.push(member);
                    }
                    component.find("health1-internal-datatable").set("v.members", members);
                }
            } else {
                self.showError(response.getError());
            }
            self.showSpinner(false);
        });

        $A.enqueueAction(rpc);
    },

    retrieveExternalUsers: function(component) {
        var self = this;
        self.showSpinner(true);

        var rpc = component.get("c.getExternalUsersByNameForAddMemberSearch");
        rpc.setParams({
            'searchString': component.get("v.userSearchString"),
            'caseId': component.get("v.caseId")
        });

        rpc.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                if (null != response.getReturnValue()) {
                    var column = response.getReturnValue().meta.columnsHeaderMap;
                    var entries = response.getReturnValue().recordsData;
                    if (undefined != entries) {
                        for (let i = 0; i < entries.length; i++) {
                            entries[i].isExternal = this.stringToBool(entries[i].isExternal);
                            entries[i].isCommunityEnabled = this.stringToBool(entries[i].isCommunityEnabled);
                        }
                    }
                    component.find("health1-external-datatable").set("v.column1Label", column['name']);
                    component.find("health1-external-datatable").set("v.column2Label", column['accountName']);
                    component.find("health1-external-datatable").set("v.column3Label", column['user']);
                    component.find("health1-external-datatable").set("v.isExternalTable", true);
                    component.find('health1-external-datatable').set('v.items', []);
                    let members = [];
                    for (var index = 0; index < entries.length; index++) {
                        let isUser = "";
                        if (!$A.util.isEmpty(entries[index].isUser) && entries[index].isUser === 'true') {
                            //This column is used to show whether the external member is a user or not
                            isUser = $A.get("$Label.HealthCloudGA.Text_Yes");
                        } else {
                            isUser = $A.get("$Label.HealthCloudGA.Text_No");
                        }

                        let member = {
                            id: entries[index].id,
                            column1: entries[index].name,
                            column2: entries[index].accountName,
                            column3: isUser
                        };
                        members.push(member);
                    }
                    component.find('health1-external-datatable').set('v.members', members);
                }
            } else {
                self.showError(response.getError());
            }
            self.showSpinner(false);
        });

        $A.enqueueAction(rpc);
    },

    showSpinner : function (isSpinnerDisplayed) {
        var appEvent = $A.get("e.HealthCloudGA:HcToggleSpinnerEvent");
        appEvent.setParams({ "isVisible": isSpinnerDisplayed });
        appEvent.fire();
    },

    showError : function (responseError) {
        var errors = [];
        responseError.forEach(function (error){
            errors.push(error.message);
        });
        msg = errors.join(' ');
        $A.get("e.HealthCloudGA:HcComponentStatusEvent").setParams({
            status: "ERROR",
            message: msg
        }).fire();
    }
})