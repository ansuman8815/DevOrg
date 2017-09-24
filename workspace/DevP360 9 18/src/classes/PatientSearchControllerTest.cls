/**
	@Author      :	Cognizant Technology Solutions
	@name        :	PatientSearchControllerTest
	@CreateDate  :	23/01/2017 
	@Description :  Test Class to validate Patient Search related information
	@Version     :	1.0
*/
@isTest(SeeAllData=false) 
private class PatientSearchControllerTest {
    
    static testMethod void validategetSearchPatientData() {
        test.startTest();
        Id usr = UserInfo.getUserId();
        User_Credential_Facility__c ucf = new User_Credential_Facility__c(Name ='Prodigy Sharma',User__c=usr); 
        insert ucf;
        
        Facility__c fac = new Facility__c(Name='Mt Sinai');
        insert fac;
        
        String strRecordTypeId = [Select Id From RecordType Where SobjectType = 'Account' and Name = 'Individual'].Id; 
        
        Account act =UtilityTestData.createAccount('Prodigy Sharma', Date.newInstance(1995,12,25), '12BCS1213', 'abc',
                                                   '121212121', 'MSHS-EPIC');
        
        Account act1 =UtilityTestData.createAccount('Prodigy Sharma', Date.newInstance(1995,12,25), '12BCS1213', 'abc',
                                                    '121212121', 'Health1-00D630000009MZ7');
        
        Patient_Consent_Facility__c pcf = new Patient_Consent_Facility__c(Account__c=act.Id,
                                                                          Consent_Status__c='Yes',
                                                                          Facility__c=fac.Id);
        insert pcf;
        
        HealthCloudGA__EhrEncounter__c ehrEnc=new HealthCloudGA__EhrEncounter__c(HealthCloudGA__SourceSystem__c='MSHS-EPIC',
                                                                                 HealthCloudGA__Account__c=act.Id,
                                                                                 HealthCloudGA__PeriodStart__c=Date.newInstance(2016,02,10));
        insert ehrEnc;
        
        String strContRecordTypeId = [Select Id From RecordType Where SobjectType = 'Contact' and Name = 'Individual'].Id;
        Contact ct1 ;
        ct1 = new Contact(RecordTypeId = strContRecordTypeId,MailingStreet = 'DLF 4', MailingCity = 'City1', MailingState = 'State1', MailingPostalCode = '123456' , County__c = 'Country1' , LastName = 'lastname1', AccountId = act1.Id);
        insert ct1;
        
        List<PatientSearchController.DisplayPatientRecords> accts =  PatientSearchController.getSearchPatientData('', '' ,'','12BCS1213',
                                                                                                                  '12/25/1995');
        System.assertEquals(1, accts.size());
        
        List<PatientSearchController.DisplayPatientRecords> accts1 =  PatientSearchController.getSearchPatientData('Prodigy','Sharma' ,'','12BCS1213',
                                                                                                                   '12/25/1995');
        System.assertEquals(0, accts1.size());
        
        test.stopTest();
    }
    
    static testMethod void validategetSearchAccountDataCount() {
        test.startTest();
        
        String strRecordTypeId = [Select Id From RecordType Where SobjectType = 'Account' and Name = 'Individual'].Id;             
        
        Account ac;
        ac = new Account(RecordTypeId = strRecordTypeId, Name='James', First_Name__c='James', Last_Name__c = 'Franklin',
                         Middle_Name__c = 'Rhodes', GenderLabel__c = 'M', Medicaid_CIN__c  = '468927',
                         Date_of_Birth__c=Date.newInstance(1995,12,25));
        insert ac;
        
        integer cnt = 0;
        
        cnt = PatientSearchController.getSearchAccountDataCount(ac.First_Name__c,'','','468927','');
        System.assertEquals(1, cnt);
        
        cnt = PatientSearchController.getSearchAccountDataCount('',ac.Last_Name__c,'','','12/25/1995');
        System.assertEquals(1, cnt);
        
        cnt = PatientSearchController.getSearchAccountDataCount('','',ac.GenderLabel__c,'','');
        System.assertEquals(1, cnt);
        
        cnt = PatientSearchController.getSearchAccountDataCount('','','','','12/25/1995');
        System.assertEquals(1, cnt);
        
        cnt = PatientSearchController.getSearchAccountDataCount(ac.First_Name__c,'','','','12/25/1995');
        System.assertEquals(1, cnt);
        
        cnt = PatientSearchController.getSearchAccountDataCount(ac.First_Name__c, ac.Last_Name__c, ac.GenderLabel__c, '','12/25/1995');
        System.assertEquals(1, cnt);
        
        Account ac1;
        ac1 = new Account(RecordTypeId = strRecordTypeId, Name='James', First_Name__c='James', Last_Name__c = 'Franklin', Middle_Name__c = 'Rhodes', GenderLabel__c = 'M', Medicaid_CIN__c  = '468927');
        insert ac1;
        
        cnt = PatientSearchController.getSearchAccountDataCount(ac1.First_Name__c, ac1.Last_Name__c, 'Male', '','12/25/1995');
        System.assertEquals(1, cnt);
        
        test.stopTest();
    }
    static testMethod void validateupdateUserSession(){
        Account act =UtilityTestData.createAccount('Prodigy Sharma', Date.newInstance(1995,12,25), '12BCS1213', 'abc',
                                                   '121212121', 'MSHS-EPIC');
        HealthCloudGA__EhrEncounter__c ehrEnc=new HealthCloudGA__EhrEncounter__c(HealthCloudGA__SourceSystem__c='MSHS-EPIC',
                                                                                 HealthCloudGA__Account__c=act.Id,
                                                                                 HealthCloudGA__PeriodStart__c=Date.newInstance(2016,02,10));
        insert ehrEnc;
        test.startTest();
        PatientSearchController.updateUserSession('Patient Search Result', 'fname', 'lname', 'cin', '10/10/2000', 'F',ehrEnc.Id);
        List<User_Session__c> lstUserSession=[SELECT Id, Current_Page__c, First_Name__c, Last_Name__c, CIN__c, Gender__c, DOB__c FROM User_Session__c order by LastModifiedDate desc];
        System.assertEquals( lstUserSession[0].Current_Page__c, 'Patient Search Result');
        test.stopTest();
    }
    
}