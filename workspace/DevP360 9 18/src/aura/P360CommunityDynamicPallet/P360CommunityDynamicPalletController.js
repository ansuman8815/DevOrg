({
    doInit: function(component, event, helper) {
        var spinner = component.find('spinner');
        var evt = spinner.get("e.toggle");
        
        if (!$A.util.hasClass(spinner, 'hideEl'))
            evt.setParams({isVisible: false});
        else     
            evt.setParams({isVisible: true});
        evt.fire();
        var action = component.get("c.getDataForComponent");
        var whereclause = component.get("v.whereclause");
        var tableName = component.get("v.tableName");
        
        //temp Code added by Payal starts        
        var getUrlParameter = function getUrlParameter(sParam) {
            var sPageURL = decodeURIComponent(window.location.search.substring(1)),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;
            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : sParameterName[1];
                }
            }
        };
        
        if (whereclause == null) {
            component.set("v.patientid", getUrlParameter('patientid'));
            component.set("v.empi", getUrlParameter('empi'));
            whereclause = component.get("v.empi");
        }
        var isPallet = component.get("v.isPallet");
        //temp Code added by Payal ends
        
        action.setParams({
            "listName"		: component.get("v.listName"),
            "whereClauseArg": whereclause,
            "isPallet"		: isPallet
        });
        action.setCallback(this, function(data) {
            var res = data.getReturnValue();
            var count = res.count;
            console.log(count);
            component.set("v.count", res.count);
            component.set("v.disclaimer", res.disclaimer);
            var jsdata = JSON.parse(JSON.stringify(res.data));
            
            var columns = [];
            var keys = [];
            for (var i in res.columns) {
                var item = res.columns[i];
                
                columns.push({
                    "mDataProp": item,
                    "sTitle": item,
                    "mRender": function(jsdata, type, full) {
                        if (jsdata.indexOf("<button") == -1) {
                            return '<span data-toggle="tooltip" title="' + jsdata + '">' + jsdata + '</span>';
                        } else {
                            return jsdata;
                        }
                    },
                });
            }
            
            $A.util.addClass(spinner, 'hideEl');
            
            //Transpose Logic starts
            
            if (isPallet == 'div') {
                var custs = [];
                for (var i in Object(jsdata[0])) {
                    custs.push({
                        value: jsdata[0][i],
                        key: i
                    });
                }
                component.set("v.result", custs);
            }
            
            if (isPallet == 'pallet') {
                $('#' + tableName).dataTable({
                    bRetrieve: true,
                    aaData: jsdata,
                    aoColumns: columns,
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
                helper.helperMethod(component);
                helper.helperMethodFooter(component); 
            }
        });
        $A.enqueueAction(action);
    },
    ViewMore: function(component, event, helper) {
        helper.helperMethodFooter(component);
        var action = component.get("c.getDataForComponent");
        var patientid = component.get("v.patientid");
        var listName = component.get("v.listName");
        var whereclause = component.get("v.whereclause");
        var tableName = component.get("v.tableName");
        var pageName = component.get("v.pageName");
        if (listName == 'Encounter') {
            var evt = $A.get("e.c:EncounterSummaryEvent");
            evt.setParams({
                "patientid": patientid,
                "tableName": "encounter_table",
                "listName": "Encounter Summary",
                "viewEncounterSummary": true
            });
            evt.fire();
        } 
        else {
            tableName = tableName + "viewMore";
            var DynamicPalletEvent = $A.get("e.c:DynamicPalletEvent");
            DynamicPalletEvent.setParams({
                "patientid": patientid,
                "whereclause": whereclause,
                "listName": listName,
                "tableName": tableName,
                "pageName": pageName,
                "viewMore": true
            });
            DynamicPalletEvent.fire();
        }
    },
    
    myAction: function(component, event, helper) {
        $('body').append('<script>svg4everybody();</script>');
    },
    
    handleCNClicked: function(component, event, helper) {
        var listName = component.get("v.listName");
        var cnEvent = $A.get("e.c:ClinicalNotesDetailEvent");
        
        if (listName == "Encounter Clinical Notes")
            cnEvent.setParams({
                "selectedId": component.get("v.selectedId"),
                "ECNselected": true
            });
        else if (listName == "Encounter")
            cnEvent.setParams({
                "selectedId": component.get("v.selectedId"),
                "ESselected": true
            });
            else if (listName == "Encounter Provider")
                cnEvent.setParams({
                    "selectedId": component.get("v.selectedId"),
                    "PRselected": true
                });
        cnEvent.fire();
    }
})