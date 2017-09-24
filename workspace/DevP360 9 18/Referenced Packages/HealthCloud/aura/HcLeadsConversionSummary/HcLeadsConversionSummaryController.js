({
    setCoordinatorName : function(component, event, helper) {
        var coordinatorName = '';
        var coordinator = component.get('v.coordinator');
        if( coordinator && coordinator.id && coordinator.name.length > 0 )
        {
            coordinatorName = coordinator.name;
        }
        component.set('v.coordinatorName', coordinatorName);
    }
})