({
    doInit : function(component, event, helper) {
        var action = component.get("c.getDataForRegistry");
        var whereclause = component.get("v.whereclause");
        action.setParams({"programId" : whereclause});
		action.setCallback(this, function(data) {
        var res = data.getReturnValue();
        var jsonData = JSON.parse(res);
        var jsdata = jsonData.data;
        component.set("v.count" , jsonData.count);        
        component.set("v.refreshDate" , jsonData.refreshDate);
        var ua = navigator.userAgent.toLowerCase();
		function removeSpaces(ua) {
			return ua.split(' ').join('');
		}
		ua = removeSpaces(ua);
        var iPad = ua.match(/(ipad)/);
        if(iPad) {
           var searchResultvalue = component.find("registryDiv");
            $A.util.removeClass(searchResultvalue, 'slds-max-medium-table--stacked-horizontal');
        }
        else{
            var searchResultvalue = component.find("registryDiv");
            $A.util.addClass(searchResultvalue, 'slds-max-medium-table--stacked-horizontal');
        }
        $.fn.DataTable.ext.pager.numbers_length = 5;
         $('#registryResult')
         .on( 'search.dt', function () { getNumFilteredRows("registryResult"); } )
         .dataTable({
             aaData :jsdata,
             aoColumns :
             [
                 { "mDataProp": "name", "bSortable": true,
                      "mRender": function(jsdata, type, full) {
                        return '<p>' + jsdata + '</p>';
                      }
                 },
                 { "mDataProp": "dob","bSortable": true,
                      "mRender": function(jsdata, type, full) {
                        return '<p>' + jsdata + '</p>';
                      } 
                 },
                 { "mDataProp": "gender",
                      "mRender": function(jsdata, type, full) {
                        return '<p>' + jsdata + '</p>';
                      } 
                 },
                 { "mDataProp": "cin",
                      "mRender": function(jsdata, type, full) {
                        return '<p>' + jsdata + '</p>';
                      } 
                 }
                 
             ],

              "fnCreatedRow": function( nRow, aData, iDataIndex ) {
                 $(nRow.childNodes[0]).attr('data-label', 'Name');
                 $(nRow.childNodes[1]).attr('data-label', 'Date Of Birth');
                 $(nRow.childNodes[2]).attr('data-label', 'Gender');
                 $(nRow.childNodes[3]).attr('data-label', 'Medicaid ID (CIN)');
             },
             "sPaginationType": "full_numbers",
                    "bInfo": false,
                    "sDom": '<"top"flp>rt<"bottom"ilp><"clear">',
                    "aaSorting": [],
                    "oLanguage": 
                    {
                        "lengthMenu": "Display _MENU_ records per page",
                        "sEmptyTable":"No data available",
                        "sSearch": "Find: ",
                        "oPaginate": 
                        {
                            "sNext": '&gt',
                            "sPrevious": '&lt'
                        }
                    }, 
                    "fnDrawCallback": function( oSettings ) {
                        helper.helperMethod(component);
                          helper.helperMethodFooter(component);
                    }
         });
            helper.helperMethod(component);
    });
        $A.enqueueAction(action);
        
        function getNumFilteredRows(id){
            var info = $('#' +id).DataTable().page.info();
            var recordsDisplay = info.recordsDisplay;
            var recordsTotal = info.recordsTotal;
            var filter = component.set("v.filteredCount",recordsDisplay);
            var total = component.set("v.totalCount",recordsTotal);
            if($(".dataTables_filter input").val().length > 0){
                $('.filtercountVal').css('display','inline-block');
                $('.record-count').css('display','none');
            }
            else{
                $('.filtercountVal').css('display','none');
                $('.record-count').css('display','inline-block');
            }  
        }
    },
    waiting: function(component, event, helper) {
        if(document.getElementById("Loadingspinner") != null)
        	document.getElementById("Loadingspinner").style.display = "block";
    },
    doneWaiting: function(component, event, helper) {
        if(document.getElementById("Loadingspinner") != null)
        	document.getElementById("Loadingspinner").style.display = "block";
    }
 })