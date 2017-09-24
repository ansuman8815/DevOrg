/**
	@Author      :	Cognizant Technology Solutions
	@name        :	ProfileMenuControllerTest
	@CreateDate  :	16/03/2017
	@Description :  Test class for Population Controller class
	@Version     :	1.0
*/
@isTest(SeeAllData = false)
private class PopulationControllerTest {
    
    static testMethod void validategetPatientPopulationData() {
      
        String strRecordTypeId = [Select Id From RecordType Where SobjectType = 'Account' and Name = 'Individual'].Id;             
              
        Account ac;
        ac = new Account(RecordTypeId = strRecordTypeId, Name='James', First_Name__c='James', Last_Name__c = 'Franklin', Middle_Name__c = 'Rhodes', GenderLabel__c = 'M', Date_of_Birth__c = Date.newInstance(1975,12,10), Medicaid_CIN__c = '468927');
        
        Performance_Metric__c objpm ;
        objpm = new Performance_Metric__c(Measurement_Year_Start_Date__c = Date.newInstance(2010,01,15), Measurement_Year_End_Date__c = Date.newInstance(2025,01,14), Data_Refresh_Date__c = Date.newInstance(2017,03,15));
        insert objpm;
        
        test.startTest();
        PopulationController.PatientPopulationData objppd;
        objppd = PopulationController.getPatientPopulationData(ac.id);
        test.stopTest(); 
        
        System.assertEquals('03/15/2017', objppd.DataRefDate);
        System.assertEquals('01/14/2025', objppd.MesYrEndDate);
        System.assertEquals('01/15/2010', objppd.MesYrStartDate);
               
      
    }

}