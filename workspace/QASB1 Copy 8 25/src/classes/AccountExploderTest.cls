@isTest
private class AccountExploderTest {
    
    @TestSetup
    static void setup() {
        List<Account> accounts = new List<Account>();
        List<HealthCloudGA__EhrPatient__c> patients = new List<HealthCloudGA__EhrPatient__c>();
        List<AcctExplosion__c> acctExp = new List<AcctExplosion__c>();
        // insert 2 accounts with 4 EhrPatient records
        accounts.add(new Account(name='AcctExploderTest1', Empi__c = 'AcctExploderTestEMPI1', HealthCloudGA__SourceSystemId__c = '1234~AcctExploder1'));
        accounts.add(new Account(name='AcctExploderTest2', Empi__c = 'AcctExploderTestEMPI2', HealthCloudGA__SourceSystemId__c = '1234~AcctExploder2'));
        insert accounts;
        
        for (Account acct : [SELECT Id, Empi__c FROM Account WHERE EMPI__c = 'AcctExploderTestEMPI1']) {
        	// Add to AcctExplosion__c:
        	acctExp.add(new AcctExplosion__c(Account__c = acct.Id, EMPI__c = acct.Empi__c));
            patients.add(new HealthCloudGA__EhrPatient__c(HealthCloudGA__Account__c = acct.Id, HealthCloudGA__SourceSystemId__c = '1234~AcctExploder1'));
            patients.add(new HealthCloudGA__EhrPatient__c(HealthCloudGA__Account__c = acct.Id, HealthCloudGA__SourceSystemId__c = '5678~AcctExploder1'));
        }
        for (Account acct : [SELECT Id, Empi__c FROM Account WHERE EMPI__c = 'AcctExploderTestEMPI2']) {
        	// Add to AcctExplosion__c:
        	acctExp.add(new AcctExplosion__c(Account__c = acct.Id, EMPI__c = acct.Empi__c));
            patients.add(new HealthCloudGA__EhrPatient__c(HealthCloudGA__Account__c = acct.Id, HealthCloudGA__SourceSystemId__c = '1234~AcctExploder2'));
            patients.add(new HealthCloudGA__EhrPatient__c(HealthCloudGA__Account__c = acct.Id, HealthCloudGA__SourceSystemId__c = '5678~AcctExploder2'));
        }
        insert acctExp;
        insert patients;
        
    }
    
    static testmethod void test() {
        Test.startTest();
        Id batchId = Database.executeBatch(new AccountExploder());
        Test.stopTest();
        
        System.assertEquals(4, [SELECT COUNT() FROM Account WHERE EMPI__c LIKE 'AcctExploderTestEMPI%']);
    }

}