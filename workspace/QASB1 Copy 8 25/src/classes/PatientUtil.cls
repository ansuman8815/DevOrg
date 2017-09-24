public class PatientUtil {
    
    public static List<Account> getRelatedAccounts(Id acctId) {
        // Return the list of accounts that are related by EMPI to the provided account
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

}