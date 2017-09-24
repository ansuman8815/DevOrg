({
    onInit: function(component,event,helper){
        helper.setupButtons(component);
    },

    handleButtonClick: function (component,event,helper) {
        var entity = component.get("v.entity");
        var parentEntity = component.get("v.parentEntity");

        helper.getParamsAndCreate(component, entity, parentEntity);
    },

    handleCreateButtonClick: function (component,event,helper) {
        var params = {
            "entityApiName": "Account"
        };
        helper.createRecord(component, params);
    }
})