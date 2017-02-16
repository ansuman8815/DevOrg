({
	 myAction : function(component, event, helper) {
          //  console.log("Show_Result");
        	var action = component.get("c.findAll");
        	
        	action.setCallback(this, function(response) {
            var state = response.getState();
            //console.log("****");
           // console.log(response.getReturnValue());
            if (state === "SUCCESS") {
                component.set("{!v.res}",response.getReturnValue());
 
                var resultset =  JSON.stringify(response.getReturnValue());
                //resultset = '{"mydata":'+resultset+'}';
			
                var jsdata = JSON.parse(resultset);
   console.log(Object.keys(jsdata).length);
               
                $(document).ready(function(){ 
                   // $('#searchResult').dataTable(resultset);
                 $('#searchResult').dataTable({
            aaData:jsdata,
                     
			 "columns": [
            { "data": "Id",render: function ( data, type, row ) {
        return data[0];
    } }],
            aoColumns:
                    [
                       { "mData": "Id" }
                    ],
                     "bPaginate": true
        });
            });
               

            }
               
            });
           
         $A.enqueueAction(action);
                               
}
})