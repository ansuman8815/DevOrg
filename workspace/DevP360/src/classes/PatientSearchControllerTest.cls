@isTest 
private class PatientSearchControllerTest {
    
    
    static testMethod void validategetSearchAccountData() {
        
        String strRecordTypeId = [Select Id From RecordType Where SobjectType = 'Account' and Name = 'Individual'].Id;             
        system.debug(strRecordTypeId);
        
        List<Account> lstaccs = new List<Account>();
        Account ac ;
        ac = new Account(RecordTypeId = strRecordTypeId, Name='James', First_Name__c='James', Last_Name__c = 'Franklin', GenderLabel__c = 'M', Date_of_Birth__c = Date.newInstance(1975,12,10), Medicaid_CIN__c = '468927');
        lstaccs.add(ac);
        ac = new Account(RecordTypeId = strRecordTypeId , Name='Sachin', First_Name__c='Sachin',  Last_Name__c = 'Singhal', GenderLabel__c = 'M', Date_of_Birth__c = Date.newInstance(1980,08,15), Medicaid_CIN__c = '223344');
        lstaccs.add(ac);
        ac = new Account(RecordTypeId = strRecordTypeId, Name='Payal', First_Name__c='Payal', Last_Name__c = 'Mittal', GenderLabel__c = 'F', Date_of_Birth__c = Date.newInstance(1985,06,10), Medicaid_CIN__c = '147852');
        lstaccs.add(ac);
        
        insert lstaccs;
        system.debug(lstaccs);

        
        List<Account> accts =  PatientSearchController.getSearchAccountData('Sachin','' ,'' , '', '');
        //System.assertEquals(1, accts.size());
        
        List<Account> accts1 =  PatientSearchController.getSearchAccountData('Sachin', '' , '', '', String.valueOf(Date.newInstance(1980,08,15)) );
        //System.assertEquals(1, accts1.size());
        
        List<Account> accts2 =  PatientSearchController.getSearchAccountData('Sachin','Singhal', '', '', String.valueOf(Date.newInstance(1980,08,15)) );
        //System.assertEquals(1, accts2.size());
        
        List<Account> accts3 =  PatientSearchController.getSearchAccountData('Sachin', 'Singhal' ,'M', '', String.valueOf(Date.newInstance(1980,08,15)) );
        //System.assertEquals(1, accts3.size());
        
        List<Account> accts4 =  PatientSearchController.getSearchAccountData('Sachin', 'Singhal' ,'M',  '223344', String.valueOf(Date.newInstance(1980,08,15)) );
        //System.assertEquals(1, accts4.size());
        
        
        //system.debug('Patient Search Data ' + accts);
             
            
    }
}