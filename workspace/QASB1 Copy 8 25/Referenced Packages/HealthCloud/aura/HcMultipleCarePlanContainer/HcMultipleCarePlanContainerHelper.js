({
    createPanelContainer: function (component, tab) {
        var status;
        var excludeStatus;
        var tabId = tab.get('v.id');
        if (tabId == "closedCases") {
            status = "Closed";
        }else if (tabId == "openCases") {
            excludeStatus = "Closed";
        } 
        $A.createComponent("HealthCloudGA:HcCarePlanPanelContainer", {
                "startT": new Date().getTime(),
                "patientId": component.get("v.patientId"),
                "status": status,
                "excludeStatus":excludeStatus
            },
            function (contentComponent, status, error) {
                if (status === "SUCCESS") {
                    tab.set('v.body', contentComponent);
                    // prevent future activation once loaded
                    if (tabId == "closedCases") {
                        component.set("v.isClosedCasesLoaded", true);
                    } else if (tabId == "allCases") {
                        component.set("v.isAllCasesLoaded", true);
                    } else if (tabId == "openCases"){
                        component.set("v.isOpenCasesLoaded", true);   
                    }

                } else {
                    var errorMessage = 'Error: Creation of tasks failed.' // TODO: To be contextualized and localized.
                    helper.showToast(component, { message: errorMessage }, true, 'error');
                    console.error(errorMessage, error);
                }
            }
        );
    }
})