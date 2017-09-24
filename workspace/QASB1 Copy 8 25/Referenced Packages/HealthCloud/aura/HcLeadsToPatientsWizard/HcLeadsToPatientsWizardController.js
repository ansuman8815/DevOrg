({
    doInit: function(component, event, helper) {
        var isPSLRestricted = component.get("v.isPSLRestricted");
        var leadIds = component.get("v.selectedLeads");
        if(isPSLRestricted === "true"){
            helper.handlePslError(component, helper);
        } else if( leadIds.length > 0 ) {
            $A.util.removeClass( component.find('wizardContainer'), "slds-hide");
            helper.doInit( component, helper);
        } else {
            $A.util.removeClass( component.find('noSelectedLeadsMsg'), "slds-hide");
        }
    },

    onPrevious: function(component, event, helper) {
        var tabset = component.find("navigationTabset");
        var tabList = component.get("v.tabList");
        var current = tabset.get("v.selectedTabId");
        var currentIndex = tabList.indexOf(current);
        tabset.set("v.selectedTabId", tabList[currentIndex-1]);
    },

    onNext: function(component, event, helper) {
        var tabList = component.get("v.tabList");
        var tabset = component.find("navigationTabset");
        var current = tabset.get("v.selectedTabId");
        var currentIndex = tabList.indexOf(current);
        tabset.set("v.selectedTabId", tabList[currentIndex+1]);
    },

    onFinish: function(component, event, helper) {
        helper.invokeLeadConversion( component, event, helper );
    }
})