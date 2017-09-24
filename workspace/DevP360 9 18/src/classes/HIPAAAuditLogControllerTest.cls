/**
 	@Author      : 	Cognizant Technology Solutions
	@name		 :	HIPAAAuditLogControllerTest			
    @Description :  Test Class to validate HIPAAAuditLogController.
	@Create Date : 	4/26/2017
	@Version     :  1.0
*/
@isTest(SeeAllData=false)
public class HIPAAAuditLogControllerTest {
    @isTest
    public static void testHIPAAAudit() {
        String empi = 'HIPAA_Test_EMPI';
        List<Account> accts = new List<Account>();
        accts.add(new Account(Name='HIPAA_Test_1', EMPI__c = empi));
        accts.add(new Account(Name='HIPAA_Test_2', EMPI__c = empi));
        accts.add(new Account(Name='HIPAA_Test_3', EMPI__c = empi));
        insert accts;
        
        HIPAAAuditLogController.logAccess(empi, 'Lab Results');
        System.AssertEquals(3, [SELECT COUNT() FROM HIPAA_Audit_Log__c WHERE Account__c IN (SELECT Id 
                                                                                            FROM Account WHERE EMPI__c = :empi)]);
    }
}