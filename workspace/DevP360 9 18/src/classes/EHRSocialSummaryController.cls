/**
	@Author      :	Cognizant Technology Solutions
	@name        :  EHRSocialSummaryController
	@CreateDate  :  23/01/2017
	@Description :  To fetch the Social History Object data based on patientId
	@Version     :  1.0
*/
public  class EHRSocialSummaryController {
    /**
	*  Description of the purpose of the class's method. 
	*  @name    :	findByPatientId
	*  @param   :	1. patientId	:	Captures the value for Patient Id
	*  @return  :	List of EhrSocialHistory records.
	*  @purpose :	To fetch the Social History Object data based on patientId.
	*/
    @AuraEnabled
    public static List<EHR_Social_History__c> findByPatientId(String patientId) {
    	return [SELECT id, Topic__c,Assessment__c,Source_System__c,name, Account__c,Assessment_Date__c,
                Frequency_of_Use__c, Substance__c, User__c
                FROM EHR_Social_History__c 
                WHERE Account__c = :patientId];
    }
}