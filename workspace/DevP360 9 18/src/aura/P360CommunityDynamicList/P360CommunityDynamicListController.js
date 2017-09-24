({
    doInit : function(component, event, helper) {
        var action = component.get("c.getDataForComponent");
        var patientid = component.get("v.patientid");
        var listName = component.get("v.listName");
        var whereclause = component.get("v.whereclause");
        var tableName = component.get("v.tableName");
        tableName = tableName + "viewMore"; 
        action.setParams({"listName":listName, 
                          "whereClauseArg" : whereclause, 
                          "isPallet" : "false"});
        if(typeof whereclause !== "undefined"){
            action.setCallback(this, function(data) { 
                var resultset =  JSON.stringify(data.getReturnValue());
                component.set("v.result",resultset);
                var getresult = component.get("v.result");
                var res = JSON.parse(getresult);
                var jsdata = res.data;                
                component.set("v.count" , res.count);
                component.set("v.disclaimer" , res.disclaimer);
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
                        "sTitle" : item,
                        "mRender": function(jsdata, type, full) {
                            if(($( window ).width())  >= 768)
                            	return jsdata ;
                            else
                                return '<p>' + jsdata + '</p>';
                    	}
                    });
                } 
                
                $.fn.DataTable.ext.pager.numbers_length = 5;
                var tableName = component.get("v.tableName");
                $('#' + tableName)
                .on( 'search.dt', function () { getNumFilteredRows(tableName); } )
                .dataTable({
                    "bRetrieve" : true,
                    responsive: true,
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
                    "sPaginationType": "full_numbers",
                    "bInfo": false,
                    "sDom": '<"top"flp>rt<"bottom"ilp><"clear">',
                    "aaSorting": [],
                    "oLanguage": 
                    {
                        "sSearch": "Find: ",
                        "lengthMenu": "Display _MENU_ records per page",
                        "sEmptyTable":"No data available",
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
        }
        
        function getNumFilteredRows(id){
            var info = $('#' +id).DataTable().page.info();
            var recordsDisplay = info.recordsDisplay;
            var recordsTotal = info.recordsTotal;
            var filter = component.set("v.filteredCount",recordsDisplay);
            var total = component.set("v.totalCount",recordsTotal);
            var listName = component.get("v.listName").toString();
            if(listName == 'Registries'){
                if($(".dataTables_filter input").val().length > 0){
                    $('#registryTable .filtercountVal').css('display','inline-block');
                    $('#registryTable .countValue').css('display','none');
                }
                else{
                    $('#registryTable .filtercountVal').css('display','none');
                    $('#registryTable .countValue').css('display','inline-block');
                }
            }
            else if(listName == 'Performance Metrics'){
                if($(".dataTables_filter input").val().length > 0){
                    $('#metricsTable .filtercountVal').css('display','inline-block');
                    $('#metricsTable .countValue').css('display','none');
                }
                else{
                    $('#metricsTable .filtercountVal').css('display','none');
                    $('#metricsTable .countValue').css('display','inline-block');
                }
            }
                else{
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
            console.log("added");
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
    },
    myAction : function(component, event, helper) {
        $('head').append('<meta http-equiv="x-ua-compatible" content="ie=edge">');
        $('body').append('<script>svg4everybody();</script>');  
    },
    
    palletView : function(component, event, helper) {
        var listName = component.get("v.listName");
        var pageName = component.get("v.pageName");
        var cmpClinicalSummary = component.find('ClinicalSummary');
        var cmpDemographics = component.find('Demographics');
        var cmpEncounterSummary = component.find('EncounterSummary');
        if(pageName == 'Encounter Summary'){
            var cnEvent = $A.get("e.c:ClinicalNotesDetailEvent");
            cnEvent.setParams({"selectedId": component.get("v.whereclause"), "ESselected" : true});
            cnEvent.fire();
        }
        else{
            var evt = $A.get("e.c:DynamicPalletEvent");
            evt.setParams({ "viewMore": false});
            evt.fire();
        }
    },
    
    expandView : function(component, event, helper) {
        component.set("v.isExpand" , true);
        var listName = component.get("v.listName").toString();
        if(listName == 'Registries'){
            if(document.getElementById("metricsTable"))
                document.getElementById("metricsTable").style.display = "none"; 
            if(document.getElementById("registryTable"))
                document.getElementById("registryTable").style.display = "block";  
            if(document.getElementById("iconDivId"))
                document.getElementById("iconDivId").style.display = "none";
            document.getElementById("column3Div").className = " slds-modal slds-modal--large slds-fade-in-open expandModal";
            document.getElementById("column3Content").style.marginLeft = "20px";
            if(document.getElementById("closeButton"))
                document.getElementById("closeButton").style.display = "block";
            $("#column2Div").css("margin-top","80px");
            document.getElementById("column1Div").className +=" slds-backdrop slds-backdrop--open";
            document.getElementById("column2Div").className +=" slds-backdrop slds-backdrop--open";
            document.getElementById("column4Div").className +=" slds-backdrop slds-backdrop--open";
            var patSummaryDiv = document.getElementById("patientSummaryDiv");
            $A.util.removeClass(patSummaryDiv, 'patientSummary');
            document.getElementById("patientSummaryDiv").className +=" expandPatientSummary";
            if(document.getElementById("otherDetailExpand"))
                document.getElementById("otherDetailExpand").style.display = "block";
            if(document.getElementById("otherDetails"))
                document.getElementById("otherDetails").style.display = "none";
            
            if(($( window ).width() <= 850) && ($( window ).width() >= 768)){
                
                if(document.getElementById("otherDetailExpand"))
                    document.getElementById("otherDetailExpand").style.display = "none";
                if(document.getElementById("otherDetails"))
                    document.getElementById("otherDetails").style.display = "block";
                if(document.getElementById("fourthcol"))
                    document.getElementById("fourthcol").style.display = "none";
            }
        }
        else if(listName == 'Performance Metrics'){
            if(document.getElementById("registryTable"))
                document.getElementById("registryTable").style.display = "none";  
            if(document.getElementById("metricsTable"))
                document.getElementById("metricsTable").style.display = "block";
            if(document.getElementById("iconDivId"))
                document.getElementById("iconDivId").style.display = "none";
            document.getElementById("column3Div").className = " slds-modal slds-modal--large slds-fade-in-open expandModal";
            if(document.getElementById("column3Content"))
                document.getElementById("column3Content").style.marginLeft = "20px";
            if(document.getElementById("closeButton"))
                document.getElementById("closeButton").style.display = "block";
             $("#column2Div").css("margin-top","80px");
            document.getElementById("column1Div").className +=" slds-backdrop slds-backdrop--open";
            document.getElementById("column2Div").className +=" slds-backdrop slds-backdrop--open";
            document.getElementById("column4Div").className +=" slds-backdrop slds-backdrop--open";
            var patSummaryDiv = document.getElementById("patientSummaryDiv");
            $A.util.removeClass(patSummaryDiv, 'patientSummary');
            document.getElementById("patientSummaryDiv").className +=" expandPatientSummary";
            if(document.getElementById("otherDetailExpand"))
                document.getElementById("otherDetailExpand").style.display = "block";
            if(document.getElementById("otherDetails"))
                document.getElementById("otherDetails").style.display = "none";
            
            if(($( window ).width() <= 850) && ($( window ).width() >= 768)){
                if(document.getElementById("otherDetailExpand"))
                    document.getElementById("otherDetailExpand").style.display = "none";
                if(document.getElementById("otherDetails"))
                    document.getElementById("otherDetails").style.display = "block";
                if(document.getElementById("fourthcol"))
                    document.getElementById("fourthcol").style.display = "none";
            }
        }
            else{
                 
                document.getElementById("iconDivId").style.display = "none";
                document.getElementById("column3Div").className = " slds-modal slds-modal--large slds-fade-in-open expandModal";
                document.getElementById("column3Content").style.marginLeft = "20px";
                document.getElementById("closeButton").style.display = "block";
                $("#column2Div").css("margin-top","80px");
                document.getElementById("column1Div").className +=" slds-backdrop slds-backdrop--open";
                document.getElementById("column2Div").className +=" slds-backdrop slds-backdrop--open";
                document.getElementById("column4Div").className +=" slds-backdrop slds-backdrop--open";
                var patSummaryDiv = document.getElementById("patientSummaryDiv");
                $A.util.removeClass(patSummaryDiv, 'patientSummary');
                document.getElementById("patientSummaryDiv").className +=" expandPatientSummary";
                document.getElementById("otherDetailExpand").style.display = "block";
                document.getElementById("otherDetails").style.display = "none";
                
                if(($( window ).width() <= 850) && ($( window ).width() >= 768)){
                    
                    document.getElementById("otherDetailExpand").style.display = "none";
                    document.getElementById("otherDetails").style.display = "block";
                    if(document.getElementById("fourthcol"))
                        document.getElementById("fourthcol").style.display = "none";
                }
                
                var isSidebarEvent = component.get("v.isSidebarEvent");
               
                if(isSidebarEvent == true){
                    var encSummaryDiv = document.getElementById("encounterSumHead");
                    $A.util.removeClass(encSummaryDiv, 'encSumHead');
                    document.getElementById("encounterSumHead").className +=" expandEncSum";
                }
                else {
                    
                    var drpDown = document.getElementById("dropdownDiv");
                    $A.util.removeClass(drpDown, 'dropDown');
                    document.getElementById("dropdownDiv").className +=" expandDropdown";
                    
                }
            }
    },
    
    handleCNClicked : function(component, event, helper) {
        
        var listName = component.get("v.listName");
        var cnEvent = $A.get("e.c:ClinicalNotesDetailEvent");        
        if(listName == "Clinical Notes")
            cnEvent.setParams({"selectedId": component.get("v.selectedId"), "CNselected" : true});
        else if (listName == "Encounter Clinical Notes" )
			cnEvent.setParams({"selectedId": component.get("v.selectedId"), "ECNselected" : true});
        else if(listName == "Encounter Summary" || listName == "Encounter")
			cnEvent.setParams({"selectedId": component.get("v.selectedId"), "ESselected" : true});
		else if(listName == "Diagnostic Reports")
			cnEvent.setParams({"selectedId": component.get("v.selectedId"), "DRselected" : true});
		else if(listName == "Encounter Provider")
			cnEvent.setParams({"selectedId": component.get("v.selectedId"), "PRselected" : true});        
        cnEvent.fire();        
    },
    
    waiting: function(component, event, helper) {
        
        if(document.getElementById("Loadingspinner") != null)
            document.getElementById("Loadingspinner").style.display = "block";
    },
    
    doneWaiting: function(component, event, helper) {
       
        if(document.getElementById("Loadingspinner") != null)
            document.getElementById("Loadingspinner").style.display = "none";
    }
    
})