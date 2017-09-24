/**
 	@Author      : 	Cognizant Technology Solutions
	@name		 :	PatientConsentSharingBatchTest			
    @Description :  Test Class to validate PatientConsentSharingBatch.
	@Create Date : 	7/25/2017
	@Version     :  1.0
*/
@isTest  (SeeAllData = false)
public class PatientConsentSharingBatchTest {
    static testMethod void validatePatientConsentSharingBatch(){
        ConsentModel__c consent=new ConsentModel__c(Name ='0', 
                                                    Object__c='Patient_Consent_Facility__c',
                                                    whereClause__c='consent_status__c=' +'\'Yes\''
                                                    +' AND LastModifiedDate > 2017-05-25T13:14:26.000Z');
        insert consent;
        List<Account> lstaccs = new List<Account>();
        Account ac;
        for(Integer i=0;i<200;i++){
            ac = new Account(Name='James', First_Name__c='James'+i, Last_Name__c = 'Franklin', 
                             Middle_Name__c = 'Rhodes', GenderLabel__c = 'M', 
                             Date_of_Birth__c = Date.newInstance(1975,12,10), 
                             Medicaid_CIN__c = '46892'+i);
            lstaccs.add(ac);
        }
        insert lstaccs;
       	HealthCloudGA__EhrObservation__c ehrObservation=new HealthCloudGA__EhrObservation__c(HealthCloudGA__Account__c=ac.Id);
        List<AccountShare> lstAccountshare= [SELECT AccountId  FROM AccountShare];
        
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
        PatientConsentSharingBatch pcsb = new PatientConsentSharingBatch();
        Database.executeBatch(pcsb,200);
        System.assertEquals(lstAccountshare.size(),lstaccs.size());
        test.stopTest();
    }
}