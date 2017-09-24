({
    doInit : function(component, event, helper) {
        component.set("v.currentPage", 'Global Search');
        helper.setSession (component);
        helper.getResultData(component, event, helper, '');
    },
    displayNoteText : function(component, event, helper) {
        console.log('display Note Text');
    },
    doneRendering: function(component, event, helper) {
        var res = component.get("v.result");
        var recCount = Object.keys(res).length;
        if(recCount > 0)
        {
            component.set("v.resultsFound" , true);
            var viewMore = component.get("v.viewMore");
            for(var i in Object.keys(res)) {
                var tName = Object.keys(res)[i];
                var tName1 = tName;
                tName = tName.replace(/\s+/g, '_');
                var columns = [];
                for(var j in Object(res[tName1])[0]){
                    var item = j;
                    
                    var pos = item.lastIndexOf(' ');
                    var cont = item[pos];
                    var jsdata = Object(res[tName1])[0][j];
                    if(pos == -1){
                        item = item;
                    }
                    else{
                        item = item.substring(0,pos) + ("<br/>") + item.substring(pos+1);
                    }
                    columns.push({
                        "mDataProp" : j, 
                        "sTitle" 	: item,
                        "mRender"	: function(jsdata, type, full) {
                            if(($( window ).width())  >= 768)
                                return jsdata ;
                            else
                                return '<p>' + jsdata + '</p>';
                        }
                    });
                }
                
                columns.reverse();
                $.fn.DataTable.ext.pager.numbers_length = 5;
                $('#' + tName)
                //.on( 'search.dt', function () { getNumFilteredRows(tName); } )
                .dataTable({
                    "bDestroy"		: true,
                    "bRetreive"		: true,
                    "aoColumns" 	: columns,
                    "aaData" 		: Object(res[tName1]),
                    "fnCreatedRow"	: function( nRow, aData, iDataIndex ) {
                        for(var i in columns) {
                            var item = columns[i].mData;
                            $(nRow.childNodes[i]).attr('data-label', item);
                        }
                    },
                    "fnDrawCallback": function( oSettings ) {
                        helper.helperMethod(component, event, helper , tName);
                    },
                    "sPaginationType": "full_numbers",
                    "bInfo": false,
                    "sDom": '<"top"flp>rt<"bottom"ip><"clear">',
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
                    }
                }); 
                helper.helperMethod(component, event, helper , tName);
            }
        }
        else{
            component.set("v.resultsFound" , false);
        }
        
        function getNumFilteredRows(id){
            var info = $('#' +id).DataTable().page.info();
            var recordsDisplay = info.recordsDisplay;
            var recordsTotal = info.recordsTotal;
            var filter = component.set("v.filteredCount",recordsDisplay);
            var total = component.set("v.totalCount",recordsTotal);
            if($(".dataTables_filter input").val().length > 0){
                $('.filtercountVal').css('display','inline-block');
                $('.recCount').css('display','none');
            }
            else{
                $('.filtercountVal').css('display','none');
                $('.recCount').css('display','inline-block');
            }
        }
    },
    
    scriptsLoaded : function(component, event, helper) {
        var target = event.currentTarget;
        var parent = $(target).parent();
        var hcDataComponent = $(target)[0].headerdata;
        helper.logHIPAAAuditHelperMethod(component, event, helper, hcDataComponent);
        $(parent).siblings().find('.expanderContent').hide();
        $(parent).find('.expanderContent').toggle();
        if ($(parent).find('.expanderContent').is(":visible")) {
            $('.ToggleText').html('&#9656;');
            $('.ToggleText',target).html('&#9662;');
            $(parent).find('h3').css({'background-color':'#BBBBBB','color':'#000'});
            $(parent).siblings().find('h3').css({'background-color':'#fff','color':'#000'});
        }
        else{
            $('.ToggleText',target).html('&#9656;');
            $(parent).find('h3').css({'background-color':'#fff','color':'#000'});
        }
        $(parent).find('.dataTables_wrapper').css('display','none');
        $(parent).find('.MoreBtn').css('display','none');
        $(parent).find("#Loadingspinner").css('display','block');
        setTimeout(function() {
            $(parent).find('.dataTables_wrapper').css('display','block');
            $(parent).find('.MoreBtn').css('display','block');
            $(parent).find("#Loadingspinner").css('display','none');
        }, 1000); 
    },
    
    waiting: function(component, event, helper) {
        if(document.getElementById("Loadingspinner") != null)
            document.getElementById("Loadingspinner").style.display = "block";  
    },
    
    doneWaiting: function(component, event, helper) {
        if(document.getElementById("Loadingspinner") != null)
            document.getElementById("Loadingspinner").style.display = "none";
    },
    
    handleCNClicked : function(component, event, helper) {
        var pageName = component.get("v.redirectTo");
        var cnEvent = $A.get("e.c:ClinicalNotesDetailEvent");
        if(pageName == "Clinical Notes")
            cnEvent.setParams({"selectedId": component.get("v.selectedId"), "CNselected" : true , "searchTerm" : component.get("v.searchTerm")});
        else if (pageName == "Encounter Clinical Notes")
            cnEvent.setParams({"selectedId": component.get("v.selectedId"), "ECNselected" : true , "searchTerm" : component.get("v.searchTerm")});
            else if(pageName == "Encounter Summary" || pageName == "Encounter")
                cnEvent.setParams({"selectedId": component.get("v.selectedId"), "ESselected" : true});
                else if(pageName == "Diagnostic Reports")
                    cnEvent.setParams({"selectedId": component.get("v.selectedId"), "DRselected" : true , "searchTerm" : component.get("v.searchTerm")});
                    else if(pageName == "Encounter Provider")
                        cnEvent.setParams({"selectedId": component.get("v.selectedId"), "PRselected" : true});
        
        cnEvent.fire();
        
    },
    viewMore : function(component , event , helper){
        component.set("v.currentPage", 'More link on Global Search');
        helper.setSession (component);
        component.set("v.viewMore" , true);
        var target = event.getSource();
        var listName = target.get("v.name");
        helper.getResultData(component, event, helper, listName);
    },
    highlightSearch : function(component, event, helper) {
        helper.highlightHelperMethod(component, event, helper);
    }
})