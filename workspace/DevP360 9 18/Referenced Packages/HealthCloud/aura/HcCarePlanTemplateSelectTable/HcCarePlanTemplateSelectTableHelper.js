({
	getInitialData : function(cmp,evt,hlp) {
        var dataProvider = cmp.get('v.dataProvider');
        var provideEvent = dataProvider[0].get("e.provide");
        var parameters = {'type':'DataFetch'};
        var eventData = {"parameters" : parameters};
        provideEvent.setParams(eventData);
        provideEvent.fire();
    },
})