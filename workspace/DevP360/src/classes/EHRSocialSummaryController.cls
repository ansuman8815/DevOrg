public with sharing class EHRSocialSummaryController {
    
    @AuraEnabled
    public static List<EHR_Social_History__c> findByPatientId(String patientId) {
        return [SELECT id, Topic__c,Assessment__c,Source_System__c,name, Account__c, Assessment_Date__c, 
                Frequency_of_Use__c, Substance__c, User__c
                FROM EHR_Social_History__c 
                WHERE Account__c = :patientId];
    }
}