({
    getInitialData : function(cmp,evt,hlp,actionName) {
        var dataProvider = cmp.get('v.dataProvider');
        var provideEvent = dataProvider[0].get("e.provide");
        var parameters = {'type':'DataFetch','action':actionName};
        var eventData = {"parameters" : parameters};
        provideEvent.setParams(eventData);
        provideEvent.fire();
    },

    setSelectionType: function(component, viewId){
        if (viewId=='notcon'){
            component.set('v.selectionType','MULTI')
        }
        else{
            component.set('v.selectionType','');
        }
    }
})