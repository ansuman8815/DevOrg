/*
Description: 1. to test method fetching field name and their data type to show in list  
Created By : Cognizant Technology Solutions
Create Date: 02/02/2017
*/

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
        String recordLimit = objcsc.rLimit;
        String[] lstFielddatatype =   new List<String>();
        lstFielddatatype.add('String');
        lstFielddatatype.add('String');
        lstFielddatatype.add('String');
        lstFielddatatype.add('String');
        lstFielddatatype.add('String');
       
        clinicalSummaryController.sObjectWrapper objsow;
        objsow = clinicalSummaryController.dynfetchRecords(strQuery, whereQuery,lstFielddatatype, patientId, recordLimit); 
      
        System.assertEquals('HealthCloudGA__Reaction255__c##String', objsow.lstFieldApi[0]);
        System.assertEquals('HealthCloudGA__StatusLabel__c##String', objsow.lstFieldApi[1]);
        System.assertEquals('HealthCloudGA__CriticalityLabel__c##String', objsow.lstFieldApi[2]);
        System.assertEquals('HealthCloudGA__SourceSystem__c##String', objsow.lstFieldApi[3]);
        System.assertEquals('Source_System_MRN__c##String', objsow.lstFieldApi[4]);
     
        clinicalSummaryController.sObjectWrapper objsow1;
        objsow1 = clinicalSummaryController.dynfetchRecords(strQuery, whereQuery,lstFielddatatype, patientId, '0'); 
       
        System.assertEquals('HealthCloudGA__Reaction255__c##String', objsow1.lstFieldApi[0]);
        System.assertEquals('HealthCloudGA__StatusLabel__c##String', objsow1.lstFieldApi[1]);
        System.assertEquals('HealthCloudGA__CriticalityLabel__c##String', objsow1.lstFieldApi[2]);
        System.assertEquals('HealthCloudGA__SourceSystem__c##String', objsow1.lstFieldApi[3]);
        System.assertEquals('Source_System_MRN__c##String', objsow1.lstFieldApi[4]);
                
    }
    
}