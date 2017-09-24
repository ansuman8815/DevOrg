/**
	@Author      :	Cognizant Technology Solutions
	@name        :	PatientSummaryControllerTest
	@CreateDate  :	23/02/2017
	@Description :  Test Patient Banner data and Patient Demographic data methods by passing patiend id
	@Version     :	1.0
*/
@isTest(SeeAllData = false) 
public class PatientSummaryControllerTest {

    static testMethod void validategetPatientBannerData() {
      
        String strRecordTypeId = [Select Id From RecordType Where SobjectType = 'Account' and Name = 'Individual'].Id;             
        Account ac;
        ac = new Account(RecordTypeId = strRecordTypeId,Name='James', HealthCloudGA__SourceSystem__c='Health1-00D630000009MZ7', first_name__c='James', Last_Name__c = 'Franklin', Middle_Name__c = 'Rhodes', GenderLabel__c = 'M', Date_of_Birth__c = Date.newInstance(1975,12,10), Medicaid_CIN__c = '468927',Phone='123883483',pcp__c='abc');
        insert ac;
        
        HealthCloudGA__EhrEncounter__c en;
        en = new HealthCloudGA__EhrEncounter__c(HealthCloudGA__PeriodStart__c = Date.newInstance(1975,12,10),  HealthCloudGA__SourceSystem__c = 'Health1-00D630000009MZ7' , HealthCloudGA__Location1Description__c = 'new loc', HealthCloudGA__Account__c =  ac.id);
        insert en;
         
        Account ac1;
        ac1 = new Account(RecordTypeId = strRecordTypeId,Name='Shradha', HealthCloudGA__SourceSystem__c='Health1-00D630000009MZ7', first_name__c='Shruti', Last_Name__c = 'V', Middle_Name__c = 'M', GenderLabel__c = 'F', Date_of_Birth__c = Date.newInstance(1975,12,10), Medicaid_CIN__c = '468927',Phone='123883483',pcp__c='abc');
        insert ac1;
        
        HealthCloudGA__EhrEncounter__c en1;
        en1 = new HealthCloudGA__EhrEncounter__c(HealthCloudGA__PeriodStart__c = Date.newInstance(1975,12,10),  HealthCloudGA__SourceSystem__c = 'Health1-00D630000009MZ7' , HealthCloudGA__Location1Description__c = 'new loc', HealthCloudGA__Account__c =ac1.id);
        insert en1;
        
        test.startTest();
        PatientSummaryController.PatientBannerData ptbannerdata  ;
        ptbannerdata = PatientSummaryController.getPatientBannerData(ac.Id);
        
        PatientSummaryController.PatientBannerData ptbannerdata1;
        ptbannerdata1 = PatientSummaryController.getPatientBannerData(ac1.Id);
        test.stopTest();
        system.assertEquals(ptbannerdata.name, 'James Rhodes Franklin');
        system.assertEquals(ptbannerdata.gender, 'Male');
        system.assertEquals(ptbannerdata.pcp, 'abc');
        
        system.assertEquals(ptbannerdata1.name, 'Shruti M V');
        system.assertEquals(ptbannerdata1.gender, 'Female');
        system.assertEquals(ptbannerdata1.pcp, 'abc');
       }
   
    static testMethod void validategetPatientData() {
       
        String strRecordTypeId = [Select Id From RecordType Where SobjectType = 'Account' and Name = 'Individual'].Id; 
        
        Account ac;
        ac = new Account(RecordTypeId = strRecordTypeId, Name='James', EMPI__c = '', Phone='1234567899', Work_Phone__c= '3333333333', Primary_Language__c = 'English', Secondary_Language__c = 'Spanish' , Race_Label__c = '', Ethnicity_Label__c = '', HealthCloudGA__SourceSystem__c='Health1-00D630000009MZ7', first_name__c='James', Last_Name__c = 'Franklin', Middle_Name__c = 'Rhodes', GenderLabel__c = 'M', Date_of_Birth__c = Date.newInstance(1975,12,10), Medicaid_CIN__c = '468927', PCP__c = 'xxxx yyyy', Mobile_Phone__c='2589631478');
        insert ac;
        
        String strContRecordTypeId = [Select Id From RecordType Where SobjectType = 'Contact' and Name = 'Individual'].Id;
        Contact ct ;
        ct = new Contact(RecordTypeId = strContRecordTypeId,MailingStreet = 'DLF 4', MailingCity = 'City1', MailingState = 'State1', MailingPostalCode = '123456' , County__c = 'Country1' , LastName = 'lastname1', AccountId = ac.id);
        insert ct;
        
        test.startTest();
        PatientSummaryController.PatientData ptdata ;
        ptdata =  PatientSummaryController.getPatientData(ac.id);
        test.stopTest(); 
        string ptname =  PatientSummaryController.getPatientName(ac.id) ;
        String ptdob  =	 PatientSummaryController.getPatientDob(ac.id);
        system.assertEquals(ptname, 'James Rhodes Franklin');
        System.assertEquals(ptdob, '12/10/75');   
    } 
   
    static testMethod void validategetSourceValue(){
       
        Account ac =UtilityTestData.createAccount('James', Date.newInstance(1995,12,25), '12BCS1213', 'abc',
                                                   '121212121', 'Health1-00D630000009MZ7');
        HealthCloudGA__EhrEncounter__c en;
        en = new HealthCloudGA__EhrEncounter__c(HealthCloudGA__PeriodStart__c = Date.newInstance(1975,12,10),  HealthCloudGA__SourceSystem__c = 'Health1-00D630000009MZ7' , HealthCloudGA__Location1Description__c = 'new loc', HealthCloudGA__Account__c =  ac.id);
        insert en;
        
        String strContRecordTypeId = [Select Id From RecordType Where SobjectType = 'Contact' and Name = 'Individual'].Id;
		Contact ct ;
        ct = new Contact(RecordTypeId = strContRecordTypeId,MailingStreet = 'DLF 4', MailingCity = 'City1', MailingState = 'State1', MailingPostalCode = '123456' , County__c = 'Country1' , LastName = 'lastname1', AccountId = ac.id);
        insert ct;
        
        test.startTest();
        List<Contact> lstContacts=PatientSummaryController.getSourceValue(ac.Id,ac.EMPI__c);
        test.stopTest();
        System.assertEquals(lstContacts[0].Account.HealthCloudGA__SourceSystem__c, 'Health1-00D630000009MZ7');

    }
}