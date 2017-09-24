({
     doInit : function(component, event, helper) {
        // the function that reads the url parameters
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
        component.set("v.patientid", getUrlParameter('patientid'));
        component.set("v.empi", getUrlParameter('empi'));
        component.set("v.isLoaded", 'true');
       
        var windowh = $( window ).height();
        //New code
     
        var action = component.get("c.checkPatientConsentForCurrentUser");
        action.setParams({
            Accid : component.get("v.patientid"),
            Empi : component.get("v.empi")
        });
        action.setCallback(this, function(a) {
            if (a.getState() === "SUCCESS") {
                if(a.getReturnValue()==null){
                    $('#NonFreezeSection').hide();
                    $("#FreezeSection").hide();
                    $('#LeftBanner').hide();
                    alert('ERROR :The patient you selected has not yet granted your organization consent to access health information through Patient 360');
                    var urlEvent = $A.get("e.force:navigateToURL");
    				urlEvent.setParams({
      				"url": "/"
    				});
    				urlEvent.fire();
                }
            } else if (a.getState() === "ERROR") {
                $A.log("Errors", a.getError());
            }
        });
           $A.enqueueAction(action);
         
        //new code ended
    },
    handleApplicationEventFired : function(component, event, helper) {
        var x = document.getElementById('footerHide');
        x.style.display = 'none';
        var viewDemographics 		= event.getParam("viewDemographics");
        var viewSocialsummary 		= event.getParam("viewSocialsummary");
        var viewEncounterSummary 	= event.getParam("viewEncounterSummary");
        var viewClinicalNotes 		= event.getParam("viewClinicalNotes");
        var viewPopulations 		= event.getParam("viewPopulations");
        var viewLaboratoryResults 	= event.getParam("viewLaboratoryResults");
        var viewDiagnosticReports 	= event.getParam("viewDiagnosticReports");
        var viewMore 				= event.getParam("viewMore");
        var viewCNDetails 			= event.getParam("CNselected");
        var viewEncDetail 			= event.getParam("ESselected");
        var viewECNDetails 			= event.getParam("ECNselected");
        var viewDRDetails 			= event.getParam("DRselected");
        var viewPRDetails 			= event.getParam("PRselected");
        var viewGlobalSearch 		= event.getParam("viewGlobalSearch");
        
        helper.sideBarHelperMethod(component);
        if(viewMore == false){
            component.set("v.noDefaultView", false);
            if(document.getElementById("ClinicalSummary")){
                document.getElementById("ClinicalSummary").classList.add('active');
            }
            component.set("v.currentPage", 'Clinical Summary');
            helper.setSession (component);
            helper.logHIPAAAuditHelperMethod(component, event, helper);
            return;
        }
        
        component.set("v.noDefaultView", true);
        if(viewMore == true ){
            var isSidebar = false;
            
            if(event.getParam("listName")=='Social Determinants of Health'){
                document.getElementById("SocialSummary").classList.add('active');
                component.set("v.currentPage", 'More link on Social determinants');
                helper.setSession (component);
            }
            else if(event.getParam("listName")=='Tobacco Assessment'){
                document.getElementById("SocialSummary").classList.add('active');
                component.set("v.currentPage", 'More link on Tobacco Assessment');
                helper.setSession (component);
            }
            else  if(event.getParam("listName")=='Alcohol Assessment'){
                document.getElementById("SocialSummary").classList.add('active');
                component.set("v.currentPage", 'More link on Alcohol Assessment');
                helper.setSession (component);
            }
            else if (event.getParam("listName").indexOf("Encounter") == -1) {
                document.getElementById("ClinicalSummary").classList.add('active');
                component.set("v.currentPage", 'More link Clinical Summary');
                helper.setSession (component);
            }
            else {
                document.getElementById("EncounterSummary").classList.add('active');
                if(event.getParam("listName")=='Encounter Medications'){
                document.getElementById("EncounterSummary").classList.add('active');
                component.set("v.currentPage", 'More link Encounter Detail');
                helper.setSession (component);
                }
                else if(event.getParam("listName")=='Encounter Diagnoses'){
                document.getElementById("EncounterSummary").classList.add('active');
                component.set("v.currentPage", 'More link Encounter Detail');
                helper.setSession (component);
                }
                else if(event.getParam("listName")=='Encounter Procedures'){
                document.getElementById("EncounterSummary").classList.add('active');
                component.set("v.currentPage", 'More link Encounter Detail');
                helper.setSession (component);
                }
                else if(event.getParam("listName")=='Encounter Clinical Notes'){
                document.getElementById("EncounterSummary").classList.add('active');
                component.set("v.currentPage", 'More link Encounter Detail');
                helper.setSession (component);
                }
                else if(event.getParam("listName")=='Encounter Provider'){
                document.getElementById("EncounterSummary").classList.add('active');
                component.set("v.currentPage", 'More link Encounter Detail');
                helper.setSession (component);
                }
            }
            $A.createComponent(
                "c:P360CommunityDetail",
                {
                    "patientid"		: component.get("v.patientid"),
                    "empi"			: component.get("v.empi"),
                    "whereclause"	: event.getParam("whereclause"),
                    "tableName"		: event.getParam("tableName"),
                    "listName"		: event.getParam("listName"),
                    "pageName"		: event.getParam("pageName"),
                    "isSidebar"		:isSidebar
                    
                },
                function(newData, status, errorMessage){
                    
                    if (status === "SUCCESS") { 
                        var body = component.get("v.body");
                        body = newData;
                        
                        component.set("v.body", body);
                    }
                    else if (status === "INCOMPLETE") {
                        console.log("No response from server or client is offline.");
                    }
                        else if (status === "ERROR") {
                            console.log("Error: " + errorMessage);
                            // Show error message
                        }
                });
        }
        else if(viewDemographics == true){
            component.set("v.currentPage", 'Demographics');
            helper.setSession (component);
            if(document.getElementById("Demographics") != null)
                document.getElementById("Demographics").classList.add('active');
            $A.createComponent(
                "c:P360CommunityDemographics",
                {
                    "aura:id"	: "DemoAuraId",
                    "patientid"	: component.get("v.patientid"),
                    "empi"		: component.get("v.empi")
                },
                function(newData, status, errorMessage){
                    if (status === "SUCCESS") { 
                        var body = component.get("v.body");
                        body = newData;
                        component.set("v.body", body);
                    }
                    else if (status === "INCOMPLETE") {
                        console.log("No response from server or client is offline.");
                    }
                        else if (status === "ERROR") {
                            console.log("Error: " + errorMessage);
                            // Show error message
                        }
                });
        }
        else if(viewCNDetails == true){
            if(event.getParam("searchTerm") == '' || event.getParam("searchTerm") == null)
            	document.getElementById("ClinicalNotes").classList.add('active');
            component.set("v.popupName", 'Clinical Notes Detail');
            component.set("v.header", 'Clinical Notes');
            component.set("v.searchTerm", event.getParam("searchTerm"));
            component.set("v.selectedId", event.getParam("selectedId"));
            component.set("v.showClinicalPopUp", viewCNDetails);
        }
        else if (viewECNDetails == true){
            document.getElementById("EncounterSummary").classList.add('active');
            component.set("v.popupName", 'Clinical Notes Detail');
            component.set("v.header", 'Clinical Notes');
            component.set("v.searchTerm", event.getParam("searchTerm"));
            component.set("v.selectedId", event.getParam("selectedId"));
            component.set("v.showClinicalPopUp", viewECNDetails);
        }
        else if (viewPRDetails == true){
            component.set("v.popupName", 'Encounter Provider');
            component.set("v.searchTerm", event.getParam("searchTerm"));
            component.set("v.selectedId", event.getParam("selectedId"));
            component.set("v.showProviderPopUp", viewPRDetails);
        } 
        else if (viewDRDetails == true){
            if(event.getParam("searchTerm") == '' || event.getParam("searchTerm") == null)
            	document.getElementById("DiagnosticReports").classList.add('active');
            component.set("v.popupName", 'Diagnostic Reports Detail');
            component.set("v.header", 'Diagnostic Reports');
            component.set("v.searchTerm", event.getParam("searchTerm"));
            component.set("v.selectedId", event.getParam("selectedId"));
            component.set("v.showClinicalPopUp", viewDRDetails);
        }
        else if(viewEncDetail == true){
            component.set("v.currentPage", 'Encounter Details');
            component.set("v.encounterId",event.getParam("selectedId"));
            helper.setSession (component);
            document.getElementById("EncounterSummary").classList.add('active');
            $A.createComponent(
                "c:P360CommunityEncounterBanner",
                {
                    "aura:id"		: "ensDetailAuraId",
                    "encounterid"	: event.getParam("selectedId"),
                    "empi"			: component.get("v.empi")
                },
                function(newData, status, errorMessage){
                    if (status === "SUCCESS") { 
                        var body = component.get("v.body");
                        body = newData;
                        component.set("v.body", body);
                    }
                    else if (status === "INCOMPLETE") {
                        console.log("No response from server or client is offline.");
                    }
                        else if (status === "ERROR") {
                            console.log("Error: " + errorMessage);
                            // Show error message
                        }
                });
        }
        else if(viewSocialsummary == true){
            document.getElementById("SocialSummary").classList.add('active');
            component.set("v.currentPage", 'Social Summary');
            helper.setSession (component);
            $A.createComponent(
                "c:P360CommunitySocialSummary",
                {
                    "aura:id"	: "SocSumAuraId",
                    "patientid"	: component.get("v.patientid"),
                    "empi"		: component.get("v.empi")
                },
                function(newData, status, errorMessage){
                    if (status === "SUCCESS") { 
                        var body = component.get("v.body");
                        body = newData;
                        component.set("v.body", body);
                    }
                    else if (status === "INCOMPLETE") {
                        console.log("No response from server or client is offline.");
                    }
                        else if (status === "ERROR") {
                            console.log("Error: " + errorMessage);
                            // Show error message
                        }
                });
        }
        
        else if(viewEncounterSummary == true){
            document.getElementById("EncounterSummary").classList.add('active');
            $A.createComponent(
                "c:P360CommunityDynamicList",
                {
                    "patientid"		: component.get("v.patientid"),
                    "empi"			: component.get("v.empi"),
                    "whereclause"	: component.get("v.empi"),
                    "tableName"		: event.getParam("tableName"),
                    "listName"		: event.getParam("listName"),
                    "isSidebarEvent": true
                },
                function(newData, status, errorMessage){
                    if (status === "SUCCESS") { 
                        var body = component.get("v.body");
                        body = newData;
                        component.set("v.body", body);
                    }
                    else if (status === "INCOMPLETE") {
                        console.log("No response from server or client is offline.");
                    }
                        else if (status === "ERROR") {
                            console.log("Error: " + errorMessage);
                            // Show error message
                        }
                });
            component.set("v.currentPage", "Encounter Summary");
            helper.setSession(component);
        } 
        else if(viewClinicalNotes == true){
            document.getElementById("ClinicalNotes").classList.add('active');
            $A.createComponent(
                "c:P360CommunityDynamicList",
                {
                    "patientid": component.get("v.patientid"),
                    "empi": component.get("v.empi"),
                    "whereclause": component.get("v.empi"),
                    "tableName": event.getParam("tableName"),
                    "listName": event.getParam("listName"),
                    "isSidebarEvent": true
                },
                function(newData, status, errorMessage){
                    if (status === "SUCCESS") { 
                        var body = component.get("v.body");
                        body = newData;
                        component.set("v.body", body);
                    }
                    else if (status === "INCOMPLETE") {
                        console.log("No response from server or client is offline.");
                    }
                        else if (status === "ERROR") {
                            console.log("Error: " + errorMessage);
                            // Show error message
                        }
                });
            component.set("v.currentPage", 'Clinical notes');
            helper.setSession (component);
        }
        else if(viewPopulations == true){
            document.getElementById("Populations").classList.add('active');
            component.set("v.currentPage", "Populations");
            helper.setSession(component);
            $A.createComponent(
                "c:P360CommunityPopulations",
                {
                    "aura:id": "PopupAuraId",
                    "patientid": component.get("v.patientid"),
                    "empi": component.get("v.empi")
                },
                function(newData, status, errorMessage){
                    if (status === "SUCCESS") { 
                        var body = component.get("v.body");
                        body = newData;
                        component.set("v.body", body);
                    }
                    else if (status === "INCOMPLETE") {
                        console.log("No response from server or client is offline.");
                    }
                        else if (status === "ERROR") {
                            console.log("Error: " + errorMessage);
                            // Show error message
                        }
                });
        }
        
        else if(viewLaboratoryResults == true){
            document.getElementById("LaboratoryResults").classList.add('active');
            component.set("v.currentPage", 'Laboratory Results');
            helper.setSession (component);
            $A.createComponent(
                "c:P360CommunityApiDynList",
                {
                    "patientid"		: component.get("v.patientid"),
                    "empi"			: component.get("v.empi"),
                    "whereclause"	: component.get("v.empi"),
                    "tableName"		: event.getParam("tableName"),
                    "listName"		: event.getParam("listName"),
                    "resourceName" 	: 'Observation',
                    "selectId" 		: ''
                },
                function(newData, status, errorMessage){
                    if (status === "SUCCESS") { 
                        var body = component.get("v.body");
                        body = newData;
                        component.set("v.body", body);
                    }
                    else if (status === "INCOMPLETE") {
                        console.log("No response from server or client is offline.");
                    }
                    else if (status === "ERROR") {
                    	console.log("Error: " + errorMessage);
                    }
                });
        }
        else if(viewDiagnosticReports == true){
            document.getElementById("DiagnosticReports").classList.add('active');
            component.set("v.currentPage", 'Diagnostic Reports');
            helper.setSession (component);
            $A.createComponent(
                "c:P360CommunityDynamicList",
                {
                    "patientid"		: component.get("v.patientid"),
                    "empi"			: component.get("v.empi"),
                    "whereclause"	: component.get("v.empi"),
                    "tableName"		: event.getParam("tableName"),
                    "listName"		: event.getParam("listName"),
                    "isSidebarEvent": true
                },
                function(newData, status, errorMessage){
                    if (status === "SUCCESS") { 
                        var body = component.get("v.body");
                        body = newData;
                        component.set("v.body", body);
                    }
                    else if (status === "INCOMPLETE") {
                        console.log("No response from server or client is offline.");
                    }
                        else if (status === "ERROR") {
                            console.log("Error: " + errorMessage);
                        }
                });
        }
        else if(viewGlobalSearch == true){
            component.set("v.currentPage", 'Global Search');
            $A.createComponent(
                "c:P360CommunityGlobalSearch",
                {
                    "patientid"	: component.get("v.patientid"),
                    "empi"		: component.get("v.empi"),
                    "searchTerm": event.getParam("searchString")
                },
                function(newData, status, errorMessage){
                    if (status === "SUCCESS") { 
                        var body = component.get("v.body");
                        body = newData;
                        component.set("v.body", body);
                    }
                    else if (status === "INCOMPLETE") {
                        console.log("No response from server or client is offline.");
                    }
                        else if (status === "ERROR") {
                            console.log("Error: " + errorMessage);
                        }
                });
        } 
        helper.logHIPAAAuditHelperMethod(component, event, helper);
    },
    
    doneWaiting :  function(component, event, helper) {
        var headerHeight = $('#headerComp').innerHeight();
        var winHeight = $(window).height();
        var x = document.getElementById('footerHide');
        var xMargin = $('#footerHide').outerHeight (true) - $('#footerHide').innerHeight (); 
        
        var contentHeight = $('#column3Div').height();
        var dispHeight = contentHeight + headerHeight + xMargin;
        if (winHeight > dispHeight){
            x.style.position = "fixed";
        }else{
            x.style.position = "relative";
        }
        x.style.display = 'block';
	},
    
    handleClinicalNotesEvent : function(component, event, helper) {
        component.set("v.selectedId", '');
        component.set("v.showClinicalPopUp", false);
        component.set("v.showProviderPopUp", false);
    }
})