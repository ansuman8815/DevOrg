({
	doInit : function(component, event, helper) {
		var action = component.get("c.getDataForComponent");
        var patientid = component.get("v.patientid");
        var listName = component.get("v.listName");
        var whereclause = component.get("v.whereClause");
        var tableName = component.get("v.tableName");
        action.setParams({"listName":listName, "whereClauseArg" : whereclause, "isPallet" : "false"});
        action.setCallback(this, function(data) {
        var resultset =  JSON.stringify(data.getReturnValue());
        var res = JSON.parse(resultset);
        var keys = Object.keys(res.data[0]);
        var val = Object.keys(res.data[0]).map(function(key) {
    		return res.data[0][key];
		});
        var noteVal = '';
        for(var i=0; i<keys.length; i++){
        	if(keys[i].indexOf("Note Text") != -1){
            	noteVal += val[i];
            }
        }
        component.set("v.clinicalNotes", noteVal);
        var clinicalNoteData = {};
        var clinicalNotesData=[];
		
		clinicalNoteData.ClinicalNotes=noteVal;
        clinicalNotesData.push(clinicalNoteData);
        var jsdata = res.data;
        var columns = [];  
        var hideColumns = [];
        for(var i in res.columns) {
            var item = res.columns[i];
            if(item.indexOf("Note Text") != -1)
            	hideColumns.push(i);
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
                "aoColumnDefs": [ 
                { "bVisible": false, "aTargets": hideColumns.map(parseFloat)}
                ] ,
                "fnCreatedRow": function( nRow, aData, iDataIndex ) {
                    for(var i in res.columns) {
                        var item = res.columns[i];
                        $(nRow.childNodes[i]).attr('data-label', item);
                    }
                }, 
                "sPaginationType": "full_numbers",
                "bInfo": false,
                "sDom": 't',
                "bSortable": true,
                "oLanguage": 
                {
                    "sEmptyTable":"No data available in table",
                    "oPaginate": 
                    {
                        "sNext": '&gt',
                        "sPrevious": '&lt'
                    }
                }
            });
        });
		$A.enqueueAction(action); 
        
        var windowh = $( window).height();
         setTimeout(function() {
            var patientBh = $("#CliFreezeSection").height();
            var remh = windowh-patientBh-262;
            $('#CliNonFreezeSection').css('max-height',remh);
        }, 100);

    },
     highlightSearch : function(component, event, helper) {
        helper.highlightHelperMethod(component, event, helper);
	},
    clinkOnClose : function(component, event, helper) {	
        document.getElementById("clinicalNotes").style.display = "none";
        $("#column2Div").css("margin-top","0px");
        var cmpDiv1 = document.getElementById("column1Div");
        var cmpDiv2 = document.getElementById("column2Div");
        var cmpDiv4 = document.getElementById("column4Div");  
        $A.util.removeClass(cmpDiv1, 'slds-backdrop slds-backdrop--open');
        $A.util.removeClass(cmpDiv2, 'slds-backdrop slds-backdrop--open');
        $A.util.removeClass(cmpDiv4, 'slds-backdrop slds-backdrop--open');
        if($( window ).width() <= 767){
            $('.footer').css('position','relative');
		}
        var CommunityCloseIconEvent = $A.get("e.c:CommunityCloseIconEvent");
        CommunityCloseIconEvent.fire();
    },
    doneRendering : function(component, event, helper) {
        $(".searchText").click();
        $(".searchText").bind('click', function() {
           helper.highlightHelperMethod(component, event, helper); 
        });
    },
	myAction : function(component, event, helper) {
        $('body').append('<script>svg4everybody();</script>');
	}
})