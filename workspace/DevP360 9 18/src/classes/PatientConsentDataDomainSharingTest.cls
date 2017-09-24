/**
 	@Author      : 	Cognizant Technology Solutions
	@name		 :	PatientConsentDataDomainSharingTest			
    @Description :  Test Class to validate PatientConsentDataDomainSharing.
	@Create Date : 	7/25/2017
	@Version     :  1.0
*/
@isTest  (SeeAllData = false)
public class PatientConsentDataDomainSharingTest {
    static testMethod void validatePatientConsentDataDomainSharing(){
       
        ConsentModel__c consent=new ConsentModel__c(Name ='1',Account_Api__c='id', 
                                                    AccessLevel_Api__c= 'AccountAccessLevel,CaseAccessLevel,ContactAccessLevel,'
                                                    +'OpportunityAccessLevel',
                                                    Object__c='Account',Share_object__c='AccountShare',
                                                    DW_Key__c='HealthCloudGA__SourceSystemId__c');
        insert consent;
        
        ConsentModel__c consent2=new ConsentModel__c(Name ='2',Account_Api__c='id', 
                                                    AccessLevel_Api__c= 'AccountAccessLevel,CaseAccessLevel,ContactAccessLevel,'
                                                    +'OpportunityAccessLevel',
                                                    Object__c='Account',Share_object__c='AccountShare',
                                                    DW_Key__c='HealthCloudGA__SourceSystemId__c');
        insert consent2;
        
        ConsentModel__c consent1=new ConsentModel__c(Name ='0', 
             Object__c='Patient_Consent_Facility__c',
             whereClause__c='consent_status__c=' +'\'Yes\''+' AND LastModifiedDate > 2017-05-25T13:14:26.000Z');
        insert consent1;
        
        List<Account> lstaccs = new List<Account>();
        List<AccountShare> lstAccountshare=new List<AccountShare>();
        for(Integer i=0;i<200;i++){
            Account ac;
            ac = new Account(Name='James', First_Name__c='James'+i, Last_Name__c = 'Franklin', 
                             Middle_Name__c = 'Rhodes', GenderLabel__c = 'M', 
                             Date_of_Birth__c = Date.newInstance(1975,12,10), 
                             Medicaid_CIN__c = '46892'+i);
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
        for(Integer i=0;i<200;i++){
            Patient_Consent_Facility__c patientFacility = new Patient_Consent_Facility__c(Account__c=lstaccs[i].id, 
                                                                                          facility__c = f.id, 
                                                                                          Consent_Status__c='Yes');
            lstPatientFacility.add(patientFacility);
        }
        insert lstPatientFacility ;
      
        test.startTest();
        
        PatientConsentDataDomainSharing pcds = new PatientConsentDataDomainSharing(consent.Name);
        PatientConsentDataDomainSharing pcds1 = new PatientConsentDataDomainSharing(consent2.Name);
        Database.executeBatch(pcds,200);
        Database.executeBatch(pcds1,200);
        System.assertEquals(lstAccountshare.size(),lstaccs.size());

        test.stopTest();
    }
    
}