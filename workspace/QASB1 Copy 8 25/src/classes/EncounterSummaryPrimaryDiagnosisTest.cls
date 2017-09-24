/*
Description: 1. Test class for EncounterSummaryPrimaryDiagnosisBatch class
Created By : Cognizant Technology Solutions
Create Date: 27/03/2017
*/
@isTest
public class EncounterSummaryPrimaryDiagnosisTest {
    
    static testMethod void validateEncounterSummaryPrimaryDiagnosisBatch() {
        
        String strRecordTypeId = [Select Id From RecordType Where SobjectType = 'Account' and Name = 'Individual'].Id;             
        
        List<Account> lstaccs  = new List<Account>();
        /*for(Integer i=0 ;i<200;i++){
            Account ac;
            ac = new Account(RecordTypeId = strRecordTypeId, Name='James', First_Name__c='James'+i, Last_Name__c = 'Franklin', Middle_Name__c = 'Rhodes', GenderLabel__c = 'M', Date_of_Birth__c = Date.newInstance(1975,12,10), Medicaid_CIN__c = '46892'+i);
            lstaccs.add(ac);
        }*/
        Account ac;
        ac = new Account(RecordTypeId = strRecordTypeId, Name='James', First_Name__c='James', Last_Name__c = 'Franklin', Middle_Name__c = 'Rhodes', GenderLabel__c = 'M', Date_of_Birth__c = Date.newInstance(1975,12,10), Medicaid_CIN__c = '46892');
            
        insert ac;
        
        //string acid = lstaccs[0].id;
        
        List<HealthCloudGA__EhrEncounter__c> lstencs = new List<HealthCloudGA__EhrEncounter__c>();
        for(Integer i=0 ;i <3;i++){
            HealthCloudGA__EhrEncounter__c enc;
            enc = new HealthCloudGA__EhrEncounter__c(HealthCloudGA__Account__c=ac.id);
            lstencs.add(enc);
        }
        insert lstencs;

       
        string EN1PrimaryDiagnosis='', EN2PrimaryDiagnosis='', EN3PrimaryDiagnosis='';
        List<HealthCloudGA__EhrCondition__c> lstcondition = new List<HealthCloudGA__EhrCondition__c>();
        for(Integer i=0 ;i <5;i++){
            HealthCloudGA__EhrCondition__c condition;
            condition = new HealthCloudGA__EhrCondition__c(HealthCloudGA__Account__c=ac.id,HealthCloudGA__Encounter__c=lstencs[0].id,HealthCloudGA__CodeLabel__c= 'EN1 Code Label' + i, Hospital_Problem__c= true,Condition_type__c='Encounter Diagnosis');
            EN1PrimaryDiagnosis = EN1PrimaryDiagnosis + '\n' + 'EN1 Code Label' + i; 
            lstcondition.add(condition);
           
        }
        for(Integer i=0 ;i <5;i++){
            HealthCloudGA__EhrCondition__c condition;
            condition = new HealthCloudGA__EhrCondition__c(HealthCloudGA__Account__c=ac.id,HealthCloudGA__Encounter__c=lstencs[1].id,HealthCloudGA__CodeLabel__c= 'EN2 Code Label' + i, Hospital_Problem__c= true,Condition_type__c='Encounter Diagnosis');
            EN2PrimaryDiagnosis =EN2PrimaryDiagnosis +  '\n' + 'EN2 Code Label' + i; 
            lstcondition.add(condition);
           
        }
        for(Integer i=0 ;i <5;i++){
            HealthCloudGA__EhrCondition__c condition;
            condition = new HealthCloudGA__EhrCondition__c(HealthCloudGA__Account__c=ac.id,HealthCloudGA__Encounter__c=lstencs[2].id,HealthCloudGA__CodeLabel__c= 'EN3 Code Label' + i, Hospital_Problem__c= true,Condition_type__c='Encounter Diagnosis');
            EN3PrimaryDiagnosis =EN3PrimaryDiagnosis +  '\n' + 'EN3 Code Label' + i; 
            lstcondition.add(condition);
           
        }
        insert lstcondition;
        
        test.startTest();
        EncounterSummaryPrimaryDiagnosisBatch diagnosisBatch = new EncounterSummaryPrimaryDiagnosisBatch();
        DataBase.executeBatch(diagnosisBatch);
        test.stopTest();
        lstencs = [Select Id, Primary_Diagnosis__c from HealthCloudGA__EhrEncounter__c];
        //System.debug('1111: ' + EN2PrimaryDiagnosis);
        //System.debug('3333: ' + EN1PrimaryDiagnosis);
        //System.debug('2222: ' + lstencs[1].Primary_Diagnosis__c); 
        System.AssertEquals (EN1PrimaryDiagnosis.contains(lstencs[0].Primary_Diagnosis__c), true);
        System.AssertEquals (EN2PrimaryDiagnosis.contains(lstencs[1].Primary_Diagnosis__c), true);
        System.AssertEquals (EN3PrimaryDiagnosis.contains(lstencs[2].Primary_Diagnosis__c), true);
    }
}