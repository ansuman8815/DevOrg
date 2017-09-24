({
    removeTable: function(component , tableName){
        $('#parTable').html("");
        $('#parTable').append('<table class="slds-table slds-table--bordered slds-table--striped slds-max-medium-table--stacked-horizontal" aura:id="searchDiv" id="'+ tableName +'" style="height:100%;width:100% !important;"><thead/><tbody></tbody></table>');
    },
    fetchApiData: function(component , operation)
    { 
        component.set("v.disabled" , true);
        var action = component.get("c.getFHIRQueryResult");
        action.setParams({"resourceName"	: component.get("v.resourceName"),
                          "empi" 			: component.get("v.empi"),
                          "selectedId" 		: component.get("v.selectId"),
                          "operation" 		: operation
                         });
        action.setCallback(this, function(data) {
            var res = data.getReturnValue();
            this.tableCreation(component);
            if(res != ''){
                document.getElementById("errorpopUp").innerHTML = res;
                document.getElementsByClassName("top")[0].style.position= 'relative'; 
                document.getElementsByClassName("top")[0].style.bottom=  75 + "px";
            }
        });
        $A.enqueueAction(action); 
    },
    tableCreation : function(component)  
    {
        var action 		 	= component.get("c.getDataForComponent");
        var listName	 	= component.get("v.listName");
        var whereclause 	= component.get("v.whereclause");
        var tableName 		= component.get("v.tableName");
        var isPallet		= component.get("v.isPallet");
        action.setParams({"listName"		: listName, 
                          "whereClauseArg"  : whereclause, 
                          "resourceName" 	: 'Observation',
                          "empi" 			: component.get("v.empi"),
                          "isPallet"		: isPallet
                         });
        if(typeof whereclause !== "undefined"){
            action.setCallback(this, function(data) { 
                var resultset =  JSON.stringify(data.getReturnValue());
                component.set("v.result",resultset);
                var getresult = component.get("v.result");
                var res = JSON.parse(getresult);
                var jsdata = res.data;
                component.set("v.count" , jsdata.length);
                component.set("v.fromDate" , res.fromDate);
                component.set("v.toDate" , res.toDate);
                component.set("v.disabled" , res.disabled);
                
                var columns = [];            
                for(var i in res.columns) {
                    var item = res.columns[i];
                    var pos = item.lastIndexOf(' ');
                    var cont = item[pos];
                    var breakCont = item.split(cont).join("<br/>");
                    var tabHead= res.columns[i];
                    if(pos == -1){
                        item = item;
                    }
                    else{
                        item = item.substring(0,pos) + ("<br/>") + item.substring(pos+1);
                    }
                    var s= item.substring(0,pos);
                    var x = item.substring(pos+1);
                    columns.push({
                        "mDataProp" : tabHead, 
                        "sTitle" 	: item,
                        "mRender"	: function(jsdata, type, full) {
                            if(($( window ).width())  >= 768)
                                return jsdata ;
                            else
                                return '<p>' + jsdata + '</p>';
                        }
                    });
                }   
                $.fn.DataTable.ext.pager.numbers_length = 5;
                var tableName = component.get("v.tableName");
                if($.fn.DataTable.isDataTable('#' + tableName))
                {
                    this.removeTable(component , tableName);
                }
                
                $('#' + tableName)
                .on( 'search.dt', function () { getNumFilteredRows(tableName); } )
                .dataTable({
                    aaData:jsdata,
                    fixedHeader: {
                        header: true
                    },
                    aoColumns: columns,
                    "fnCreatedRow": function( nRow, aData, iDataIndex ) {
                        for(var i in res.columns) {
                            var item = res.columns[i];
                            $(nRow.childNodes[i]).attr('data-label', item);
                        }
                    }, 
                    "sPaginationType"	: "full_numbers",
                    "bInfo"				: false,
                    "sDom"				: '<"top"flp>rt<"bottom"ilp><"clear">',
                    "aaSorting"			: [],
                    "oLanguage"			: 
                    {
                        "lengthMenu": "Display _MENU_ records per page",
                        "sEmptyTable":"No data available",
                        "sSearch": "Find: ",
                        "oPaginate": 
                        {
                            "sNext": '&gt',
                            "sPrevious": '&lt'
                        }
                    }
                });
            });
            $A.enqueueAction(action);
        }
        function getNumFilteredRows(id){
            var info = $('#' +id).DataTable().page.info();
            var recordsDisplay = info.recordsDisplay;
            var recordsTotal = info.recordsTotal;
            var filter = component.set("v.filteredCount",recordsDisplay);
            var total = component.set("v.totalCount",recordsTotal);
            var listName = component.get("v.listName").toString();
            if($(".dataTables_filter input").val().length > 0){
                $('.filtercountVal').css('display','inline-block');
                $('.countValue').css('display','none');
                $('.countVal').css('display','none');
            }
            else{
                $('.filtercountVal').css('display','none');
                $('.countValue').css('display','inline-block');
                $('.countVal').css('display','inline-block');
            }
        }
        
        var calcDataTableHeight = function() {
            var windowh = $( window ).height();
            setTimeout(function() {
                var patientBh = $("#FreezeSection").height();
                var tableHead = $("#tableHeading").height();
                var columnHead = $(".dataTables_scrollHead").height();
                var bPagination = $(".bottom .dataTables_paginate").height();
                var scrollWidth = $(".dataTables_scrollBody").width();
                var remh = windowh-patientBh-tableHead-columnHead-bPagination-200;
                $('.dataTables_scrollBody').css('max-height',remh);
                $('.dataTables_scrollBody').css('overflow-y','auto');
                if(scrollWidth >= 1051)
                {
                    $('.dataTables_scrollHead').css('width','100%');
                    $('.dataTables_scrollHead').css('margin-right','0');
                }
                else{
                    $('.dataTables_scrollHead').css('width','auto');
                    $('.dataTables_scrollHead').css('margin-right','17px');
                }
                $('.dataTables_scrollBody thead tr').css({visibility:'collapse'});
            }, 100);
        };
        
        var ua = navigator.userAgent.toLowerCase();
        function removeSpaces(ua) {
            return ua.split(' ').join('');
        }
        ua = removeSpaces(ua);
        var iPad = ua.match(/(ipad)/);
        if(iPad) {
            var searchResultvalue = component.find("searchDiv");
            $A.util.addClass(searchResultvalue, 'slds-max-medium-table--stacked-horizontal');
        }
        else{
            var searchResultvalue = component.find("searchDiv");
            $A.util.addClass(searchResultvalue, 'slds-max-medium-table--stacked-horizontal');
        }
        var length = listName.length;
        if(length > 25){
            var encounterSumHead = component.find("listTitle");
            $A.util.removeClass(encounterSumHead, 'mt10');
            $A.util.addClass(encounterSumHead, 'mt0'); 
        }
        else{
            var encounterSumHead = component.find("listTitle");
            $A.util.removeClass(encounterSumHead, 'mt0');
            $A.util.addClass(encounterSumHead, 'mt10');
        }
    }
})