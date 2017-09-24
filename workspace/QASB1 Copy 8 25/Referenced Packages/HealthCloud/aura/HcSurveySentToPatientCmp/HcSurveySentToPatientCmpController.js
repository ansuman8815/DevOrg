({
	onTypeInSearch: function(component, event, helper){
        var searchText = event.getSource().get('v.value');
        helper.typeAheadDelayExecute(function() {
            component.set("v.searchText", searchText);
        });
    },
})