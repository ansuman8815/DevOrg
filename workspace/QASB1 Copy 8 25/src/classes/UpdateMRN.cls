global class UpdateMRN implements Database.Batchable<sObject> {

    global Database.QueryLocator start (Database.BatchableContext BC) {
        //String query = 'SELECT PatientKey__c, Processed__c, NoEhrPatient__c, ExistingAcct__c FROM MissingAcct__c';
        String query = 'SELECT Id, HealthCloudGA__SourceSystemId__c, HealthCloudGA__MedicalRecordNumber__c FROM Account where CreatedById=\'00541000001G5mD\' and CreatedDate=YESTERDAY';
        return Database.getQueryLocator(query);
    }
    
    global void execute(Database.BatchableContext BC, List<Account> updateTheseAccts) {
        
        for (Integer i = 0; i<updateTheseAccts.size(); i++) {
            
            String patkey = updateTheseAccts[i].HealthCloudGA__SourceSystemId__c;
			Integer t_index = patkey.indexOf('~');
			updateTheseAccts[i].HealthCloudGA__MedicalRecordNumber__c = patkey.substring(0, t_index);
           
        }
        
        // Insert the new accounts:
        update updateTheseAccts;
        
    }
    
    global void finish(Database.BatchableContext BC) { 
    }
    
}