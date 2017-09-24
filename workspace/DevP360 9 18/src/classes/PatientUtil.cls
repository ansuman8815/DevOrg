/**
	@Author      :	Cognizant Technology Solutions
	@name        :	PatientUtil
	@CreateDate  :	8/31/2017  
	@Description :  Return the list of the patients related by empi.
	@Version     :	1.0
*/
public class PatientUtil {
    
    /**
	*  Description of the purpose of the class's method. 
	*  @name    : getRelatedAccounts
	*  @param   : 1. acctId  		 :	Captures the value for account id.
	*  @return  : List<Account>
	*  @purpose : Return the list of accounts that are related by EMPI to the provided account
	*/
    public static List<Account> getRelatedAccounts(Id acctId) {
        List<Account> theAcct = [SELECT EMPI__c FROM Account WHERE Id = :acctId];
        if (null != theAcct) {
            if (theAcct.size() > 0) {
                String empi = theAcct[0].EMPI__c;
                return (List<Account>) [SELECT Id, EMPI__c, HealthCloudGA__MedicalRecordNumber__c, HealthCloudGA__SourceSystem__c, HealthCloudGA__SourceSystemId__c, Name, Medicaid_CIN__c, Date_of_Birth__c FROM Account WHERE EMPI__c = :empi];
            }
        }
        return (List<Account>) null;
    }
    
    public static List<Account> getRelatedAccountsByEMPI(String empi) {
        return (List<Account>) [SELECT Id, HealthCloudGA__MedicalRecordNumber__c, HealthCloudGA__SourceSystem__c, Date_of_Birth__c, Medicaid_CIN__c, Name FROM Account WHERE EMPI__c = :empi];
    }
     public static List<HealthCloudGA__EhrEncounter__c> getEncounterByEncID(String encounterId) {
        return (List<HealthCloudGA__EhrEncounter__c>) [SELECT Id, Encounter_ID__c, HealthCloudGA__SourceSystem__c FROM HealthCloudGA__EhrEncounter__c WHERE Id = :encounterId];
    }
    
}