/**************************************************************************************************************************************************
Name: X4Cii_PATriggerHandlerTest
Copyright © 2017 Cognizant
===================================================================================================================================================
   Summary : This class contain positive behavioral test methods and negative behavioral test methods for 'X4Cii_PatientAssociationTriggerHandler' class
------------------------------------------------------------------------------------------------------------------------
 Apex class(es) whose code is covered : incentiveUpdate
========================================================================================================================
 Code Coverage History:                                                        
------------------------------------------------------------------------------------------------------------------------
 VERSION DEVELOPER          DATE       DETAIL                                  REQUEST #
------------------------------------------------------------------------------------------------------------------------
     1.0 Viswanath Malayathi  07/31/2017 Initial Development                                
***********************************************************************************************************************/
@isTest
Public class X4Cii_PATriggerHandlerTest
{
   static testMethod void ptIncentiveUpdate() {
       X4Cii_Patient__c pat = new X4Cii_Patient__c();
       pat.Name = 'MS11111111';
       insert pat;
       
       X4Cii_Patient__c pat1 = new X4Cii_Patient__c();
       pat1.Name = 'MS22222222';         
       insert pat1;
       
    
       X4Cii_Patient_Association__c  pa = new X4Cii_Patient_Association__c ();
       pa.X4Cii_Patient__c = pat1.Id;
       pa.RecordTypeId  = Schema.SObjectType.X4Cii_Patient_Association__c .getRecordTypeInfosByName().get('Incentive').getRecordTypeId();
       pa.X4Cii_Incentive_Disbursed__c = 'Yes';
       pa.X4Cii_Date_Disbursed__c = system.now().date();
       insert pa;
       
       X4Cii_Patient_Association__c  pa1 = new X4Cii_Patient_Association__c ();
       pa1.X4Cii_Patient__c = pat.Id;
       pa1.RecordTypeId = Schema.SObjectType.X4Cii_Patient_Association__c .getRecordTypeInfosByName().get('VL').getRecordTypeId();
       pa1.X4Cii_VL_Count__c = 205;
       pa1.X4Cii_VL_Date__c = system.now().date();
       insert pa1;
       
       X4Cii_Patient_Association__c  pa2 = new X4Cii_Patient_Association__c ();
       pa2.X4Cii_Patient__c = pat1.Id;
       pa2.RecordTypeId = Schema.SObjectType.X4Cii_Patient_Association__c .getRecordTypeInfosByName().get('CD4').getRecordTypeId();
       pa2.X4Cii_CD4_Count__c = 220;
       pa2.X4Cii_CD4_Date__c = system.now().date();
       insert pa2;       
       
       List<X4Cii_Patient_Association__c > paList = new List<X4Cii_Patient_Association__c >();
       paList.add(pa);
       paList.add(pa1);
       paList.add(pa2);
       
       X4Cii_PatientAssociationTriggerHandler ndath = new X4Cii_PatientAssociationTriggerHandler();
       X4Cii_PatientAssociationTriggerHandler.patientUpdate(paList);
   }
   
}