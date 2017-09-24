({
    doInit: function(component, event, helper) {
        helper.fetchApiData(component);
        //helper.helperMethodFooter(component); 
    },
    
    ViewMore: function(component, event, helper) {
       // console.log('Hiii View more for Medical History');
        helper.helperMethodFooter(component);
       // console.log('After the call of helper');
        var action = component.get("c.getDataForComponent");
        var patientid = component.get("v.patientid");
        var listName = component.get("v.listName");
        var whereclause = component.get("v.whereclause");
        var tableName = component.get("v.tableName");
        var pageName = component.get("v.pageName");
        if (listName == 'Encounter') {
              // console.log('inside the list of encounter');
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
           // console.log('inside the view More of Medical Pallet');
            var DynamicPalletEvent = $A.get("e.c:DynamicPalletEvent");
            DynamicPalletEvent.setParams({
                "patientid"		: patientid,
                "whereclause"	: whereclause,
                "listName"		: listName,
                "tableName"		: tableName,
                "pageName"		: pageName,
                "viewMore"		: true
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