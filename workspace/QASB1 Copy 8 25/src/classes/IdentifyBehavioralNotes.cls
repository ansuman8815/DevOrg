global class IdentifyBehavioralNotes implements Database.Batchable<sObject> {

    global final String query = 'SELECT Code__c FROM Dx_Master__c';
    global final String progRun;
    
    global IdentifyBehavioralNotes(String programRun) {
        progRun = programRun;
    }
    
    global Database.QueryLocator start(Database.BatchableContext BC) {
        return Database.getQueryLocator(query);
    }
    
    global void execute(Database.BatchableContext BC, List<Dx_Master__c> diags) {
        
        // Need to populate Behavioral_Health_Note__c with Salesforce record ID from Ehr_Clinical_Note__c,
        //  the Source_System_ID__c value from Ehr_Clinical_Note__c, and a unique version(run) number.
        
        List<Behavioral_Health_Note__c> bhNoteList = new List<Behavioral_Health_Note__c>();
        
        for(Dx_Master__c dx : diags) {
            List<Ehr_Clinical_Note__c> dxNoteList = [select Id, Source_System_ID__c from Ehr_Clinical_Note__c WHERE Encounter_ID__c IN (SELECT HealthCloudGA__Encounter__c FROM HealthCloudGA__EhrCondition__c WHERE HealthCloudGA__Code__c = :dx.Code__c and Hospital_Problem__c = true)];
            for(Ehr_Clinical_Note__c aNote : dxNoteList) {
                Behavioral_Health_Note__c newNote = new Behavioral_Health_Note__c(Ehr_Clinical_Note__c = aNote.Id, Source_System_ID__c = aNote.Source_System_Id__c, Version__c = progRun);
                bhNoteList.add(newNote);
            }
        }
        
        insert bhNoteList;
        
    } 
    
    global void finish(Database.BatchableContext BC) {
        
    }

}