/**
    @Author      :     Cognizant Technology Solutions
    @name        :          ApiDynListControllerTest                                     
    @Description :  Test Class to validate ApiDynListController.
    @Create Date : 7/13/2017
    @Version     :  1.0
*/
@isTest(SeeAllData=false)
public class ApiDynListControllerTest {
    
    static testMethod void validategetDataForComponent() {
        test.startTest();
        String strRecordTypeId = [Select Id From RecordType Where SobjectType = 'Account' and Name = 'Individual'].Id;             
        Account ac;
        ac = new Account(RecordTypeId = strRecordTypeId, Name='James',
                         HealthCloudGA__SourceSystem__c='Health1-00D630000009MZ7', 
                         first_name__c='James', Last_Name__c = 'Franklin', GenderLabel__c = 'M',
                         Date_of_Birth__c = Date.newInstance(1975,12,10), Medicaid_CIN__c = '468927',
                         PCP__c = 'xxxx yyyy', Phone='123883483',EMPI__c='121314');
        insert ac;
        
        string acParam                  =          '\'' + ac.Id + '\'';
        string startdate                =          '#' + 'All';
        string strwhereclause           =          'Account__c ='+acParam + ' HealthCloudGA__ValuePeriodStartDate__c = ' + startdate;
        string acParam1                             =          '\"' + ac.Id + '\"';
        string strwhereclause1          =          'Account__c =  '+acParam1;
        string startdate2                             =          '#' + 'LAST_N_Days:365';
        string strwhereclause2          =          'Account__c ='+acParam + ' HealthCloudGA__ValuePeriodStartDate__c = ' + startdate2;
        string startdate3                             =          '#' + 'LAST_N_Days:730';
        string strwhereclause4          =          'Account__c ='+acParam + ' HealthCloudGA__ValuePeriodStartDate__c = ' + startdate3;
        string isPallet                 =          'isPallet';
        string isPallet1                =          'div';
        System.debug('strwhereclause '+strwhereclause1);
        System.debug('ACParam: '+acParam);
        System.debug('strwhereclause1 '+strwhereclause1);
        
        Dynamic_List__c dynlst;        
        dynlst = new Dynamic_List__c(Name = 'DynamicPopulationMetric', objectAPIName__c = 'Performance_Metric__c', 
                                     WhereClause__c = strwhereclause1, Order_By__c = 'Measure_name__c ASC', Limit__c = '3'); 
        insert dynlst;
        
        Dynamic_List_Field__c  dynlstfld;
        dynlstfld = new Dynamic_List_Field__c(Name = 'Performance Metric', fieldAPIName__c = 'Measure_Name__c', 
                                              ShowInPallet__c = false, isLink__c = true, index__c = 1, 
                                              DynamicList__c = dynlst.id,Link_Reference__c='Account__c',FieldType__c='Date');
        
        insert dynlstfld;
        
        Dynamic_List_Field__c  dynlstfld1;
        dynlstfld1 = new Dynamic_List_Field__c(Name = 'Description', fieldAPIName__c = 'Assignment_Reason__c', 
                                               ShowInPallet__c = false, isLink__c = false, index__c = 2, 
                                               DynamicList__c = dynlst.id);
        insert dynlstfld1;
        
        Performance_Metric__c  pm1    =     new Performance_Metric__c(Account__c = ac.Id, Measure_Name__c = 'Measure Name1', 
                                                               Assignment_Reason__c = 'Description1');
        insert pm1;
        
        Performance_Metric__c  pm2    =     new Performance_Metric__c(Account__c = ac.Id, Measure_Name__c = 'Measure Name2', 
                                                               Assignment_Reason__c = 'Description2');
        insert pm2;
        
        APIResourceData__c apiResData =     new APIResourceData__c(EMPI__c=ac.EMPI__c,FromDate__c=Date.newInstance(2014,12,12),
                                                                   Resource__c='Observation',
                                                                   ToDate__c=Date.newInstance(2015,12,10));
        insert apiResData;
                
        ApiDynListController.DisplayPalletRecords objDyncLstDispRec;
        System.debug('strwhereclause:::'+dynlst.Name);
        objDyncLstDispRec =  ApiDynListController.getDataForComponent(dynlst.Name, strwhereclause,'Problem List',ac.EMPI__c,
                                                                      isPallet);
        
        Dynamic_List__c dynlst1;
        dynlst1 = new Dynamic_List__c(Name = 'DynamicPopulationMetric1', objectAPIName__c = 'Performance_Metric__c',
                                      WhereClause__c = strwhereclause1, Order_By__c = 'Measure_name__c ASC', 
                                      Limit__c = '3',Count_Query__c=''); 
        insert dynlst1;
        
        Dynamic_List_Field__c  dynlstfld2;
        dynlstfld2 = new Dynamic_List_Field__c(Name = 'Performance Metric1', fieldAPIName__c = 'Measure_Name__c', 
                                               ShowInPallet__c = false, isLink__c = false, index__c = 1, 
                                               DynamicList__c = dynlst1.id);
        insert dynlstfld2;
        
        Dynamic_List_Field__c  dynlstfld3;
        dynlstfld3 = new Dynamic_List_Field__c(Name = 'Description1', fieldAPIName__c = 'Assignment_Reason__c', 
                                               ShowInPallet__c = true, isLink__c = false, index__c = 2,
                                               DynamicList__c = dynlst1.id);
        insert dynlstfld3;
        
        Performance_Metric__c  pm3 = new Performance_Metric__c(Account__c = ac.Id, Measure_Name__c = 'Measure Name3', 
                                                               Assignment_Reason__c = 'Description3');
        insert pm3;
        
        Performance_Metric__c  pm4 = new Performance_Metric__c(Account__c = ac.Id, Measure_Name__c = 'Measure Name4', 
                                                               Assignment_Reason__c = 'Description4');
        insert pm4;
        
        ApiDynListController.DisplayPalletRecords objDyncLstDispRec2;
        objDyncLstDispRec2 =  ApiDynListController.getDataForComponent(dynlst1.Name, strwhereclause,'Observation',ac.EMPI__c,
                                                                       isPallet);
        System.debug('objDyncLstDispRec2'+objDyncLstDispRec2);
        Dynamic_List__c dynlst2;
        dynlst2 = new Dynamic_List__c(Name = 'DynamicPopulationMetric2', objectAPIName__c = 'Performance_Metric__c', 
                                      WhereClause__c = strwhereclause1, Order_By__c = 'Measure_name__c ASC', 
                                      Limit__c = '1',Count_Query__c=''); 
        insert dynlst2;
        
        Dynamic_List_Field__c  dynlstfld4;
        dynlstfld4 = new Dynamic_List_Field__c(Name = 'Performance Metric2', fieldAPIName__c = 'Measure_Name__c', 
                                               ShowInPallet__c = true, isLink__c = false, index__c = 1, 
                                               DynamicList__c = dynlst2.id);
        insert dynlstfld4;
        
        Dynamic_List_Field__c  dynlstfld5;
        dynlstfld5 = new Dynamic_List_Field__c(Name = 'Description2', fieldAPIName__c = 'Assignment_Reason__c', 
                                               ShowInPallet__c = true, isLink__c = false, index__c = 2, 
                                               DynamicList__c = dynlst2.id);
        insert dynlstfld5;
        
        Performance_Metric__c  pm5 = new Performance_Metric__c(Account__c = ac.Id, Measure_Name__c = 'Measure Name3',
                                                               Assignment_Reason__c = 'Description3');
        insert pm5;
        
        Performance_Metric__c  pm6 = new Performance_Metric__c(Account__c = ac.Id, Measure_Name__c = 'Measure Name4',
                                                               Assignment_Reason__c = 'Description4');
        insert pm6;
        
        ApiDynListController.DisplayPalletRecords objDyncLstDispRec3,objDynclstDispRec4;
        objDyncLstDispRec3 =  ApiDynListController.getDataForComponent(dynlst2.Name, strwhereclause2,'Observation',
                                                                       ac.EMPI__c,isPallet);
        objDyncLstDispRec3= ApiDynListController.getDataForComponent(dynlst2.Name, strwhereclause4,'Problem List',
                                                                     ac.EMPI__c,isPallet);

        List<Dynamic_List__c> lstDynamicList=[Select Name, objectAPIName__c, WhereClause__c, Disclaimer__c ,
                                              Order_By__c, Limit__c, Count_Query__c, 
                                              (select Id, Name, fieldAPIName__c, FieldType__c, 
                                               ShowInPallet__c, isLink__c, Link_Reference__c, 
                                               Operation__c from Dynamic_List_Fields__r order by index__c) 
                                              from Dynamic_List__c  where Name =:dynlst2.Name order by lastModifiedDate desc];
        
        system.assertEquals('DynamicPopulationMetric2', lstDynamicList[0].Name);
        system.assertEquals('Performance_Metric__c', lstDynamicList[0].objectAPIName__c);
        test.stopTest();
    }
    
