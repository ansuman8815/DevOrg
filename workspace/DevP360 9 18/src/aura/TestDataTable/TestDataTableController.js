({
    doInit : function(component, event, helper) {
        
       
        
        $('#sample_table').dataTable({
            
        });
        
    },
    
     extendClick: function(component, event, helper) {
         	console.log("S");
         	//console.log($(this).parent("td.extend-show").text);
         
       		//$(this).parent("td.extend-show").hide;
       		//
       		//
       		//
       		var target = event.currentTarget;
        	var parent = $(target).parent();
         	var parents=$(parent).parent();
         	parents.next().toggle();
		},
        
    
})