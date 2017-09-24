@isTest
public class ConsentModelSharingDeletionTest {
    static testMethod void validateConsentModelSharingDeletion(){
        
        ConsentModel__c consent=new ConsentModel__c(Name ='1',Account_Api__c='id', AccessLevel_Api__c='AccountAccessLevel,CaseAccessLevel,ContactAccessLevel,OpportunityAccessLevel',Object__c='Account',Share_object__c='AccountShare',DW_Key__c='HealthCloudGA__SourceSystemId__c');
        insert consent;
        
        List<Account> lstaccs = new List<Account>();
        
        for(Integer i=0 ;i <200;i++){
            Account ac;
            ac = new Account(Name='James', First_Name__c='James'+i, Last_Name__c = 'Franklin', Middle_Name__c = 'Rhodes', GenderLabel__c = 'M', Date_of_Birth__c = Date.newInstance(1975,12,10), Medicaid_CIN__c = '46892'+i);
            lstaccs.add(ac);
        }
        insert lstaccs;
        
        string acid = lstaccs[0].id;
        
        Group testGroup = new Group();
        testGroup.Name = 'Mt_Sinai';
        testGroup.DeveloperName = 'Mt_Sinai';
        insert testGroup;
        
        Facility__c f = new Facility__c ();
        f.Name = 'Mt Sinai';
        f.FacilityPublicGroupId__c = testGroup.Id; 
        insert f; 
        List<Patient_Consent_Facility__c> lstPatientFacility = new List<Patient_Consent_Facility__c>();
        for(Integer i=0 ;i <200;i++){
            Patient_Consent_Facility__c patientFacility = new Patient_Consent_Facility__c(Account__c=lstaccs[i].id, facility__c = f.id, Consent_Status__c='No');
            lstPatientFacility.add(patientFacility);
        }
        insert lstPatientFacility ;
        
        AccountShare accountShareObj =new AccountShare(Accountid = acid , UserorGroupId = testGroup.Id , RowCause='Manual' , AccountAccessLevel= 'Read' , CaseAccessLevel= 'Read' , ContactAccessLevel= 'Read' , OpportunityAccessLevel= 'Read');
        insert accountShareObj;
        
        Test.startTest();
        ConsentModelSharingDeletion objConsentModel=new ConsentModelSharingDeletion(consent.Name, false);
        DataBase.executeBatch(objConsentModel,200); 
        Test.stopTest();
        List<AccountShare> account = [SELECT Id, AccountId, UserOrGroupId FROM AccountShare];
        System.AssertEquals(lstaccs.size(),account.size());
        
        
    }
}