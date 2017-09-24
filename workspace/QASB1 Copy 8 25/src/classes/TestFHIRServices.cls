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
        TestDataFactory.createSourceSystemFHIRObservation();
        Test.startTest();
        StaticResourceCalloutMock mock = new StaticResourceCalloutMock();
        mock.setStaticResource('MockFHIRLabResult');
        mock.setStatusCode(200);
        mock.setHeader('Content-Type', 'application/json');
        // Set the mock callout mode
        Test.setMock(HttpCalloutMock.class, mock);
        //Call the method which performs call out
        FHIRQuery.getResourcesByPatient('Observation',apiResData.EMPI__c,'01-01-2016','01-01-2017');
        //Recall the same method for bypassing call out and fetch cached record from salesforce
        FHIRQuery.getResourcesByPatient('Observation',apiResData.EMPI__c,'01-01-2016','01-01-2017');
        ApiDynListController.getFHIRQueryResult('Observation',apiResData.EMPI__c,'buttonClick');
        Test.stopTest();
        
    }
     //Test method for force api callout and bypass check for existing entries in the FHIRQuery table
    @isTest static void testFHIRObservationMethod2(){
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
        ApiDynListController.getFHIRQueryResult('Observation',apiResData.EMPI__c,'refresh');
        Test.stopTest();
            
    }
    
    //Test method for call out failures
    @isTest static void testFHIRObservationMethod3(){
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
        TestDataFactory.createSourceSystemFHIRObservation();
        StaticResourceCalloutMock mock = new StaticResourceCalloutMock();
        mock.setStaticResource('MockFHIRLabResult');
        mock.setStatusCode(504);
        mock.setHeader('Content-Type', 'application/json');
        // Set the mock callout mode
        Test.setMock(HttpCalloutMock.class, mock);
        //Call the method which performs call out
        //FHIRQuery.getResourcesByPatient('Observation', lstAccounts[0].id, '01-01-2016','01-01-2017');
       ApiDynListController.getFHIRQueryResult('Observation',apiResData.EMPI__c,'buttonClick');
            
    }

}