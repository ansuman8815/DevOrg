({
	doInit : function(component, event, helper) {      
        helper.getPatientBannerData(component);
    },
    ViewMore : function(component, event, helper) {
        var patientid = component.get("v.patientid");
        var DynamicPalletEvent = $A.get("e.c:DemographicEvent");
        DynamicPalletEvent.setParams({ "patientid" : patientid });
        DynamicPalletEvent.setParams({ "viewDemographics" : true });
        DynamicPalletEvent.setParams({ "viewSocialsummary" : false });
        DynamicPalletEvent.setParams({ "viewEncountersummary" : false });
        DynamicPalletEvent.fire();
	},
    clinkOnClose : function(component, event, helper) {
        helper.helperMethodFooter(component);
        document.getElementById("closeButton").style.display = "none";
        document.getElementById("fourthcol").style.display = "block";
        $("#column2Div").css("margin-top","0px");
        var cmpDiv1 = document.getElementById("column1Div");
        var cmpDiv2 = document.getElementById("column2Div");
        var cmpDiv4 = document.getElementById("column4Div");
        var cmpDiv3 = document.getElementById("column3Div");    
        $A.util.removeClass(cmpDiv1, 'slds-backdrop slds-backdrop--open');
        $A.util.removeClass(cmpDiv2, 'slds-backdrop slds-backdrop--open');
        $A.util.removeClass(cmpDiv4, 'slds-backdrop slds-backdrop--open');
        $A.util.removeClass(cmpDiv3, 'slds-modal slds-modal--large slds-fade-in-open expandModal');
        var patSummaryDiv = document.getElementById("patientSummaryDiv");
        $A.util.removeClass(patSummaryDiv, 'expandPatientSummary');
        document.getElementById("patientSummaryDiv").className +=" patientSummary";
        document.getElementById("column3Div").className +=" right rightContent";
        document.getElementById("iconDivId").style.display = "block";
        document.getElementById("column3Content").style.marginLeft = "0px";
        document.getElementById("otherDetailExpand").style.display = "none";
        document.getElementById("otherDetails").style.display = "block";
        document.getElementById("metricsTable").style.display = "block";
        document.getElementById("registryTable").style.display = "block";
        var isSidebarEvent = component.get("v.isSidebarEvent");
        if(isSidebarEvent == true){
            var encSummaryDiv = document.getElementById("encounterSumHead");
            $A.util.removeClass(encSummaryDiv, 'expandEncSum');
            document.getElementById("encounterSumHead").className +=" encSumHead";
        }
        
        else{
            var drpDown = document.getElementById("dropdownDiv");
            $A.util.removeClass(drpDown, 'expandDropdown');
            document.getElementById("dropdownDiv").className +=" dropDown";
        }
      
    }
})