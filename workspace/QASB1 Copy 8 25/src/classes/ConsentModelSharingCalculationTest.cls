@isTest 
public class ConsentModelSharingCalculationTest {
    static testMethod void validateConsentModelSharingCalculation() {
        
        ConsentModel__c consent=new ConsentModel__c(Name ='1',Account_Api__c='id', AccessLevel_Api__c='AccountAccessLevel,CaseAccessLevel,ContactAccessLevel,OpportunityAccessLevel',Object__c='Account',Share_object__c='AccountShare',DW_Key__c='HealthCloudGA__SourceSystemId__c');
        insert consent;
       
        List<Account> lstaccs = new List<Account>();
        List<AccountShare> lstAccountshare=new List<AccountShare>();
        for(Integer i=0 ;i <200;i++){
            Account ac;
            ac = new Account(Name='James', First_Name__c='James'+i, Last_Name__c = 'Franklin', Middle_Name__c = 'Rhodes', GenderLabel__c = 'M', Date_of_Birth__c = Date.newInstance(1975,12,10), Medicaid_CIN__c = '46892'+i);
            lstaccs.add(ac);
           
            
        }
        insert lstaccs;
        
        lstAccountshare= [SELECT AccountId  FROM AccountShare];
        
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
            Patient_Consent_Facility__c patientFacility = new Patient_Consent_Facility__c(Account__c=lstaccs[i].id, facility__c = f.id, Consent_Status__c='Yes');
            lstPatientFacility.add(patientFacility);
        }
        insert lstPatientFacility ;
        
        
       
        Test.startTest();
        ConsentModel__c  consentModelSettings = ConsentModel__c.getinstance(consent.Name);
      String query = '';
      system.debug('consentModelSettings :: ' + consentModelSettings);
      if(consentModelSettings != null){
       query = 'SELECT ' + consentModelSettings.Account_Api__c + ' FROM ' + consentModelSettings.Object__c ;
        system.debug('query :: ' + query);
        }
       
      
        ConsentModelSharingCalculation obj = new ConsentModelSharingCalculation(consent.Name, true);
        DataBase.executeBatch(obj,200); 
        Test.stopTest();
        
        
        System.assertEquals(lstAccountshare.size(),lstaccs.size());
        
    }
}