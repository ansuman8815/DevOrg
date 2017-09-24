({
    setExpandedTable: function (cmp, component) {
        var patientId = component.get("v.itemData").row.AccountId;
        var carePlanId = component.get("v.itemData").row.Id;
        var Subject = component.get("v.itemData").row.Subject;
        var attributes = {
            "patientId": patientId,
            "showHeader": false,
            "carePlanId": carePlanId,
            "carePlanSubject": Subject
        };
        component.set("v.showSpinner",true);
        $A.createComponent("HealthCloudGA:HcCarePlanBaseCmp", attributes, function (newTable, status, statusMessage) {
            component.set("v.showSpinner",false);
            if (status === "SUCCESS") {
                cmp.set("v.body", newTable);
            }
        });
    },

    toggleIcon: function (component, event) {
        var expanded = component.get("v.expanded");
        var firstTimeAccessed = component.get("v.firstTimeAccessed");
        component.set("v.expanded", !expanded);
        var tableRow = component.find('panelRow');
        if (firstTimeAccessed) {
            //if first time, not cached. Run spinner
            this.setExpandedTable(tableRow, component);
        }
        component.set("v.firstTimeAccessed", false);
    },

    expandCollapseCarePlans: function (component, event) {
        var expanded = component.get("v.expanded");
        if (event.getParam("type") === "Expand all Care Plans") {
            if (!expanded) {
                this.toggleIcon(component, event);
                component.set("v.expanded", !expanded);
            }
        } else if (event.getParam("type") === "Collapse all Care Plans") {
            if (expanded) {
                this.toggleIcon(component, event);
                component.set("v.expanded", !expanded);
            }
        }
    }
})