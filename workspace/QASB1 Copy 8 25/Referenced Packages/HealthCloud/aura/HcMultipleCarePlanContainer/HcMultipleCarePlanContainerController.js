({
    handleActive: function (component, event, helper) {
        var tab = event.getSource();
        var tabId = tab.get('v.id');
        component.set("v.activeTabId", tabId);
        if (tabId == 'closedCases' && !component.get("v.isClosedCasesLoaded")) {
            helper.createPanelContainer(component, tab);
        } else if (tabId == 'allCases' && !component.get("v.isAllCasesLoaded")) {
            helper.createPanelContainer(component, tab);
        }else if (tabId == 'openCases' && !component.get("v.isOpenCasesLoaded")){
            helper.createPanelContainer(component, tab);
        }
    },

    handleMenuClick: function (component, event, helper) {
        var menuValue = event.getSource().get('v.value');
        var expandCollapseEvent = $A.get("e.HealthCloudGA:HcMultipleCarePlanEvent");
        var activeTabId = component.get("v.activeTabId");
        if (menuValue == "ExpandCarePlans") {
            expandCollapseEvent.setParams({
                "type": "Expand all Care Plans", 
                "allCarePlansTabId":activeTabId
            });
        } else if (menuValue == "CollapseCarePlans") {
            expandCollapseEvent.setParams({
                "type": "Collapse all Care Plans",
                "allCarePlansTabId":activeTabId
            });
        }
        expandCollapseEvent.fire();
        var careplanMenu = component.find("careplanMenu");
        careplanMenu.set("v.visible", false);
    },

    handleNewCarePlanClick: function(component, event, helper) {
        var action = component.get("c.getAccountContactDefaultCarePlanRT");
        action.setParams({
            "patientId": component.get("v.patientId")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                var recordTypeId = result.recordTypeId;
                var contactId = result.contactId;
                var accountId = result.accountId;
                if ($A.util.isUndefinedOrNull(contactId) || $A.util.isUndefinedOrNull(accountId)) {
                    component.set('v.errorMsg', $A.get("$Label.HealthCloudGA.Msg_Error_General"));
                } else {
                    HC.openNewCarePlan(accountId, contactId);
                }
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
    }
})