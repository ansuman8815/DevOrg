/**
    @Author      :  Cognizant Technology Solutions
    @name        :  TestFHIRServices            
    @Description :  Test Class to validate FHIRQuery.
    @Create Date :  7/27/2017
    @Version     :  1.0
*/
@isTest
private class TestFHIRServices {
    //Test method for calling out Mulesoft api for Lab Result for one patient and calling more than once for the same patient on the same day
    @isTest static void testFHIRObservationMethod1(){
        String strRecordTypeId = [Select Id From RecordType Where SobjectType = 'Account' and Name = 'Individual'].Id;          
        Account ac;
        ac = new Account(RecordTypeId = strRecordTypeId, Name='James',
                         HealthCloudGA__SourceSystem__c='Health1-00D630000009MZ7', 
                         first_name__c='James', Last_Name__c = 'Franklin', GenderLabel__c = 'M',
                         Date_of_Birth__c = Date.newInstance(1975,12,10), Medicaid_CIN__c = '468927',
                         PCP__c = 'xxxx yyyy', Phone='123883483',EMPI__c='121314');
        insert ac;
        APIResourceData__c apiResData = new APIResourceData__c(EMPI__c=ac.EMPI__c,FromDate__c=Date.newInstance(2014,12,12),Resource__c='Observation',ToDate__c=Date.newInstance(2015,12,10));
        insert apiResData;
        HealthCloudGA__EhrEncounter__c ehr =new HealthCloudGA__EhrEncounter__c(HealthCloudGA__Account__c =ac.Id);
        insert ehr;
        TestDataFactory.createSourceSystemFHIRObservation();
        Test.startTest();
        StaticResourceCalloutMock mock = new StaticResourceCalloutMock();
        mock.setStaticResource('MockFHIRLabResult');
        mock.setStatusCode(200);
        mock.setHeader('Content-Type', 'application/json');
        // Set the mock callout mode
        Test.setMock(HttpCalloutMock.class, mock);
        //Call the method which performs call out
        //FHIRQuery.getResourcesByPatient('Observation',apiResData.EMPI__c,'',apiResData.FromDate__c,apiResData.ToDate__c);
        //Recall the same method for bypassing call out and fetch cached record from salesforce
       	 FHIRQuery.getResourcesByPatient('Observation',apiResData.EMPI__c,'','01-01-2016','01-01-2017');
     	 FHIRQuery.forceGetResourcesByPatient('Observation',apiResData.EMPI__c,'','01-01-2016','01-01-2017');
         Test.stopTest();
    }
     //Test method for force api callout and bypass check for existing entries in the FHIRQuery table
    /*@isTest static void testFHIRObservationMethod2(){
         String strRecordTypeId = [Select Id From RecordType Where SobjectType = 'Account' and Name = 'Individual'].Id;          
        Account ac;
        ac = new Account(RecordTypeId = strRecordTypeId, Name='James',
                         HealthCloudGA__SourceSystem__c='Health1-00D630000009MZ7', 
                         first_name__c='James', Last_Name__c = 'Franklin', GenderLabel__c = 'M',
                         Date_of_Birth__c = Date.newInstance(1975,12,10), Medicaid_CIN__c = '468927',
                         PCP__c = 'xxxx yyyy', Phone='123883483',EMPI__c='121314');
        insert ac;
        APIResourceData__c apiResData = new APIResourceData__c(EMPI__c=ac.EMPI__c,FromDate__c=Date.newInstance(2014,12,12),Resource__c='Observation',ToDate__c=Date.newInstance(2015,12,10));
        insert apiResData;
        HealthCloudGA__EhrEncounter__c ehr =new HealthCloudGA__EhrEncounter__c(HealthCloudGA__Account__c =ac.Id);
        insert ehr;
        TestDataFactory.createSourceSystemFHIRObservation();
        Test.startTest();
        StaticResourceCalloutMock mock = new StaticResourceCalloutMock();
        mock.setStaticResource('MockFHIRLabResult');
        mock.setStatusCode(200);
        mock.setHeader('Content-Type', 'application/json');
        // Set the mock callout mode
        Test.setMock(HttpCalloutMock.class, mock);
        //Call the method which performs call out
       // FHIRQuery.forceGetResourcesByPatient('Observation', lstAccounts[0].id, '01-01-2016','01-01-2017');
        // ApiDynListController.getFHIRQueryResult('Observation',apiResData.EMPI__c,'','refresh');
       ApiDynListController.getFHIRQueryResult('Medical History',apiResData.EMPI__c,'','refresh');
      // ApiDynListController.getFHIRQueryResult('Encounter Diagnosis',apiResData.EMPI__c,ehr.Id,'refresh');
      // ApiDynListController.getFHIRQueryResult('Patient Problem',apiResData.EMPI__c,'','refresh');
        Test.stopTest();
            
    }*/
    
