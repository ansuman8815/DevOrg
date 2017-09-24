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
        
        //set the src param value to my src attribute
        component.set("v.patientid", getUrlParameter('patientid'));
        component.set("v.isLoaded", 'true');
        
        //new code
     
            var action = component.get("c.checkPatientConsentForCurrentUser");
        action.setParams({
            Accid :getUrlParameter('patientid'),
            Empi : getUrlParameter('empi')
        });
        action.setCallback(this, function(a) {
            if (a.getState() === "SUCCESS") {
                if(a.getReturnValue()==null){
                    $('#LeftBanner').hide();
                }
                else{
                            var action = component.get("c.getLoggedInUserProfile");
                            action.setCallback(this,function(response){
                                var state = response.getState();
                                
                                if (state == 'SUCCESS') {
                                    component.set("v.profilename", response.getReturnValue());
                                    if(response.getReturnValue() == $A.get("$Label.c.P360CommunityBasicAccess")){
                                      
                                        helper.demographicsHelperMethod(component, event, helper);
                                    }
                                    else{
                                        helper.clinicalHelperMethod(component, event, helper);
                                    }
                                }
                            });
                            $A.enqueueAction(action);
                }
            } else if (a.getState() === "ERROR") {
                $A.log("Errors", a.getError());
            }
        });
    
        $A.enqueueAction(action);
       
        //new code ended
        /*
        var action = component.get("c.getLoggedInUserProfile");
        action.setCallback(this,function(response){
        	var state = response.getState();
           // console.log('state :: ' + state);
            if (state == 'SUCCESS') {
            	component.set("v.profilename", response.getReturnValue());
             //  console.log(response.getReturnValue());
                if(response.getReturnValue() == $A.get("$Label.c.P360CommunityBasicAccess")){
                   // console.log('cmpiffff'); 
        			helper.demographicsHelperMethod(component, event, helper);
                }
                else{
                  console.log('cmpClinicalSummary'); 
                    helper.clinicalHelperMethod(component, event, helper);
                }
            }
        });
        $A.enqueueAction(action);
        */
          $(window).resize(function () {
            var height = $(window).height();
            var width = $(window).width();
            if (height > width) {
            }
            if (height < width) {
               var extendside = document.getElementById('mobileSidebar');
               $A.util.removeClass(extendside, 'extendwidth');
               var closeIconvar = document.getElementById('closeIcon');
               $A.util.removeClass(closeIconvar, 'visibleTrue');
            }
        });
        
    }, 
    
    // method on click of Clinical Summary option from side bar
    clinicalSummaryClick : function(component, event, helper) {
        helper.clinicalHelperMethod(component, event, helper);
	},
    
    // method on click of Social Summary option from side bar
    socialSummaryClick : function(component, event, helper) {
        var mobileMenuDisplay = document.getElementById('mobileSidebar');
       	$A.util.addClass(mobileMenuDisplay, 'active');
        var Mobilemask = document.getElementById('maskMobile');
      	$A.util.addClass(Mobilemask, 'active');
       var MobilemaskClass = document.getElementById('maskMobile');
        $A.util.removeClass(MobilemaskClass, 'slds-backdrop slds-backdrop--open');
        var MobilemaskClassOpen = document.getElementById('closeIcon');
        $A.util.addClass(MobilemaskClassOpen, 'hideEl');
        var MobilemaskClassClose = document.getElementById('OpenIcon');
        $A.util.removeClass(MobilemaskClassClose, 'hideEl');
        $('.search-input-wrapper #searchText').val('');
		var cmpClinicalSummary = component.find('ClinicalSummary');
        var cmpDemographics = component.find('Demographics');
        var cmpSocialSummary = component.find('SocialSummary');
        var cmpEncounterSummary = component.find('EncounterSummary');
        var cmpClinicalNotes = component.find('ClinicalNotes');
        var cmpPopulations = component.find('Populations');
        var cmpLaboratoryResults = component.find('LaboratoryResults');
        var cmpDiagnosticReports = component.find('DiagnosticReports');
        $A.util.removeClass(cmpClinicalSummary, 'active');
        $A.util.removeClass(cmpDemographics, 'active');
        $A.util.addClass(cmpSocialSummary, 'active');
        $A.util.removeClass(cmpEncounterSummary, 'active');
        $A.util.removeClass(cmpClinicalNotes, 'active');
        $A.util.removeClass(cmpPopulations, 'active');
        $A.util.removeClass(cmpLaboratoryResults, 'active');
        $A.util.removeClass(cmpDiagnosticReports, 'active');
        var evt = $A.get("e.c:SocialSummaryEvent");
        evt.setParams({ "viewSocialsummary" : true });
        evt.fire();
	},
    // method on click of Demographics option from side bar
    demographicsClick : function(component, event, helper) {
        helper.demographicsHelperMethod(component, event, helper);
	},
    // method on click of Demographics option from side bar
    demoGraphicSelection : function(component, event, helper) {
        var mobileMenuDisplay = document.getElementById('mobileSidebar');
       	$A.util.addClass(mobileMenuDisplay, 'active');
        var Mobilemask = document.getElementById('maskMobile');
      	$A.util.addClass(Mobilemask, 'active');
       var MobilemaskClass = document.getElementById('maskMobile');
        $A.util.removeClass(MobilemaskClass, 'slds-backdrop slds-backdrop--open');
        var MobilemaskClassOpen = document.getElementById('closeIcon');
        $A.util.addClass(MobilemaskClassOpen, 'hideEl');
        var MobilemaskClassClose = document.getElementById('OpenIcon');
        $A.util.removeClass(MobilemaskClassClose, 'hideEl');
        $('.search-input-wrapper #searchText').val('');
		var cmpClinicalSummary = component.find('ClinicalSummary');
        var cmpDemographics = component.find('Demographics');
        var cmpSocialSummary = component.find('SocialSummary');
        var cmpEncounterSummary = component.find('EncounterSummary');
        var cmpClinicalNotes = component.find('ClinicalNotes');
        var cmpPopulations = component.find('Populations');
        var cmpLaboratoryResults = component.find('LaboratoryResults');
        var cmpDiagnosticReports = component.find('DiagnosticReports');
        $A.util.removeClass(cmpClinicalSummary, 'active');
        $A.util.addClass(cmpDemographics, 'active');
        $A.util.removeClass(cmpSocialSummary, 'active');
        $A.util.removeClass(cmpEncounterSummary, 'active');
        $A.util.removeClass(cmpClinicalNotes, 'active');
        $A.util.removeClass(cmpPopulations, 'active');
        $A.util.removeClass(cmpLaboratoryResults, 'active');
        $A.util.removeClass(cmpDiagnosticReports, 'active');
   },
             
    // method on click of Encounter Summary option from side bar
    encounterSummaryClick : function(component, event, helper) {
        var mobileMenuDisplay = document.getElementById('mobileSidebar');
       	$A.util.addClass(mobileMenuDisplay, 'active');
        var Mobilemask = document.getElementById('maskMobile');
      	$A.util.addClass(Mobilemask, 'active');
       var MobilemaskClass = document.getElementById('maskMobile');
        $A.util.removeClass(MobilemaskClass, 'slds-backdrop slds-backdrop--open');
        var MobilemaskClassOpen = document.getElementById('closeIcon');
        $A.util.addClass(MobilemaskClassOpen, 'hideEl');
        var MobilemaskClassClose = document.getElementById('OpenIcon');
        $A.util.removeClass(MobilemaskClassClose, 'hideEl');
        $('.search-input-wrapper #searchText').val('');
        var cmpClinicalSummary = component.find('ClinicalSummary');
        var cmpDemographics = component.find('Demographics');
        var cmpSocialSummary = component.find('SocialSummary');
        var cmpEncounterSummary = component.find('EncounterSummary');
        var cmpClinicalNotes = component.find('ClinicalNotes');
        var patientid = component.get("v.patientid");
        var cmpPopulations = component.find('Populations');
        var cmpLaboratoryResults = component.find('LaboratoryResults');
        var cmpDiagnosticReports = component.find('DiagnosticReports');
        $A.util.removeClass(cmpClinicalSummary, 'active');
        $A.util.removeClass(cmpDemographics, 'active');
        $A.util.removeClass(cmpSocialSummary, 'active');
		$A.util.addClass(cmpEncounterSummary, 'active'); 
        $A.util.removeClass(cmpClinicalNotes, 'active');
        $A.util.removeClass(cmpPopulations, 'active');
        $A.util.removeClass(cmpLaboratoryResults, 'active');
         $A.util.removeClass(cmpDiagnosticReports, 'active');
        var evt = $A.get("e.c:EncounterSummaryEvent");
        evt.setParams({ "patientid" : patientid });
        evt.setParams({ "tableName" : "encounter_table" });
        evt.setParams({ "listName" : "Encounter Summary" });
        evt.setParams({ "viewEncounterSummary" : true });
        evt.fire();
    },
    
    // method on click of Laboratory Result option from side bar
    laboratoryResultsClick : function(component, event, helper) {
        var mobileMenuDisplay = document.getElementById('mobileSidebar');
       	$A.util.addClass(mobileMenuDisplay, 'active');
        var Mobilemask = document.getElementById('maskMobile');
      	$A.util.addClass(Mobilemask, 'active');
       var MobilemaskClass = document.getElementById('maskMobile');
        $A.util.removeClass(MobilemaskClass, 'slds-backdrop slds-backdrop--open');
        var MobilemaskClassOpen = document.getElementById('closeIcon');
        $A.util.addClass(MobilemaskClassOpen, 'hideEl');
        var MobilemaskClassClose = document.getElementById('OpenIcon');
        $A.util.removeClass(MobilemaskClassClose, 'hideEl');
        $('.search-input-wrapper #searchText').val('');
        var cmpClinicalSummary = component.find('ClinicalSummary');
        var cmpDemographics = component.find('Demographics');
        var cmpSocialSummary = component.find('SocialSummary');
        var cmpEncounterSummary = component.find('EncounterSummary');
        var cmpClinicalNotes = component.find('ClinicalNotes');
        var patientid = component.get("v.patientid");
        var cmpPopulations = component.find('Populations');
        var cmpLaboratoryResults = component.find('LaboratoryResults');
         var cmpDiagnosticReports = component.find('DiagnosticReports');
        $A.util.removeClass(cmpClinicalSummary, 'active');
        $A.util.removeClass(cmpDemographics, 'active');
        $A.util.removeClass(cmpSocialSummary, 'active');
		$A.util.removeClass(cmpEncounterSummary, 'active'); 
        $A.util.removeClass(cmpClinicalNotes, 'active');
        $A.util.removeClass(cmpPopulations, 'active');
        $A.util.addClass(cmpLaboratoryResults, 'active');
         $A.util.removeClass(cmpDiagnosticReports, 'active');
        var evt = $A.get("e.c:DiagnosticResultsEvent");
        evt.setParams({ "patientid" : patientid });
        evt.setParams({ "tableName" : "LaboratoryResults_table" });
        evt.setParams({ "listName" : "Laboratory Results" });
        evt.setParams({ "viewLaboratoryResults" : true });
        evt.fire();
    },
    
    // method on click of Diagnostic Reports option from side bar
    diagnosticReportsClick : function(component, event, helper) {
        var mobileMenuDisplay = document.getElementById('mobileSidebar');
       	$A.util.addClass(mobileMenuDisplay, 'active');
        var Mobilemask = document.getElementById('maskMobile');
      	$A.util.addClass(Mobilemask, 'active');
       var MobilemaskClass = document.getElementById('maskMobile');
        $A.util.removeClass(MobilemaskClass, 'slds-backdrop slds-backdrop--open');
        var MobilemaskClassOpen = document.getElementById('closeIcon');
        $A.util.addClass(MobilemaskClassOpen, 'hideEl');
        var MobilemaskClassClose = document.getElementById('OpenIcon');
        $A.util.removeClass(MobilemaskClassClose, 'hideEl');
        $('.search-input-wrapper #searchText').val('');
        var cmpClinicalSummary = component.find('ClinicalSummary');
        var cmpDemographics = component.find('Demographics');
        var cmpSocialSummary = component.find('SocialSummary');
        var cmpEncounterSummary = component.find('EncounterSummary');
        var cmpClinicalNotes = component.find('ClinicalNotes');
        var patientid = component.get("v.patientid");
        var cmpPopulations = component.find('Populations');
        var cmpLaboratoryResults = component.find('LaboratoryResults');
        var cmpDiagnosticReports = component.find('DiagnosticReports');
        
        $A.util.removeClass(cmpClinicalSummary, 'active');
        $A.util.removeClass(cmpDemographics, 'active');
        $A.util.removeClass(cmpSocialSummary, 'active');
		$A.util.removeClass(cmpEncounterSummary, 'active'); 
        $A.util.removeClass(cmpClinicalNotes, 'active');
        $A.util.removeClass(cmpPopulations, 'active');
        $A.util.removeClass(cmpLaboratoryResults, 'active');
        $A.util.addClass(cmpDiagnosticReports,'active');
        
        var evt = $A.get("e.c:DiagnosticReportsEvent");
        evt.setParams({ "patientid" : patientid });
        evt.setParams({ "tableName" : "DiagnosticReports_table" });
        evt.setParams({ "listName" : "Diagnostic Reports" });
        evt.setParams({ "viewDiagnosticReports" : true });
        evt.fire();
    },
    
    // method on click of Clinical Notes option from side bar
    clinicalNotesClick : function(component, event, helper) {
        var mobileMenuDisplay = document.getElementById('mobileSidebar');
       	$A.util.addClass(mobileMenuDisplay, 'active');
        var Mobilemask = document.getElementById('maskMobile');
      	$A.util.addClass(Mobilemask, 'active');
       var MobilemaskClass = document.getElementById('maskMobile');
        $A.util.removeClass(MobilemaskClass, 'slds-backdrop slds-backdrop--open');
        var MobilemaskClassOpen = document.getElementById('closeIcon');
        $A.util.addClass(MobilemaskClassOpen, 'hideEl');
        var MobilemaskClassClose = document.getElementById('OpenIcon');
        $A.util.removeClass(MobilemaskClassClose, 'hideEl');
        
        $('.search-input-wrapper #searchText').val('');
        var cmpClinicalSummary = component.find('ClinicalSummary');
        var cmpDemographics = component.find('Demographics');
        var cmpSocialSummary = component.find('SocialSummary');
        var patientid = component.get("v.patientid");
        var cmpEncounterSummary = component.find('EncounterSummary');
        var cmpClinicalNotes = component.find('ClinicalNotes');
        var cmpPopulations = component.find('Populations');
        var cmpLaboratoryResults = component.find('LaboratoryResults');
        var cmpDiagnosticReports = component.find('DiagnosticReports');

        $A.util.removeClass(cmpClinicalSummary, 'active');
        $A.util.removeClass(cmpDemographics, 'active');
        $A.util.removeClass(cmpSocialSummary, 'active');
        $A.util.removeClass(cmpEncounterSummary, 'active');
        $A.util.addClass(cmpClinicalNotes, 'active');
        $A.util.removeClass(cmpPopulations, 'active');
        $A.util.removeClass(cmpLaboratoryResults, 'active');
        $A.util.removeClass(cmpDiagnosticReports, 'active');
        
        var evt = $A.get("e.c:ClinicalNotesEvent");
        evt.setParams({ "patientid" : patientid });
        evt.setParams({ "tableName" : "clinicalNotes_table" });
        evt.setParams({ "listName" : "Clinical Notes" });
        evt.setParams({ "viewClinicalNotes" : true });
        evt.fire();
    },
    // population tab click
    populationsClick : function(component, event, helper) {
        var mobileMenuDisplay = document.getElementById('mobileSidebar');
       	$A.util.addClass(mobileMenuDisplay, 'active');
        var Mobilemask = document.getElementById('maskMobile');
      	$A.util.addClass(Mobilemask, 'active');
       var MobilemaskClass = document.getElementById('maskMobile');
        $A.util.removeClass(MobilemaskClass, 'slds-backdrop slds-backdrop--open');
        var MobilemaskClassOpen = document.getElementById('closeIcon');
        $A.util.addClass(MobilemaskClassOpen, 'hideEl');
        var MobilemaskClassClose = document.getElementById('OpenIcon');
        $A.util.removeClass(MobilemaskClassClose, 'hideEl');
        
        $('.search-input-wrapper #searchText').val('');
        var cmpClinicalSummary = component.find('ClinicalSummary');
        var cmpDemographics = component.find('Demographics');
        var cmpSocialSummary = component.find('SocialSummary');
        var patientid = component.get("v.patientid");
        var cmpEncounterSummary = component.find('EncounterSummary');
        var cmpClinicalNotes = component.find('ClinicalNotes');
        var cmpPopulations = component.find('Populations');
        var cmpLaboratoryResults= component.find('LaboratoryResults');
        
        $A.util.removeClass(cmpClinicalSummary, 'active');
        $A.util.removeClass(cmpDemographics, 'active');
        $A.util.removeClass(cmpSocialSummary, 'active');
        $A.util.removeClass(cmpEncounterSummary, 'active');
        $A.util.removeClass(cmpClinicalNotes, 'active');
        $A.util.addClass(cmpPopulations, 'active');
        $A.util.removeClass(cmpLaboratoryResults, 'active');
        
        var evt = $A.get("e.c:PopulationsEvent");
        evt.setParams({ "patientid" : patientid });
        evt.setParams({ "tableName" : "Populations_table"});
        evt.setParams({ "listName" : "Populations" });
        evt.setParams({ "viewPopulations" : true });
        evt.fire();
    },
    extendSidebar : function(component, event, helper) {
        var extendside = document.getElementById('mobileSidebar');
        $A.util.toggleClass(extendside, 'extendwidth');
        var closeIconvar = document.getElementById('closeIcon');
        $A.util.toggleClass(closeIconvar, 'visibleTrue');
    }
})