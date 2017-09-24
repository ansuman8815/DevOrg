/**
	@Author      :   Cognizant Technology Solutions
	@name        :   HIPAAAuditLogController
	@CreateDate  :   4/12/2017
	@Description :   When User access the patients data then log of the patient detail is created at that time,using this class.  
	@Version     :   1.0
*/
public class HIPAAAuditLogController {
    
    /**
	*  Description of the purpose of the class's method. 
	*  @name    :	logAccess
	*  @param   :	1. empi				:	Captures the value for EMPI of the Patient.
				  	2. hc_DataComponent	:	Captures the value of Data domain currently accessed by the logged in user.
	*  @return  : 	newLogEntries[New log of the patient is created whose data is accessed by the user]
	*  @purpose : 	When User access the patients data then log of the patient detail is created at that time,using this class.  
	*/
    @AuraEnabled
    public static Boolean logAccess(String empi, String hc_DataComponent) {
        //public Static Boolean logAccess(Id acctId, String hc_DataComponent) {
        
        List<Account> accts = PatientUtil.getRelatedAccountsByEMPI(empi);
        List<HIPAA_Audit_Log__c> newLogEntries = new List<HIPAA_Audit_Log__c>();
        
        for (Account patient : accts) {
            
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