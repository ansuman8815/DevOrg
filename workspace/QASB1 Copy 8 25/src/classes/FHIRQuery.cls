public class FHIRQuery {
    
    public static String getResourcesByPatient(String resourceName, String empi, String startDate, String endDate) {
        
        // This method checks to see if we should make an external call or not.  If it determines
        // that we should, it calls the FHIRQueryUtil class to make that call.
        // In any case, it logs the fact that a request was made.
        
        FHIRQueryResults results = new FHIRQueryResults();
		Boolean makeExternalCall = true;
        
        // Returns true if we've already requested this data today (based on 
        // patient ID, resource, and the number of months)
        if (hasPatientResourceBeenQueriedToday(resourceName, empi, startDate, endDate)) {
            makeExternalCall = false;
        }

        if (makeExternalCall) {
            // Make the external call.
            System.debug('Making external call');
            FHIRCalloutUtil.queryActiveFHIRSources(resourceName, empi, startDate, endDate, results);
        } else { 
            System.debug('No external call');
        }
        
        // Log new FHIR Query.  Placing this after the potential callout because
        // we can't have uncommitted transactions when we make a callout.
        logFHIRQuery(resourceName, empi, startDate, endDate, makeExternalCall);
        
        // The results variable now potentially holds a list of errors.  We need to set 
        // the top-level results and then return it as JSON.
        if (results.errors.size() > 0) {
            results.operationSuccess = 'ERROR';
        } else {
            results.operationSuccess = 'OK';
        }
        
        String jsonResults = JSON.serialize(results);
        return jsonResults;
        
    }
    
    public static String forceGetResourcesByPatient(String resourceName, String empi, String startDate, String endDate) {
        
        FHIRQueryResults results = new FHIRQueryResults();
        // This method doesn't check to see if we've already made this call today. 
        // It always makes the external call.  Use this method for repetitive testing.
        FHIRCalloutUtil.queryActiveFHIRSources(resourceName, empi, startDate, endDate, results);
        logFHIRQuery(resourceName, empi, startDate, endDate, true);
                // The results variable now potentially holds a list of errors.  We need to set 
        // the top-level results and then return it as JSON.
        if (results.errors.size() > 0) {
            results.operationSuccess = 'ERROR';
        } else {
            results.operationSuccess = 'OK';
        }
        System.debug(results.operationSuccess);
        results.saveResults();
        
        String jsonResults = JSON.serialize(results);
        return jsonResults;
        
    }
    
    public static void newCallout(String resourceName, String empi, String startDate, String endDate) {
        
        FHIRQueryResults results = new FHIRQueryResults();
        // This method doesn't check to see if we've already made this call today. 
        // It always makes the external call.  Use this method for repetitive testing.
        FHIRCalloutUtil.queryActiveFHIRSources(resourceName, empi, startDate, endDate, results);
        logFHIRQuery(resourceName, empi, startDate, endDate, true);
        results.saveResults();
    }
    
    private static Boolean hasPatientResourceBeenQueriedToday(String resourceName, String empi, String startDate, String endDate) {
        
        // Get a list of the history of patient lookups for this resource,
        //  because we don't want to make the same call more than once per day.
        List<FHIRQuery__c> fhirQueries = [SELECT CreatedDate, External_Call__c FROM FHIRQuery__c WHERE EMPI__c = :empi AND Resource_Name__c = :resourceName AND Start_Date__c = :startDate AND End_Date__c = :endDate AND External_Call__c = true ORDER BY CreatedDate DESC];
        
        if (fhirQueries.size() > 0) {
            // Don't make the external call if it has already been called today:
            if (fhirQueries[0].CreatedDate.isSameDay(DateTime.now())) {
                if (fhirQueries[0].External_Call__c == true) {
	                return true;
                }
            }
        }
        return false;
    }
    
    private static void logFHIRQuery(String resourceName, String empi, String startDate, String endDate, Boolean makeExternalCall) {
                
        // Insert a new log entry:
        FHIRQuery__c fhirQ = new FHIRQuery__c();
        fhirQ.User__c = System.UserInfo.getUserId();
        fhirQ.UserName__c = System.UserInfo.getUserName();
        fhirQ.User_Name__c = System.UserInfo.getName();
        fhirQ.Resource_Name__c = resourceName;
        fhirQ.EMPI__c = empi;
        fhirQ.Start_Date__c = startDate;
        fhirQ.End_Date__c = endDate;
        fhirQ.External_Call__c = makeExternalCall;
        insert fhirQ;
        
    }

}