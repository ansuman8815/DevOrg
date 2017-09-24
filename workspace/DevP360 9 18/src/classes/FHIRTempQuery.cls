public class FHIRTempQuery {

    public static void getSources() {
    	List<Patient_Source_System__c> ehrSources = [SELECT FHIR_Source_System__r.Id, FHIR_Source_System__r.Name, FHIR_Source_System__r.FHIR_URL__c, FHIR_Source_System__r.Response_Type__c, Source_System_Id__c, FHIR_Source_System__r.Accept_Type__c FROM Patient_Source_System__c];

        for (Patient_Source_System__c srcSys : ehrSources) {
            System.debug('Source System Name ' + srcSys.FHIR_Source_System__r.Name);
        }
    
    }
}