({
    demographicsHelperMethod : function(component,event,helper) {
        
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
        var cmpClinicalSummary = component.find('ClinicalSummary');
        var cmpDemographics = component.find('Demographics');
        var cmpSocialSummary = component.find('SocialSummary');
        var patientid = component.get("v.patientid");
        var cmpEncounterSummary = component.find('EncounterSummary');
        var cmpClinicalNotes = component.find('ClinicalNotes');
        var cmpPopulations = component.find('Populations');
        var cmpLaboratoryResults = component.find('LaboratoryResults');
        var cmpDiagnosticReports = component.find('DiagnosticReports');
		
        $('.search-input-wrapper #searchText').val('');
        $A.util.removeClass(cmpClinicalSummary, 'active');
        $A.util.addClass(cmpDemographics, 'active');
        $A.util.removeClass(cmpSocialSummary, 'active');
        $A.util.removeClass(cmpEncounterSummary, 'active');
        $A.util.removeClass(cmpClinicalNotes, 'active');
        $A.util.removeClass(cmpPopulations, 'active');
        $A.util.removeClass(cmpLaboratoryResults, 'active');
        $A.util.removeClass(cmpDiagnosticReports, 'active');
        var evt = $A.get("e.c:DemographicEvent");
        evt.setParams({"patientid" : patientid });
        evt.setParams({"viewDemographics":true });
        evt.fire();
    },
    clinicalHelperMethod : function(component , event, helper) {
        
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

        $A.util.addClass(cmpClinicalSummary, 'active');
        $A.util.removeClass(cmpDemographics, 'active');
        $A.util.removeClass(cmpSocialSummary, 'active');
        $A.util.removeClass(cmpEncounterSummary, 'active');
        $A.util.removeClass(cmpClinicalNotes, 'active');
        $A.util.removeClass(cmpPopulations, 'active');
        $A.util.removeClass(cmpLaboratoryResults, 'active');
         $A.util.removeClass(cmpDiagnosticReports, 'active');
        var evt = $A.get("e.c:DynamicPalletEvent");
        evt.setParams({ "viewMore": false});
        evt.fire();
    }
})