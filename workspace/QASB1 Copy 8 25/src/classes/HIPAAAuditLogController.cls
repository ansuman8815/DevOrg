public class HIPAAAuditLogController {
    
    @AuraEnabled
    public static Boolean logAccess(String empi, String hc_DataComponent) {
    //public Static Boolean logAccess(Id acctId, String hc_DataComponent) {
        
        List<Account> accts = PatientUtil.getRelatedAccountsByEMPI(empi);
        List<HIPAA_Audit_Log__c> newLogEntries = new List<HIPAA_Audit_Log__c>();
        
        for (Account patient : accts) {
        
        	// get patient details.  Storing the Acct ID in the HIPAA log isn't sufficient
        	//   because patients can be deleted.
        	//Account patient = [SELECT Name, First_Name__c, Middle_Name__c, Last_Name__c, HealthCloudGA__MedicalRecordNumber__c, EMPI__c, Medicaid_CIN__c, Date_of_Birth__c, HealthCloudGA__SourceSystem__c FROM Account WHERE Id = :acctId][0];
        
        	HIPAA_Audit_Log__c logEntry = new HIPAA_Audit_Log__c();
        	logEntry.Account__c = patient.Id;
        	logEntry.Date_of_Birth__c = patient.Date_of_Birth__c;
        	logEntry.HealthCare_Data_Component__c = hc_DataComponent;
        	logEntry.Medicaid_CIN__c = patient.Medicaid_CIN__c;
        	logEntry.Patient_EMPI__c = empi;
        	logEntry.Patient_Name__c = patient.Name;
        	logEntry.Patient_MRN__c = patient.HealthCloudGA__MedicalRecordNumber__c;
        	logEntry.Source_System__c = patient.HealthCloudGA__SourceSystem__c;
        	logEntry.User__c = System.UserInfo.getUserId();
        	logEntry.User_Email__c = System.UserInfo.getUserEmail();
        	logEntry.UserName__c = System.UserInfo.getUserName();
        	logEntry.User_Name__c = System.UserInfo.getName();
            
            newLogEntries.add(logEntry);
        }
        
        insert newLogEntries;
            
            
        return true;
    }

}