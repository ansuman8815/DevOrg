({
    doInit: function(component, event, helper) {
        var namespace = component.toString().match(/markup:\/\/(\w{1,15}):/)[1];
        component.set('v.packageNamespace', $A.util.isEmpty(namespace) ? "" : namespace + '__');
    },

    onTypeInSearch: function(component, event, helper){
        var searchText = event.getSource().get('v.value');
        helper.typeAheadDelayExecute(function() {
            component.set("v.searchText", searchText);
        });
    },

    handleTemplateAddEvent:function(component, event, helper){
        helper.handleTemplateAddEvent(component, event, helper);
    },

    handleTemplateRemoveEvent:function(component, event, helper){
        helper.handleTemplateRemoveEvent(component, event, helper);
    },

    handleTableRefeshedEvent:function(component, event, helper){
        var eventData = event.getParam('data');
        helper.handleTableRefeshedEvent(component, eventData);
    }
})