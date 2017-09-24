@isTest
private class UpdateMRNTest {
    
    @TestSetup
    static void setup() {
        
        // create list of missing identifiers:
        MissingAcct__c missingAcct = new MissingAcct__c(PatientKey__c = '5678~SomeEmr');
        insert missingAcct;
        
        // create an account:
        Account acct = new Account(name='MissingAcctTest1', HealthCloudGA__SourceSystemId__c = '1234~MissingAcct1');
        insert acct;
        Id acctId = acct.Id;
        
        // create an EhrPatient:
        HealthCloudGA__EhrPatient__c patient = new HealthCloudGA__EhrPatient__c(HealthCloudGA__Account__c = acctId, HealthCloudGA__SourceSystemId__c = '5678~SomeEmr');
        insert patient;
        
    }
    
    static testmethod void test() {
        Test.startTest();
        Id batchId = Database.executeBatch(new MissingAccounts());
        Test.stopTest();
        
        System.assertEquals(1, [SELECT COUNT() FROM Account WHERE HealthCloudGA__SourceSystemId__c = '5678~SomeEmr']);
    }

}