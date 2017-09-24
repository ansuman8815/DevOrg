({
    /*
	 myAction : function(component, event, helper) {
          //  console.log("Show_Result");
        	var action = component.get("c.findPatientRecords");
        	
        	action.setCallback(this, function(response) {
            var state = response.getState();
            //console.log("****");
            console.log(response.getReturnValue());
            if (state === "SUCCESS") {
                component.set("{!v.res}",response.getReturnValue());
 
                var resultset =  JSON.stringify(response.getReturnValue());
               // resultset = '{"mydata":'+resultset+'}';
			
                var jsdata = JSON.parse(resultset);
                console.log(jsdata);
   				console.log(Object.keys(jsdata).length);
               
                $(document).ready(function(){ 
                   // $('#searchResult').dataTable(resultset);
                   console.log("-----");
                   console.log(jsdata);
     
                  $('#searchResult').dataTable({
                    aaData:jsdata,
                    aoColumns:
                        [
                           { "mDataProp": "name" },
                           { "mDataProp": "dob" },
                           { "mDataProp": "gender" },
                           { "mDataProp": "cin" }
                        ],
                         "bPaginate": true,
                         "sPaginationType": "full_numbers"
                });
            });
               

            }
               
            });
           
         $A.enqueueAction(action);
                               
}*/
    myAction : function(component, event, helper) {
        	var action = component.get("c.findPatientRecords");
        	
        	action.setCallback(this, function(response) {
            var state = response.getState();
           // console.log(response.getReturnValue());
            if (state === "SUCCESS") {
                component.set("{!v.res}",response.getReturnValue());
 
                var resultset =  JSON.stringify(response.getReturnValue());
                var jsdata = JSON.parse(resultset);
                console.log(jsdata);
         
                $(document).ready(function(){ 
                   console.log("-----");
                   console.log(jsdata);
     			   var source = {
                        localdata: jsdata,
                        datafields: [{
                            name: 'name',
                            type: 'string'
                        }, {
                            name: 'dob',
                            type: 'string'
                        }, {
                            name: 'gender',
                            type: 'string'
                        }, {
                            name: 'cin',
                            type: 'string'
                        }],
                        datatype: "array"
                    };
                    var dataAdapter = new $.jqx.dataAdapter(source);

            $("#jqxgrid").jqxGrid(
            {
                width: 850,
                source: dataAdapter,
                sortable: true,
                filterable: true,
                filtermode: 'excel',
                columnsresize: true,
                autoshowfiltericon: false,
                pageable: true,
                columns: [{
                    text: 'Patient Name',
                    datafield: 'name',
                    width: 250
                }, {
                    text: 'DOB',
                    datafield: 'dob',
                    width: 250
                }, {
                    text: 'Gender',
                    datafield: 'gender',
                    width: 250
                }, {
                    text: 'CIN',
                    datafield: 'cin',
                    width: 250
                }]
             });    
                    
                    
                  /*$('#searchResult').dataTable({
                    aaData:jsdata,   
                    aoColumns:
                        [
                           { "mDataProp": "name" },
                           { "mDataProp": "dob" },
                           { "mDataProp": "gender" },
                           { "mDataProp": "cin" }
                        ],
                         "bPaginate": true,
                         "sPaginationType": "full_numbers"
                });*/
            });
               

            }
               
            });
           
         $A.enqueueAction(action);
                               
}
})