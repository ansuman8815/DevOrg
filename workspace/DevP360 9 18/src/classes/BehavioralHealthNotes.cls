global class BehavioralHealthNotes implements Database.Batchable<sObject>{

    global final String query = 'SELECT Ehr_Clinical_Note__c, Source_System_ID__c FROM Behavioral_Health_Note__c WHERE Ehr_Clinical_Note__c = null';
    
    global Database.QueryLocator start(Database.BatchableContext BC) {
        return Database.getQueryLocator(query);
    }
    
    global void execute(Database.BatchableContext BC, List<Behavioral_Health_Note__c> bhNotes) {
        for(Behavioral_Health_Note__c s : bhNotes) {
            List<Ehr_Clinical_Note__c> theNote = [SELECT Id FROM Ehr_Clinical_Note__c WHERE Source_System_ID__c = :s.Source_System_ID__c];
            Id theNoteID = theNote[0].Id;
            s.Ehr_Clinical_Note__c = theNoteId;
        }
        update bhNotes;
    } 
    
    global void finish(Database.BatchableContext BC) {
        
    }

}