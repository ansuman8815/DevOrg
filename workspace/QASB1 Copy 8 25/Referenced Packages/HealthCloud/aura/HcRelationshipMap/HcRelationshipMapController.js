({
    handleComponentStatusEvent: function(component, event, helper) {
        if (event.getParam('status') === 'SUCCESS' && (event.getParam('type')==='ADD_MEMBER' || event.getParam('type')==='REMOVE_RELATIONSHIP')) {
            helper.onInit(component, event, helper);
        }
    },

    handleRootChange: function (component,event,helper) {
        var entity = component.get('v.rootObject');
        $A.createComponent('HealthCloudGA:HcRelationshipMapActionButton',
            {
                entity: entity,
                buttonClass: "buttonBox slds-button slds-button--neutral"
            }, function (actionButton, status, statusMessage) {
                if (status==="SUCCESS"){
                    component.set('v.addIndividualToGroupButton', actionButton);
                }
            });
    }
})