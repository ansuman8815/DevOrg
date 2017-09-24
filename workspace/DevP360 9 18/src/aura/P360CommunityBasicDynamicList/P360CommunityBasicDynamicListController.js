({
    doInit : function(component, event, helper) {
        var action = component.get("c.getDataForComponent");
        var empi = component.get("v.empi");
        var listName = component.get("v.listName");
        var whereclause = component.get("v.empi");
        var tableName = component.get("v.tableName");
        
        tableName = tableName + "viewMore";
        action.setParams({"listName":listName, 
                          "whereClauseArg" : whereclause, 
                          "isPallet" : "false"});
        action.setCallback(this, function(data) {
            var res = data.getReturnValue();
            var resultset =  JSON.stringify(data.getReturnValue());
            component.set("v.result",resultset);
            var getresult = component.get("v.result");
            var res = JSON.parse(getresult);
            var jsdata = res.data;
            component.set("v.count" , res.count);
            var columns = [];  
            
            for(var i in res.columns) {
                var item = res.columns[i];
                columns.push({ 
                    "mDataProp" : item, 
                    "sTitle" : item
                });
            }   
            var tableName = component.get("v.tableName");
            $('#' + tableName).dataTable({
                "bRetrieve":true,
                aaData:jsdata,
                aoColumns: columns,
                "fnCreatedRow": function( nRow, aData, iDataIndex ) {
                    for(var i in res.columns) {
                        var item = res.columns[i];
                        $(nRow.childNodes[i]).attr('data-label', item);
                    }
                },
                "sPaginationType": "full_numbers",
                searchHighlight: true,
                "bInfo": false,
                "sDom": 't',
                "bSortable": true,
                "oLanguage": 
                {
                    "sEmptyTable": "No data available"
                }
            });
        });
        $A.enqueueAction(action);
        
        var ua = navigator.userAgent.toLowerCase();
        function removeSpaces(ua) {
            return ua.split(' ').join('');
        }
        ua = removeSpaces(ua);
        var iPad = ua.match(/(ipad)/);
        if(iPad) {
            var searchResultvalue = component.find("SearchDiv");
            $A.util.removeClass(searchResultvalue, 'slds-max-medium-table--stacked-horizontal ');
        }
        else{
            var searchResultvalue = component.find("searchDiv");
            $A.util.addClass(searchResultvalue, 'slds-max-medium-table--stacked-horizontal');
        }
    },
    doneWaiting: function(component, event, helper) {
        if(document.getElementById("Loadingspinner") != null)
            document.getElementById("Loadingspinner").style.display = "none";
    }
})