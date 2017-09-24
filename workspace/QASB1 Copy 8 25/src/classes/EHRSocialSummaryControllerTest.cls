@isTest 
public class EHRSocialSummaryControllerTest {
    
    static testMethod void validategetfindByPatientId() {
        
        String strRecordTypeId = [Select Id From RecordType Where SobjectType = 'Account' and Name = 'Individual'].Id;
        Account ac = new Account(RecordTypeId = strRecordTypeId, Name='James', First_Name__c='James', Last_Name__c = 'Franklin', GenderLabel__c = 'M', Date_of_Birth__c = Date.newInstance(1975,12,10), Medicaid_CIN__c = '468927');
        insert ac;
        
        EHR_Social_History__c objShst = new EHR_Social_History__c( Account__c=ac.Id ,Assessment_Date__c = '1985/12/10', Frequency_of_Use__c = 'Occasionaly', Substance__c = '', User__c = 'No');
        Insert objShst;
                
        List<EHR_Social_History__c> lstShst = EHRSocialSummaryController.findByPatientId(ac.Id);
        System.assertEquals(lstShst[0].Assessment_Date__c, '1985/12/10');
        System.assertEquals(lstShst[0].Frequency_of_Use__c, 'Occasionaly');
        System.assertEquals(lstShst[0].Substance__c, null);
        System.assertEquals(lstShst[0].User__c, 'No');
        //system.debug(lstShst);
    }

}