    //Test method for call out failures
    /*@isTest static void testFHIRObservationMethod3(){
        //List<Account> lstAccounts = TestDataFactory.createAccount(1);
        String strRecordTypeId = [Select Id From RecordType Where SobjectType = 'Account' and Name = 'Individual'].Id;          
        Account ac;
        ac = new Account(RecordTypeId = strRecordTypeId, Name='James',
                         HealthCloudGA__SourceSystem__c='Health1-00D630000009MZ7', 
                         first_name__c='James', Last_Name__c = 'Franklin', GenderLabel__c = 'M',
                         Date_of_Birth__c = Date.newInstance(1975,12,10), Medicaid_CIN__c = '468927',
                         PCP__c = 'xxxx yyyy', Phone='123883483',EMPI__c='121314');
        insert ac;
        APIResourceData__c apiResData = new APIResourceData__c(EMPI__c=ac.EMPI__c,FromDate__c=Date.newInstance(2014,12,12),Resource__c='Observation',ToDate__c=Date.newInstance(2015,12,10));
        insert apiResData;
        HealthCloudGA__EhrEncounter__c ehr =new HealthCloudGA__EhrEncounter__c(HealthCloudGA__Account__c =ac.Id);
        insert ehr;
        TestDataFactory.createSourceSystemFHIRObservation();
        StaticResourceCalloutMock mock = new StaticResourceCalloutMock();
        mock.setStaticResource('MockFHIRLabResult');
        mock.setStatusCode(504);
        mock.setHeader('Content-Type', 'application/json');
        // Set the mock callout mode
        Test.setMock(HttpCalloutMock.class, mock);
        //Call the method which performs call out
        //FHIRQuery.getResourcesByPatient('Observation', lstAccounts[0].id, '01-01-2016','01-01-2017');
       //ApiDynListController.getFHIRQueryResult('Observation',apiResData.EMPI__c,'','buttonClick');
       //ApiDynListController.getFHIRQueryResult('Medical History',apiResData.EMPI__c,'','buttonClick');
       //ApiDynListController.getFHIRQueryResult('Encounter Diagnosis',apiResData.EMPI__c,ehr.Id,'buttonClick');
       //ApiDynListController.getFHIRQueryResult('Patient Problem',apiResData.EMPI__c,'','buttonClick');
    }*/
    @isTest static void testFHIREncDiagnosis(){
        String strRecordTypeId = [Select Id From RecordType Where SobjectType = 'Account' and Name = 'Individual'].Id;          
        Account ac;
        ac = new Account(RecordTypeId = strRecordTypeId, Name='James',
                         HealthCloudGA__SourceSystem__c='Health1-00D630000009MZ7', 
                         first_name__c='James', Last_Name__c = 'Franklin', GenderLabel__c = 'M',
                         Date_of_Birth__c = Date.newInstance(1975,12,10), Medicaid_CIN__c = '468927',
                         PCP__c = 'xxxx yyyy', Phone='123883483',EMPI__c='121314');
        insert ac;
        APIResourceData__c apiResData = new APIResourceData__c(EMPI__c=ac.EMPI__c,FromDate__c=Date.newInstance(2014,12,12),Resource__c='Encounter Diagnoses',ToDate__c=Date.newInstance(2015,12,10));
        insert apiResData;
        HealthCloudGA__EhrEncounter__c ehr =new HealthCloudGA__EhrEncounter__c(HealthCloudGA__Account__c =ac.Id);
        insert ehr;
        TestDataFactory.createSourceSystemFHIREncDiagnosis();
        Test.startTest();
        StaticResourceCalloutMock mock = new StaticResourceCalloutMock();
        mock.setStaticResource('MockFHIREncDiagnosis');
        mock.setStatusCode(200);
        mock.setHeader('Content-Type', 'application/json');
        // Set the mock callout mode
        Test.setMock(HttpCalloutMock.class, mock);
        //Call the method which performs call out
        //FHIRQuery.getResourcesByPatient('Observation',apiResData.EMPI__c,'',apiResData.FromDate__c,apiResData.ToDate__c);
        //Recall the same method for bypassing call out and fetch cached record from salesforce
       	 FHIRQuery.getResourcesByPatient('Encounter Diagnoses',apiResData.EMPI__c,ehr.Id,'','');
     	 //FHIRQuery.forceGetResourcesByPatient('Observation',apiResData.EMPI__c,'','01-01-2016','01-01-2017');
         Test.stopTest();
    }  
    
    
     @isTest static void testMuleMedicalHistoryParser(){
        String strRecordTypeId = [Select Id From RecordType Where SobjectType = 'Account' and Name = 'Individual'].Id;          
        Account ac;
        ac = new Account(RecordTypeId = strRecordTypeId, Name='James',
                         HealthCloudGA__SourceSystem__c='Health1-00D630000009MZ7', 
                         first_name__c='James', Last_Name__c = 'Franklin', GenderLabel__c = 'M',
                         Date_of_Birth__c = Date.newInstance(1975,12,10), Medicaid_CIN__c = '468927',
                         PCP__c = 'xxxx yyyy', Phone='123883483',EMPI__c='121314');
        insert ac;
        APIResourceData__c apiResData = new APIResourceData__c(EMPI__c=ac.EMPI__c,FromDate__c=Date.newInstance(2014,12,12),Resource__c='Medical History',ToDate__c=Date.newInstance(2015,12,10));
        insert apiResData;
       
        TestDataFactory.createSourceSystemMedicalHistory();
        Test.startTest();
        StaticResourceCalloutMock mock = new StaticResourceCalloutMock();
        mock.setStaticResource('MockFHIRMedicalHistory');
        mock.setStatusCode(200);
        mock.setHeader('Content-Type', 'application/json');
        // Set the mock callout mode
        Test.setMock(HttpCalloutMock.class, mock);
        //Call the method which performs call out
        //FHIRQuery.getResourcesByPatient('Observation',apiResData.EMPI__c,'',apiResData.FromDate__c,apiResData.ToDate__c);
        //Recall the same method for bypassing call out and fetch cached record from salesforce
       	 FHIRQuery.getResourcesByPatient('Medical History',apiResData.EMPI__c,'','','');
     	 //FHIRQuery.forceGetResourcesByPatient('Observation',apiResData.EMPI__c,'','01-01-2016','01-01-2017');
         Test.stopTest();
    }  
    
