global class AccountExploderGaps implements Database.Batchable<sObject> {

    global Database.QueryLocator start (Database.BatchableContext BC) {
        String query = 'SELECT Account__c, EMPI__c FROM AcctExplosion__c';
        return Database.getQueryLocator(query);
    }
    
    global void execute(Database.BatchableContext BC, List<AcctExplosion__c> patients) {
        
        List<UnexplodedAcct__c> accts = new List<UnexplodedAcct__c>();
        Integer counter = 0;
        
        for (AcctExplosion__c acct : patients) {
            
            String empi = acct.EMPI__c;
        	counter = database.countQuery('SELECT COUNT() FROM Account WHERE EMPI__c = :empi');
            if (counter < 2) {
                // Here's an account that failed.
                accts.add(new UnexplodedAcct__c(Account__c = acct.Account__c, EMPI__c = empi));
            }
        }
        insert accts;
    }
    
    global void finish(Database.BatchableContext BC) {
        
    }
    
}