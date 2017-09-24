({
    helperMethodFooter: function(component , event, helper) {
        var headerHeight = $('#headerComp').innerHeight();
        var winHeight = $(window).height();
        if(document.getElementById('footerHide')){
            var x = document.getElementById('footerHide');
            var xMargin = $('#footerHide').outerHeight (true) - $('#footerHide').innerHeight (); 
            var contentHeight = $('#column3Div').height();
            var dispHeight = contentHeight + headerHeight + xMargin;
            if (winHeight > dispHeight){
                x.style.position = "fixed";
            }else{
                x.style.position = "relative";
            } //}, 100);
            x.style.display = 'block';
                }
        console.log('End of footer helper method');
    },
    fetchApiData : function(component)
    { 
        var action = component.get("c.getFHIRQueryResult");
        action.setParams({
                          "resourceName"	: component.get("v.resourceName"),
                          "empi"			: component.get("v.empi"),
                          "selectedId"	    : component.get("v.selectedId")
                         });
        action.setBackground();
        action.setCallback(this, function(data) {
            var res = data.getReturnValue();
            this.tableCreation(component);
            if(res != ''){
            	console.log('Erorrrrrrrrrrrrrr');
				component.set("v.errorMsg" , res);
                //document.getElementById("errorpopUp").innerHTML = res;
                //document.getElementsByClassName("top")[0].style.position= 'relative'; 
                //document.getElementsByClassName("top")[0].style.bottom=  75 + "px";
            }
        });
        $A.enqueueAction(action); 
    },
    tableCreation : function(component)  
    {
        var action		= component.get("c.getDataForComponent");
        var listName	= component.get("v.listName");
        var whereclause = component.get("v.whereclause");
        var tableName   = component.get("v.tableName");
        action.setParams({
                          "listName"		: component.get("v.listName"), 
                          "whereClauseArg"  : whereclause, 
                          "resourceName" 	: component.get("v.resourceName"),
                          "empi"			: component.get("v.empi"),
                          "isPallet"		: component.get("v.isPallet")
                         });
        //if(typeof whereclause !== "undefined"){
            action.setCallback(this, function(data) { 
                var resultset =  JSON.stringify(data.getReturnValue());
                component.set("v.result",resultset);
                var getresult = component.get("v.result");
                var res = JSON.parse(getresult);
                var jsdata = res.data;
                component.set("v.count" , res.count);
                
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
                   //     item = item.substring(0,pos) + ("<br/>") + item.substring(pos+1);
                    }
                    var s= item.substring(0,pos);
                    var x = item.substring(pos+1);
                    columns.push({
                        "mDataProp" : tabHead, 
                        "sTitle"	: item,
                        "mRender"	: function(jsdata, type, full) {
                            if(($( window ).width())  >= 768)
                                return jsdata ;
                            else
                                return '<p>' + jsdata + '</p>';
                        }
                    });
                }
                var tableName = component.get("v.tableName");
                var spinner = component.find('spinner');
                $A.util.addClass(spinner, 'hideEl');
                $('#' + tableName).dataTable({
                    aaData		: jsdata,
                    aoColumns	: columns,
                    "bPaginate": false,
                    "sPaginationType": "full_numbers",
                    "bFilter": false,
                    "bInfo": false,
                    "sDom": '<"top"flp>rt<"bottom"i><"clear">',
                    "aaSorting": [],
                    "oLanguage": {
                        "sEmptyTable": "No data available",
                        "oPaginate": {
                            "sNext": '&gt',
                            "sPrevious": '&lt'
                        }
                    },
                });
            });
            $A.enqueueAction(action);
       // }
    }
})