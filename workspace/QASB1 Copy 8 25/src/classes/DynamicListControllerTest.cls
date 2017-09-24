/*
Description: 1. Test class to validate Patient records on the basis of different categories and where clause
Created By : Cognizant Technology Solutions
Create Date: 02/03/2017
*/
@isTest
public class DynamicListControllerTest {
    
    static testMethod void validategetDataForComponent() {
        test.startTest();
        
        String strRecordTypeId = [Select Id From RecordType Where SobjectType = 'Account' and Name = 'Individual'].Id;             
        Account ac;
        ac = new Account(RecordTypeId = strRecordTypeId, Name='James', HealthCloudGA__SourceSystem__c='Health1-00D630000009MZ7', first_name__c='James', Last_Name__c = 'Franklin', GenderLabel__c = 'M', Date_of_Birth__c = Date.newInstance(1975,12,10), Medicaid_CIN__c = '468927', PCP__c = 'xxxx yyyy', Phone='123883483');
        insert ac;
        
        
        string  acParam = '\'' + ac.Id + '\'';
        string strwhereclause   = 'Account__c =  ' + acParam;
        
        
        string  acParam1 = '\"' + ac.Id + '\"';
        string strwhereclause1   = 'Account__c =  ' + acParam1;
        
        Dynamic_List__c dynlst;        
        dynlst = new Dynamic_List__c(Name = 'DynamicPopulationMetric', objectAPIName__c = 'Performance_Metric__c', WhereClause__c = strwhereclause1, Order_By__c = 'Measure_name__c ASC', Limit__c = '3'); 
        insert dynlst;
        
        Dynamic_List_Field__c  dynlstfld;
        dynlstfld = new Dynamic_List_Field__c(Name = 'Performance Metric', fieldAPIName__c = 'Measure_Name__c', ShowInPallet__c = false, isLink__c = true, index__c = 1, DynamicList__c = dynlst.id,Link_Reference__c='Account__c',FieldType__c='Date');
        insert dynlstfld;
        
        Dynamic_List_Field__c  dynlstfld1;
        dynlstfld1 = new Dynamic_List_Field__c(Name = 'Description', fieldAPIName__c = 'Assignment_Reason__c', ShowInPallet__c = false, isLink__c = false, index__c = 2, DynamicList__c = dynlst.id);
        insert dynlstfld1;
        
        Performance_Metric__c  pm1 = new Performance_Metric__c(Account__c = ac.Id, Measure_Name__c = 'Measure Name1', Assignment_Reason__c = 'Description1');
        insert pm1;
        
        Performance_Metric__c  pm2 = new Performance_Metric__c(Account__c = ac.Id, Measure_Name__c = 'Measure Name2', Assignment_Reason__c = 'Description2');
        insert pm2;
        
        DynamicListController.DisplayPalletRecords objDyncLstDispRec;
        objDyncLstDispRec =  DynamicListController.getDataForComponent(dynlst.Name, strwhereclause, 'false');
        
        Dynamic_List__c dynlst1;
        dynlst1 = new Dynamic_List__c(Name = 'DynamicPopulationMetric1', objectAPIName__c = 'Performance_Metric__c', WhereClause__c = strwhereclause1, Order_By__c = 'Measure_name__c ASC', Limit__c = '3',Count_Query__c=''); 
        insert dynlst1;
        
        Dynamic_List_Field__c  dynlstfld2;
        dynlstfld2 = new Dynamic_List_Field__c(Name = 'Performance Metric1', fieldAPIName__c = 'Measure_Name__c', ShowInPallet__c = true, isLink__c = false, index__c = 1, DynamicList__c = dynlst1.id);
        insert dynlstfld2;
        
        Dynamic_List_Field__c  dynlstfld3;
        dynlstfld3 = new Dynamic_List_Field__c(Name = 'Description1', fieldAPIName__c = 'Assignment_Reason__c', ShowInPallet__c = true, isLink__c = false, index__c = 2, DynamicList__c = dynlst1.id);
        insert dynlstfld3;
        
        Performance_Metric__c  pm3 = new Performance_Metric__c(Account__c = ac.Id, Measure_Name__c = 'Measure Name3', Assignment_Reason__c = 'Description3');
        insert pm3;
        
        Performance_Metric__c  pm4 = new Performance_Metric__c(Account__c = ac.Id, Measure_Name__c = 'Measure Name4', Assignment_Reason__c = 'Description4');
        insert pm4;
        
        DynamicListController.DisplayPalletRecords objDyncLstDispRec2;
        objDyncLstDispRec2 =  DynamicListController.getDataForComponent(dynlst1.Name, strwhereclause, 'pallet');
        
        Dynamic_List__c dynlst2;
        dynlst2 = new Dynamic_List__c(Name = 'DynamicPopulationMetric2', objectAPIName__c = 'Performance_Metric__c', WhereClause__c = strwhereclause1, Order_By__c = 'Measure_name__c ASC', Limit__c = '1',Count_Query__c=''); 
        insert dynlst2;
        
        Dynamic_List_Field__c  dynlstfld4;
        dynlstfld4 = new Dynamic_List_Field__c(Name = 'Performance Metric2', fieldAPIName__c = 'Measure_Name__c', ShowInPallet__c = true, isLink__c = false, index__c = 1, DynamicList__c = dynlst2.id);
        insert dynlstfld4;
        
        Dynamic_List_Field__c  dynlstfld5;
        dynlstfld5 = new Dynamic_List_Field__c(Name = 'Description2', fieldAPIName__c = 'Assignment_Reason__c', ShowInPallet__c = true, isLink__c = false, index__c = 2, DynamicList__c = dynlst2.id);
        insert dynlstfld5;
        
        Performance_Metric__c  pm5 = new Performance_Metric__c(Account__c = ac.Id, Measure_Name__c = 'Measure Name3', Assignment_Reason__c = 'Description3');
        insert pm5;
        
        Performance_Metric__c  pm6 = new Performance_Metric__c(Account__c = ac.Id, Measure_Name__c = 'Measure Name4', Assignment_Reason__c = 'Description4');
        insert pm6;
        
        DynamicListController.DisplayPalletRecords objDyncLstDispRec3;
        objDyncLstDispRec3 =  DynamicListController.getDataForComponent(dynlst2.Name, strwhereclause, 'div');
        
        List<Dynamic_List__c> lstDynamicList=[Select Name, objectAPIName__c, WhereClause__c, Disclaimer__c , Order_By__c, Limit__c, Count_Query__c, 
                                              (select Id, Name, fieldAPIName__c, FieldType__c, ShowInPallet__c, isLink__c, Link_Reference__c, Operation__c from Dynamic_List_Fields__r order by index__c) from Dynamic_List__c  where Name =:dynlst2.Name order by lastModifiedDate desc];
        
        system.assertEquals('DynamicPopulationMetric2', lstDynamicList[0].Name);
        system.assertEquals('Performance_Metric__c', lstDynamicList[0].objectAPIName__c);
        
        test.stopTest();
    }
    static testMethod void validategetDropDownValue(){
        test.startTest();
        string pageName='Clinical Summary';
        Dynamic_List__c dl = new Dynamic_List__c(Name='Immunizations', pageName__c ='Clinical Summary');
        insert dl;
        DynamicListController.getDropDownValue(pageName);
        dl=[Select name from Dynamic_List__c where pageName__c =: pageName];
        
        System.assertEquals(dl.name, 'Immunizations');
        test.stopTest();
    }
    
}