@isTest
private class patientProfilePageControllerTest {

	private static testMethod void redirecttest() {
        String strRecordTypeId = [Select Id From RecordType Where SobjectType = 'Account' and Name = 'Individual'].Id;

        Account ac = new Account(RecordTypeId = strRecordTypeId, Name='James', First_Name__c='James', Last_Name__c = 'Franklin', GenderLabel__c = 'M', Date_of_Birth__c = Date.newInstance(1975,12,10), Medicaid_CIN__c = '468927');
        insert ac;
        
	    test.startTest();
        PageReference pageRef = Page.PatientDetail_page;
        Test.setCurrentPage(pageRef);
        pageRef.getParameters().put('id',ac.id);
        patientProfilePageController  controller = new patientProfilePageController();
        controller.redirect();
        test.stopTest();
	}

}