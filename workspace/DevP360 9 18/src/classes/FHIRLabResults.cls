public class FHIRLabResults {
    public static void getResultsById() {
        XmlStreamReader xmlResults;
        List<KC_FHIR__c> results = [SELECT FHIR_Response__c FROM KC_FHIR__c WHERE Id = 'a183B000000MezkQAC'];
 
        if (results.size() > 0) {
            xmlResults = new XmlStreamReader(results[0].FHIR_Response__c);
            FHIRLabResultsParserUtil.parseResultsXml(xmlResults);
        }
        else {
            System.debug('Got no results');
        }
    }
    public static void getJSONResults() {
        List<KC_FHIR__c> results = [SELECT FHIR_Response__c FROM KC_FHIR__c WHERE Id = 'a183B000000MfHnQAK'];
        
        if (results.size() > 0) {
            JSONParser parser = JSON.createParser(results[0].FHIR_Response__c);
            FHIRLabResultsJSONParserUtil.parseResults(parser);
        }
        else {
            System.debug('Got no results');
        }
    }
}