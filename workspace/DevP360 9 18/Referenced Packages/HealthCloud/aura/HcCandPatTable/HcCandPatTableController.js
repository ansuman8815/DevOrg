({
    doInit : function(component, event, helper) {

        var viewId = component.get('v.viewId');
        if (viewId===undefined)
            viewId = 'notcon';
        helper.setSelectionType(component,viewId);

        var columnLinkFunctionMap = {
            Name__c : function( itemData ) {
                var url = "/" + encodeURIComponent(itemData.Id);
                HC.openConsolePrimarytab(url, true, itemData.Name__c, itemData.Name__c);
            },
            AccountId__r__Name: function(itemData){
                var defRecOpenType = component.get("v.defRecOpenType").toLowerCase();
                var recordId = '';
                if (defRecOpenType==='contact') {
                    recordId = itemData.AccountId__r__PrimaryContact__c;
                }
                else if (defRecOpenType==='account'){
                    recordId = itemData.AccountId__c;
                }
                var url = "/" + encodeURIComponent(recordId);

                HC.openConsolePrimarytab(url, true, itemData.AccountId__r__Name, recordId);
            }
        };
        component.set('v.columnLinkFunctionMap', columnLinkFunctionMap);

        component.set('v.showSpinner', true);
        helper.getInitialData(component, event, helper, viewId);
    },

    handleViewChange: function(component, event, helper) {
        var viewId = component.get('v.viewId').toLowerCase();
        if (viewId===undefined)
            viewId = 'notcon';
        helper.setSelectionType(component,viewId);

        component.set('v.showSpinner', true);
        helper.getInitialData(component, event, helper, viewId);
    },

    handleSelectionEvent: function(component, event, helper) {
        var selectedItems = helper.getSelectedItems(component);
    }
})