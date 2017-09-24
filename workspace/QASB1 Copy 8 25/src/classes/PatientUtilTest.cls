@isTest
public class PatientUtilTest {
    
    @isTest
    public static void testByEMPI() {
        
        String empi = 'HIPAA_Test_EMPI';
		// Create 3 test accts with the same EMPI:
        List<Account> accts = new List<Account>();
        accts.add(new Account(Name='HIPAA_Test_1', EMPI__c = empi));
        accts.add(new Account(Name='HIPAA_Test_2', EMPI__c = empi));
        accts.add(new Account(Name='HIPAA_Test_3', EMPI__c = empi));
        insert accts;
        
        System.AssertEquals(3, PatientUtil.getRelatedAccountsByEMPI(empi).size());
    }
    
    @isTest
    public static void testByAcctId() {
        
        String empi = 'HIPAA_Test_EMPI';
		// Create 3 test accts with the same EMPI:
        List<Account> accts = new List<Account>();
        accts.add(new Account(Name='HIPAA_Test_1', EMPI__c = empi));
        accts.add(new Account(Name='HIPAA_Test_2', EMPI__c = empi));
        accts.add(new Account(Name='HIPAA_Test_3', EMPI__c = empi));
        insert accts;
        
        Id acctId = accts[0].Id;
        
        System.AssertEquals(3, PatientUtil.getRelatedAccounts(acctId).size());
        
    }
    
    @isTest
    public static void testNullAcctId() {
        Id acctId = null;
        System.AssertEquals(null, PatientUtil.getRelatedAccounts(acctId));
    }

}