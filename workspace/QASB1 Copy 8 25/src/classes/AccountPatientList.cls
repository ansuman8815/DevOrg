global class AccountPatientList implements Database.Batchable<sObject> {

    global Database.QueryLocator start (Database.BatchableContext BC) {
        String query = 'SELECT Id, EMPI__c FROM Account';
        return Database.getQueryLocator(query);
    }
    
    global void execute(Database.BatchableContext BC, List<Account> patients) {
        
        List<AcctExplosion__c> affectedAccts = new List<AcctExplosion__c>();
        
        for (Account acct : patients) {
        	List<HealthCloudGA__EhrPatient__c> demographics = [SELECT Id FROM HealthCloudGA__EhrPatient__c WHERE HealthCloudGA__Account__c = :acct.Id];
			if (demographics.size() > 1) {
                // if we got here, there are multiple EhrPatient records for this patient.  Therefore,
                // we need to create multiple accounts.
                AcctExplosion__c affectedAcct = new AcctExplosion__c();
                affectedAcct.Account__c = acct.Id;
                affectedAcct.EMPI__c = acct.EMPI__c;
                
                affectedAccts.add(affectedAcct);
            }
        }
        insert affectedAccts;
        
    }
    
    global void finish(Database.BatchableContext BC) {
        
    }
    
}