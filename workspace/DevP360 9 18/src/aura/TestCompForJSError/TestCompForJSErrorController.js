({
	doinit : function(component, event, helper) {
    	console.log('After scripts');
        console.log($("#testTable"));
        $("#testTable").dataTable({
            "aoColumns": [ 
                  { sWidth: "45%", bSearchable: false, bSortable: false }, 
                  { sWidth: "45%", bSearchable: false, bSortable: false }, 
                  { sWidth: "10%", bSearchable: false, bSortable: false } 
            ]
        });
	}
})