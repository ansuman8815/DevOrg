public class MulesoftFHIRUtil implements IFHIRUtil {
    
    /**
	*  Description of the purpose of the class's method. 
	*  @name    : buildEndpoint
	*  @param   : 1. resource		:	Captures the value for resource name.
				  2. selectedId  	:	Captures the id for encounter.
				  3. startDate	 	:	Captures the value for startDate of Api call.
				  4. endDate        :	Captures the value for endDate of Api call.
				  5. empi	  		:	Captures the value for Patient's empi.	
				  6. fqResults		:	Captures the error status details.	
				  7. src            :   Captures the Source System name.
	*  @return  : String
	*  @purpose : This methods builds the endPoint for the API calls.
	*/
    public static String buildEndpoint (Source_System__c src, String resource, String empi, String selectedId,
                                        String startDate, String endDate)
    {
        
        // Looking to build something like this:
        // https://apigateway-dev.mountsinai.org/fhir/Observation/?category=laboratory&patient=987654&client_id=1234&client_secret=5678'
        
        String url = src.FHIR_URL__c;
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
        system.debug('selectedId :: ' + selectedId);
        //add selectedId to the URL, if present
        if (String.isNotBlank(selectedId)) {
            List<HealthCloudGA__EhrEncounter__c> lstEncounter = [SELECT Encounter_ID__c FROM HealthCloudGA__EhrEncounter__c WHERE Id = :selectedId];
            if(!lstEncounter.isEmpty())
                url += '&encounterid=' + lstEncounter[0].Encounter_ID__c;
        }
        
        
        return url;
    }
}