    static testMethod void validategetFHIRQueryResult() {
        //List<Account> lstAccounts = TestDataFactory.createAccount(1);
        String strRecordTypeId = [Select Id From RecordType Where SobjectType = 'Account' and Name = 'Individual'].Id;             
        Account ac;
        ac = new Account(RecordTypeId = strRecordTypeId, Name='James',
                         HealthCloudGA__SourceSystem__c='Health1-00D630000009MZ7', 
                         first_name__c='James', Last_Name__c = 'Franklin', GenderLabel__c = 'M',
                         Date_of_Birth__c = Date.newInstance(1975,12,10), Medicaid_CIN__c = '468927',
                         PCP__c = 'xxxx yyyy', Phone='123883483',EMPI__c='121314');
        insert ac;
        
        Account acc;
        acc = new Account(RecordTypeId = strRecordTypeId, Name='Pro',
                         HealthCloudGA__SourceSystem__c='Health1-00D630000009MZ7', 
                         first_name__c='Prodigy', Last_Name__c = 'Sharma', GenderLabel__c = 'M',
                         Date_of_Birth__c = Date.newInstance(1995,12,25), Medicaid_CIN__c = '1213',
                         PCP__c = 'xxxx yyyy', Phone='123883483',EMPI__c='12131210');
        insert acc;
        
        APIResourceData__c apiResData = new APIResourceData__c(EMPI__c=ac.EMPI__c,FromDate__c=Date.newInstance(2014,12,12),
                                                               Resource__c='Observation',ToDate__c=Date.newInstance(2015,12,10));
        insert apiResData;
        
        APIResourceData__c apiResData1 =    new APIResourceData__c(EMPI__c=acc.EMPI__c,Resource__c='Problem List');
        insert apiResData1;
        
        test.startTest();
        String response = ApiDynListController.getFHIRQueryResult('Observation',apiResData.EMPI__c,'','buttonClick');
        String response1 = ApiDynListController.getFHIRQueryResult('Problem List',apiResData1.EMPI__c,'','');
       // String response2 = ApiDynListController.getFHIRQueryResult('Problem List','fdsfds','','');
        if(!String.isEmpty(response) || !String.isEmpty(response1))
            System.assertEquals('<p/><b>NOTE</b> – You are currently seeing the records cached in Patient 360 now.', response);
        else
            system.assertEquals('', response);
        
        test.stopTest();
    }
    //Test method for call out failures
    /*@isTest static void validatevalidategetFHIRQueryResultError(){
        String strRecordTypeId = [Select Id From RecordType Where SobjectType = 'Account' and Name = 'Individual'].Id;             
        Account ac;
        ac = new Account(RecordTypeId = strRecordTypeId, Name='James',
                         HealthCloudGA__SourceSystem__c='Health1-00D630000009MZ7', 
                         first_name__c='James', Last_Name__c = 'Franklin', GenderLabel__c = 'M',
                         Date_of_Birth__c = Date.newInstance(1975,12,10), Medicaid_CIN__c = '468927',
                         PCP__c = 'xxxx yyyy', Phone='123883483',EMPI__c='121314');
        insert ac;
        
        APIResourceData__c apiResData = new APIResourceData__c(EMPI__c=ac.EMPI__c,FromDate__c=Date.newInstance(2014,12,12),
                                                               Resource__c='Observation',ToDate__c=Date.newInstance(2015,12,10));
        insert apiResData;
        
        TestDataFactory.createSourceSystemFHIRObservation();
        StaticResourceCalloutMock mock = new StaticResourceCalloutMock();
        mock.setStaticResource('MockFHIRLabResult');
        mock.setStatusCode(504);
        mock.setHeader('Content-Type', 'application/json');
        // Set the mock callout mode
        Test.setMock(HttpCalloutMock.class, mock);
        //Call the method which performs call out
        String response =ApiDynListController.getFHIRQueryResult('Observation',apiResData.EMPI__c,'','');
        System.debug('response'+response);
       // System.assertEquals(response.contains('ERROR'), true);
    }*/
}