/**
	@Author      :	Cognizant Technology Solutions
	@name        :	PatientEncounterSummaryControllerTest
	@CreateDate  :	06/03/2017 
	@Description :  To test the methods to fetch Patient encounter summary detail data 
	@Version     :	1.0
*/
@isTest(SeeAllData = false)
public class PatientEncounterSummaryControllerTest {
    
    static testMethod void validategetEncBannerData() {
        
        String strRecordTypeId = [Select Id From RecordType Where SobjectType = 'Account' and Name = 'Individual'].Id;             
        Account ac;
        ac = new Account(RecordTypeId = strRecordTypeId,Name='James', HealthCloudGA__SourceSystem__c='Health1-00D630000009MZ7', first_name__c='James', Last_Name__c = 'Franklin', Middle_Name__c = 'Rhodes', GenderLabel__c = 'M', Date_of_Birth__c = Date.newInstance(1975,12,10), Medicaid_CIN__c = '468927', PCP__c = 'xxxx yyyy', Phone='123883483');
        insert ac;
        
        
        HealthCloudGA__EhrEncounter__c objEhrEnc;
        objEhrEnc = new HealthCloudGA__EhrEncounter__c(HealthCloudGA__PeriodStart__c = Date.newInstance(2017,02,27),
                                                       HealthCloudGA__PeriodEnd__c = Date.newInstance(2025,03,03), 
                                                       HealthCloudGA__SourceSystem__c = 'Health1-00D630000009MZ7', 
                                                       HealthCloudGA__Location1Description__c = '',
                                                       HealthCloudGA__Status__c = 'Awaiting clarification',
                                                       HealthCloudGA__TypeCode__c = 'Type code 001', 
                                                       HealthCloudGA__HospitalizeAdmitSourceCode__c = '', 
                                                       HealthCloudGA__HospitalizeDischargeDispostionLabel__c = '',
                                                       HealthCloudGA__Account__c  =  ac.id
                                                      );
        
        insert objEhrEnc;
        
        HealthCloudGA__EhrObservation__c objHeight ;
        objHeight = new HealthCloudGA__EhrObservation__c(HealthCloudGA__ValueQuantity__c = 'vvvqqq', Encounter__c= objEhrEnc.id, HealthCloudGA__NameCode__c = 'HEIGHT',HealthCloudGA__ValueQuantityUnit__c='Inch');
        insert objHeight;
        
        HealthCloudGA__EhrObservation__c objWeight ;
        objWeight = new HealthCloudGA__EhrObservation__c(HealthCloudGA__ValueQuantity__c = 'aaabbb', Encounter__c= objEhrEnc.id, HealthCloudGA__NameCode__c = 'WEIGHT',HealthCloudGA__ValueQuantityUnit__c='Ounces');
        insert objWeight;
        
        HealthCloudGA__EhrObservation__c objBMI ;
        objBMI = new HealthCloudGA__EhrObservation__c(HealthCloudGA__ValueQuantity__c = 'cccddd', Encounter__c= objEhrEnc.id, HealthCloudGA__NameCode__c = 'BMI');
        insert objBMI;
        
        HealthCloudGA__EhrObservation__c objBPA ;
        objBPA = new HealthCloudGA__EhrObservation__c(HealthCloudGA__ValueQuantity__c = 'eeefff', Encounter__c= objEhrEnc.id, HealthCloudGA__NameCode__c = 'SBP');
        insert objBPA;
        
        HealthCloudGA__EhrObservation__c objBPB ;
        objBPB = new HealthCloudGA__EhrObservation__c(HealthCloudGA__ValueQuantity__c = 'ggghhh', Encounter__c= objEhrEnc.id, HealthCloudGA__NameCode__c = 'SBP');
        insert objBPB;
        
        test.startTest();
        PatientEncounterSummaryController.PatientEncBannerData objPatEncBanData;
        objPatEncBanData = PatientEncounterSummaryController.getEncBannerData(objEhrEnc.id);
        test.stopTest();  
        System.assertEquals('Awaiting clarification', objPatEncBanData.encStatus);
        System.assertEquals('02/26/2017', objPatEncBanData.encStartDate);
        System.assertEquals('03/02/2025', objPatEncBanData.encEndDate);
        System.assertEquals('Type code 001', objPatEncBanData.encType);
        System.assertEquals('vvvqqq', objPatEncBanData.height);
        System.assertEquals('Health1-00D630000009MZ7', objPatEncBanData.partnername);
        System.assertEquals('aaabbb', objPatEncBanData.weight);
        System.assertEquals('(Inch)', objPatEncBanData.heightUnit);
        System.assertEquals('(Ounces)', objPatEncBanData.weightUnit);
       
    }
    
    static testMethod void validategetproviderValues(){ 
        
        HealthCloudGA__EhrPractitioner__c practitioner=new HealthCloudGA__EhrPractitioner__c(NPI__c='abc',HealthCloudGA__SpecialtySystem__c='xyz');
        insert practitioner;
        
        test.startTest();
        List<HealthCloudGA__EhrPractitioner__c> lstEhrPat=PatientEncounterSummaryController.getproviderValues(practitioner.Id);
        System.assertEquals(lstEhrPat.size(), 1);
        test.stopTest();
        
        
    }
    
}