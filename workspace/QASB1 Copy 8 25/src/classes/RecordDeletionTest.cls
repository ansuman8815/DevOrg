@isTest (SeeAllData=false)
public class RecordDeletionTest {
    static testMethod void deletionTest(){   
        String type='Lab Result';
        String typeParam = '\'' + type + '\'';
        String strwhereclause   = 'Type__c =  ' + typeParam;
        String strwhereclause1='HealthCloudGA__ValuePeriodStartDate__c< LAST_N_DAYS:365'+' ' +'AND'+' ' +strwhereclause;
        
        ConsentModel__c consentModelSetting = new ConsentModel__c(Name='12',Object__c='HealthCloudGA__EhrObservation__c',deletionWhereClause__c=strwhereclause1);
        insert  consentModelSetting ; 
        
        List<HealthCloudGA__EhrObservation__c> lstObservation = new List<HealthCloudGA__EhrObservation__c>();
        for(Integer i=0 ;i <3;i++){
            HealthCloudGA__EhrObservation__c observation;
            observation = new HealthCloudGA__EhrObservation__c(HealthCloudGA__ValuePeriodStartDate__c= Date.newInstance(1975,12,10),Type__c='Lab Result');
            lstObservation.add(observation);
        }
        insert lstObservation;
        
        Test.startTest();
        RecordDeletion deletionObj = new RecordDeletion('12',false);
        DataBase.executeBatch(deletionObj);
        RecordDeletion deletionObject = new RecordDeletion('12',true);
        DataBase.executeBatch(deletionObject);
        List<HealthCloudGA__EhrObservation__c> lstobs = [SELECT Name FROM HealthCloudGA__EhrObservation__c];
        System.AssertEquals(lstObservation.size(),lstobs.size());
        Test.stopTest();        
    }
}