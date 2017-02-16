@isTest
private class clinicalSummaryControllerTest {
	
   private static testMethod void fetchDynamicRecordTest() {
       
        clinicalSummaryController objcsc = new clinicalSummaryController();
        
        String strRecordTypeId = [Select Id From RecordType Where SobjectType = 'Account' and Name = 'Individual'].Id;

        Account ac = new Account(RecordTypeId = strRecordTypeId, Name='James33', First_Name__c='James33', Last_Name__c = 'Franklin33', GenderLabel__c = 'M', Date_of_Birth__c = Date.newInstance(1975,12,10), Medicaid_CIN__c = '468927');
        insert ac;
       
        String strQuery  =  'SELECT HealthCloudGA__Reaction255__c ,HealthCloudGA__StatusLabel__c,HealthCloudGA__CriticalityLabel__c, HealthCloudGA__SourceSystem__c, Source_System_MRN__c FROM HealthCloudGA__EhrAllergyIntolerance__c ';
        String whereQuery =  ' WHERE HealthCloudGA__Account__c = :patientId ';
        String patientId =  ac.id;
        String recordLimit = '3';
               

        clinicalSummaryController.sObjectWrapper objsow = clinicalSummaryController.dynfetchRecords(strQuery, whereQuery, patientId, recordLimit);  
        system.debug(objsow);
        
                
	}
    
}