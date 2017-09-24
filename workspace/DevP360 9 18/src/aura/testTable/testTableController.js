({
	afterScriptsLoaded : function(component, event, helper) {
        $('#sample_table1').dataTable();
    },
     extendClick: function(component, event, helper) {
         	console.log("S");
         	var target = event.currentTarget;
        	var parent = $(target).parent();
         	var parents=$(parent).parent();
         	parents.next().toggle();
		},
        
})