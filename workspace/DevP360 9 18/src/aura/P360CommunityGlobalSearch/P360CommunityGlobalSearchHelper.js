({
    helperMethod : function(component , event, helper , tName) {
        var listName = '';
        
        $("#"+tName+" button").click(function (ev) {
            listName = this.name;
            component.set("v.redirectTo" , listName);
            if(listName == "Clinical Notes" || listName == "Encounter Clinical Notes" || listName == "Diagnostic Reports"){
                component.set("v.selectedId" , this.id);
                var compEvent = component.getEvent("cmpNotesEvent");
                compEvent.fire();
                $("#column2Div").css("margin-top","80px");
                if(!$( "#column1Div" ).hasClass( "slds-backdrop slds-backdrop--open" ))
                    document.getElementById("column1Div").className +=" slds-backdrop slds-backdrop--open";
                if(!$( "#column2Div" ).hasClass( "slds-backdrop slds-backdrop--open" ))
                    document.getElementById("column2Div").className +=" slds-backdrop slds-backdrop--open";
                if(!$( "#column4Div" ).hasClass( "slds-backdrop slds-backdrop--open" ))
                    document.getElementById("column4Div").className +=" slds-backdrop slds-backdrop--open";
                if($( window ).width() <= 767){
                    $('.footer').css('position','absolute');
                }
            }
            else if(listName == "Encounter Provider" ){
                $('.search-input-wrapper #searchText').val('');
                component.set("v.selectedId" , this.id);
                var compEvent = component.getEvent("cmpNotesEvent");
                compEvent.fire();
                $("#column2Div").css("margin-top","80px");
                if(!$( "#column1Div" ).hasClass( "slds-backdrop slds-backdrop--open" ))
                    document.getElementById("column1Div").className +=" slds-backdrop slds-backdrop--open";
                if(!$( "#column2Div" ).hasClass( "slds-backdrop slds-backdrop--open" ))
                    document.getElementById("column2Div").className +=" slds-backdrop slds-backdrop--open";
                if(!$( "#column4Div" ).hasClass( "slds-backdrop slds-backdrop--open" ))
                    document.getElementById("column4Div").className +=" slds-backdrop slds-backdrop--open";
                if($( window ).width() <= 767){
                    $('.footer').css('position','absolute');
                }
            }
                else if(listName == "Patient Registries"){
                    $('.search-input-wrapper #searchText').val('');
                    var urlEvent = $A.get("e.force:navigateToURL");
                    urlEvent.setParams({
                        "url": "/patientdetail?patientid="+this.id
                    });
                    urlEvent.fire();
                }
                    else if(listName == "Encounter Summary" || listName == "Encounter" ){
                        $('.search-input-wrapper #searchText').val('');
                        component.set("v.selectedId" , this.id);
                        var compEvent = component.getEvent("cmpNotesEvent");
                        compEvent.fire();
                    }
        });   
    },
    
    getResultData : function(component , event, helper, listName) {
        var listName = listName;
        var action = component.get("c.getSearchResult");
        action.setParams({
            patientId  	: 	component.get("v.patientid"),
            searchTerm 	: 	component.get("v.searchTerm"),
            listName 	:	listName,
            empi 		:	component.get("v.empi")
        });
        action.setCallback(this,function(response){
            var state = response.getState();
            if (state == 'SUCCESS') {
                var tableHeader = [];
                var res = JSON.parse(response.getReturnValue());
                component.set("v.result",res);
                for(var i in Object.keys(res)) {
                    var tName = Object.keys(res)[i];
                    var countVal = 0;
                    var recordCount = Object(res[tName]).length;
                    if(recordCount < 10 || listName != '')
                        countVal = recordCount;
                    else
                        countVal = '10+';
                    var tName = Object.keys(res)[i];
                    var tNameReplace = tName.replace(/\s+/g, '_');
                    tableHeader.push({value:tName, key:tNameReplace, count:countVal});
                }
                component.set("v.tableHeader" , tableHeader);
            }
        });
        $A.enqueueAction(action);
    },
    setSession : function(component) {
        var sessionAction = component.get("c.updateUserSession");
        sessionAction.setParams({          
            currentPage : component.get("v.currentPage"),
            encounterId : component.get("v.encounterId")
        });
        sessionAction.setCallback(this, function(response)
                                  {
                                      var state = response.getState();
                                      if (state === "SUCCESS")
                                      {
                                          var res = response.getReturnValue();
                                      }
                                      else
                                      {
                                          console.log('Error');
                                      }
                                  });
        $A.enqueueAction(sessionAction);
    },
    logHIPAAAuditHelperMethod : function(component, event, helper, hcDataComponent) {
        var action =component.get("c.logHIPAAAudit");
        action.setParams({"empi" : component.get("v.empi"),
                          "hc_DataComponent" : hcDataComponent});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log(state);
            }
        });
        $A.enqueueAction(action);
    },
    highlightHelperMethod : function(component, event, helper) {
        var searchTerm = document.getElementById("searchText").value;
        var textContainer = $("#focusInput");
        if(searchTerm != ""){
            var query =  new RegExp("("+searchTerm+")", "gim");
            var e = document.getElementById("focusInput").innerText;
            var enew = e.replace(/(<span>|<\/span>)/igm, "");
            document.getElementById("focusInput").innerHTML = enew;
            var newe = enew.replace(query, "<span>$1</span>");
            document.getElementById("focusInput").innerHTML = newe;
        }
        else if(textContainer.find("span").length > 1){
            var tempText = document.getElementById("focusInput").innerText;
            var newText = tempText.replace(/(<span>|<\/span>)/igm, "");                       
            document.getElementById("focusInput").innerHTML = newText;
        }
    }
})