/**************************************************************************************************************************************************
Name: X4Cii_PARelatedListsCtrlTest
===================================================================================================================================================
   Summary : This class contain positive behavioral test methods and negative behavioral test methods for 'X4Cii_PARelatedListsCtrl' class
------------------------------------------------------------------------------------------------------------------------
 Apex class(es) whose code is covered : X4Cii_PARelatedListsCtrl 
========================================================================================================================
 Code Coverage History:                                                        
------------------------------------------------------------------------------------------------------------------------
 VERSION DEVELOPER          DATE       DETAIL                                  REQUEST #
------------------------------------------------------------------------------------------------------------------------
     1.0 Viswanath Malayathi  06/25/2017 Initial Development                                
***********************************************************************************************************************/
@isTest
Public class X4Cii_PARelatedListsCtrlTest
{
    static testMethod void X4Cii_PARelatedListsCtrl() {
        set<String> rcds = new set<String>{'CD4','Incentive','VL'};
        List<RecordType> rcdTypeList = [select Id, Name from RecordType where Name IN: rcds];
        Map<string, RecordType> rcdMap = new Map<String, RecordType>();
        
        for(RecordType rcd: rcdTypeList){
            rcdMap.put(rcd.Name, rcd);
        }
        
        User usr = [select Id, Name, Partner_Organization__c from User where Id =: userinfo.getUserId()];
        system.runAs(usr){
            string po = usr.Partner_Organization__c.substring(0,2);
            List<X4Cii_Patient__c> paList = new List<X4Cii_Patient__c>();
            Test.startTest();
                X4Cii_Patient__c pa = new X4Cii_Patient__c();
                pa.Name = po+'121212121212';   
                insert pa;
                
                X4Cii_Patient_Association__c pac = new X4Cii_Patient_Association__c();
                pac.RecordTypeId = rcdMap.get('CD4').Id;
                pac.X4Cii_Patient__c = pa.Id;
                pac.X4Cii_CD4_Count__c = 1;
                pac.X4Cii_CD4_Date__c = system.today()+1;
                insert pac;
                
                X4Cii_Patient_Association__c pac1 = new X4Cii_Patient_Association__c();
                pac1.RecordTypeId = rcdMap.get('Incentive').Id;
                pac1.X4Cii_Patient__c = pa.Id;
                pac1.X4Cii_Incentive_Disbursed__c = 'Yes';
                pac1.X4Cii_Date_Disbursed__c = system.today()+4;
                insert pac1;
                
                X4Cii_Patient_Association__c pac2 = new X4Cii_Patient_Association__c();
                pac2.RecordTypeId = rcdMap.get('VL').Id;
                pac2.X4Cii_Patient__c = pa.Id;
                pac2.X4Cii_VL_Count__c = 1;
                pac2.X4Cii_VL_Date__c = system.today()+5;
                insert pac2;
                
                X4Cii_PARelatedListsCtrl paRelated = new X4Cii_PARelatedListsCtrl(new ApexPages.StandardController(pa));
            Test.stopTest();
        }
    }



}