     @isTest static void testMuleProblemListParser(){
        String strRecordTypeId = [Select Id From RecordType Where SobjectType = 'Account' and Name = 'Individual'].Id;          
        Account ac;
        ac = new Account(RecordTypeId = strRecordTypeId, Name='James',
                         HealthCloudGA__SourceSystem__c='Health1-00D630000009MZ7', 
                         first_name__c='James', Last_Name__c = 'Franklin', GenderLabel__c = 'M',
                         Date_of_Birth__c = Date.newInstance(1975,12,10), Medicaid_CIN__c = '468927',
                         PCP__c = 'xxxx yyyy', Phone='123883483',EMPI__c='121314');
        insert ac;
        APIResourceData__c apiResData = new APIResourceData__c(EMPI__c=ac.EMPI__c,FromDate__c=Date.newInstance(2014,12,12),Resource__c='Problem List',ToDate__c=Date.newInstance(2015,12,10));
        insert apiResData;
        
        TestDataFactory.createSourceSystemProblemList();
        Test.startTest();
        StaticResourceCalloutMock mock = new StaticResourceCalloutMock();
        mock.setStaticResource('MockFHIRProblemList');
        mock.setStatusCode(200);
        mock.setHeader('Content-Type', 'application/json');
        // Set the mock callout mode
        Test.setMock(HttpCalloutMock.class, mock);
        //Call the method which performs call out
        //FHIRQuery.getResourcesByPatient('Observation',apiResData.EMPI__c,'',apiResData.FromDate__c,apiResData.ToDate__c);
        //Recall the same method for bypassing call out and fetch cached record from salesforce
       	 FHIRQuery.getResourcesByPatient('Problem List',apiResData.EMPI__c,'','','');
     	 //FHIRQuery.forceGetResourcesByPatient('Observation',apiResData.EMPI__c,'','01-01-2016','01-01-2017');
         Test.stopTest();
    }  
}