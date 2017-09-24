public class MulesoftFHIRUtil implements IFHIRUtil {
    
    public static String buildEndpoint (Source_System__c src, String resource, String empi, String startDate, String endDate) {
        
        // Looking to build something like this:
        // https://apigateway-dev.mountsinai.org/fhir/Observation/?category=laboratory&patient=987654&client_id=1234&client_secret=5678'
        
        String url = src.FHIR_URL__c;
        //List<Account> patient = [SELECT EMPI__c,HealthCloudGA__MedicalRecordNumber__c FROM Account WHERE Id = :acctId LIMIT 1];
        //String patientId = patient[0].EMPI__c;
        
        //url += patientId;
        url += empi;
        
        // add start date, if present
        if (startDate != null && startDate.length() > 0) {
            url += '&startDate=' + startDate;
        }
        
        // add end date, if present
        if (endDate != null && endDate.length() > 0) {
            url += '&endDate=' + endDate;
        }
        
        // add client id and secret, if required
        if (src.Use_Client_ID_and_Secret__c) {
            url += '&client_id=' + src.URL_Client_ID__c + '&client_secret=' + src.URL_Client_Secret__c;
        }
        
        return url;
    }

}