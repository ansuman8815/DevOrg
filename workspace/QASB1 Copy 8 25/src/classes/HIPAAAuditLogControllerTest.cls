@isTest
public class HIPAAAuditLogControllerTest {

    @isTest
    public static void testHIPAAAudit() {
        
        String empi = 'HIPAA_Test_EMPI';
        
        // Create 3 test accts with the same EMPI:
        
        List<Account> accts = new List<Account>();
        accts.add(new Account(Name='HIPAA_Test_1', EMPI__c = empi));
        accts.add(new Account(Name='HIPAA_Test_2', EMPI__c = empi));
        accts.add(new Account(Name='HIPAA_Test_3', EMPI__c = empi));
        insert accts;
        
        // Execute the code we're testing:
        HIPAAAuditLogController.logAccess(empi, 'Lab Results');
        
        // Test for the results:
        System.AssertEquals(3, [SELECT COUNT() FROM HIPAA_Audit_Log__c WHERE Account__c IN (SELECT Id FROM Account WHERE EMPI__c = :empi)]);
        
    }
    
}