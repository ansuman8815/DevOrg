public interface IFHIRParser {

    void parseResponse(String service, String empi, String response, FHIRQueryResults fqResults, List<HealthCloudGA__EhrObservation__c> observations);
    
    //void parseResponse(String service, Id accountId, HttpResponse response, FHIRQueryResults fqResults, List<HealthCloudGA__EhrObservation__c> observations);
   
}