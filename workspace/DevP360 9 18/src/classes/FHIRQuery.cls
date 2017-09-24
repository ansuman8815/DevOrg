/**
    @Author      :   Cognizant Technology Solutions
    @name        :   FHIRQuery
    @CreateDate  :   07/06/2017
    @Description :   1.To get requested Resource Details by patient's EMPI.
                     2.To log the details of each API call in FHIRQuery__c Object.
    @Version     :   1.0
*/
public class FHIRQuery {
    
    /**
    *  Description of the purpose of the class's method. 
    *  @name    : getResourcesByPatient
    *  @param   : 1. startDate       :  Captures the value for start date of API call.
                  2. selectedId      :  Captures the value for encounter id.
                  3. resourceName    :  Captures the value for resourceName.
                  4. empi            :  Captures the value for Patient's empi.  
                  5. endDate         :  Captures the value for end date of the API call.                 
    *  @return  : String
    *  @purpose : This method checks to see if we should make an external call or not.
                  If it determines that we should, it calls the FHIRCalloutUtil class to make that call.
                  In any case, it logs the fact that a request was made.
    */
    public static String getResourcesByPatient(String resourceName, String empi, String selectedId, 
                                               String startDate, String endDate) {
        
        FHIRQueryResults results = new FHIRQueryResults();
        Boolean makeExternalCall = true;
        
        if (hasPatientResourceBeenQueriedToday(resourceName, empi, selectedId, startDate, endDate)) {
            makeExternalCall = false;
        }

        if (makeExternalCall)
        {
            FHIRCalloutUtil.queryActiveFHIRSources(resourceName, empi, selectedId, startDate, endDate, results);
        }
          else { 
        }
        
        logFHIRQuery(resourceName, empi, selectedId, startDate, endDate, makeExternalCall);
        if (results.errors.size() > 0) {
            results.operationSuccess = 'ERROR';
        } else {
            results.operationSuccess = 'OK';
        }
        
        String jsonResults = JSON.serialize(results);
        return jsonResults;
    }
    
    /**
    *  Description of the purpose of the class's method. 
    *  @name    : forceGetResourcesByPatient
    *  @param   : 1. startDate       :  Captures the value for start date of API call.
                  2. selectedId      :  Captures the value for encounter id.
                  3. resourceName    :  Captures the value for resourceName.
                  4. empi            :  Captures the value for Patient's empi.  
                  5. endDate         :  Captures the value for end date of the API call.                 
    *  @return  : String
    *  @purpose : This method doesn't check to see if we've already made this call today. 
                  It always makes the external call.  Use this method for repetitive testing.
    */
    public static String forceGetResourcesByPatient(String resourceName, String empi, String selectedId,
                                                    String startDate, String endDate) {
        
        FHIRQueryResults results = new FHIRQueryResults();
        FHIRCalloutUtil.queryActiveFHIRSources(resourceName, empi, selectedId, startDate, endDate, results);
        logFHIRQuery(resourceName, empi, selectedId, startDate, endDate, true);

        if (results.errors.size() > 0) {
            results.operationSuccess = 'ERROR';
        } else {
            results.operationSuccess = 'OK';
        }
        results.saveResults();
        
        String jsonResults = JSON.serialize(results);
        return jsonResults;
    } 
    
    /**
    *  Description of the purpose of the class's method. 
    *  @name    : newCallout
    *  @param   : 1. startDate       :  Captures the value for start date of API call.
                  2. selectedId      :  Captures the value for encounter id.
                  3. resourceName    :  Captures the value for resourceName.
                  4. empi            :  Captures the value for Patient's empi.  
                  5. endDate         :  Captures the value for end date of the API call.                 
    *  @return  : String
    *  @purpose : This method doesn't check to see if we've already made this call today. 
                  It always makes the external call.  Use this method for repetitive testing.
    */
    public static void newCallout(String resourceName, String empi, String selectedId, String startDate, String endDate) {
        
        FHIRQueryResults results = new FHIRQueryResults();
        FHIRCalloutUtil.queryActiveFHIRSources(resourceName, empi, selectedId, startDate, endDate, results);
        logFHIRQuery(resourceName, empi, selectedId, startDate, endDate, true);
        results.saveResults();
    } 
    
    /**
    *  Description of the purpose of the class's method. 
    *  @name    : hasPatientResourceBeenQueriedToday
    *  @param   : 1. startDate       :  Captures the value for start date of API call.
                  2. selectedId      :  Captures the value for encounter id.
                  3. resourceName    :  Captures the value for resourceName.
                  4. empi            :  Captures the value for Patient's empi.  
                  5. endDate         :  Captures the value for end date of the API call.                 
    *  @return  : Boolean
    *  @purpose : Get a list of the history of patient lookups for this resource,
                  because we don't want to make the same call more than once per day.
    */
    private static Boolean hasPatientResourceBeenQueriedToday(String resourceName, String empi,
                                                              String selectedId, String startDate, String endDate) {
        String finalQuery = 'SELECT CreatedDate, External_Call__c FROM FHIRQuery__c ';
        String whereClause = ' WHERE EMPI__c = \'' +  empi + ' \' AND Resource_Name__c = \'' + resourceName + '\' AND External_Call__c = true ';
        if(String.isNotBlank(selectedId))
            whereClause = whereClause + ' AND Selected_Id__c = \'' + selectedId + '\'';
        if(String.isNotBlank(startDate))
            whereClause = whereClause + ' AND Start_Date__c = \' ' + startDate + '\'';
        if(String.isNotBlank(endDate))    
            whereClause = whereClause + ' AND End_Date__c = \'' + endDate + '\'';
        String orderByClause = ' ORDER BY CreatedDate DESC ';
        
        finalQuery = finalQuery + whereClause + orderByClause ;
        system.debug('--finalQuery--'+finalQuery);
        List<FHIRQuery__c> fhirQueries = Database.query(finalQuery);
        
        if (fhirQueries.size() > 0) {
            if (fhirQueries[0].CreatedDate.isSameDay(DateTime.now())) {
                if (fhirQueries[0].External_Call__c == true) {
                    return true;
                }
            }
        }
        return false;
    }
    
    /**
    *  Description of the purpose of the class's method. 
    *  @name    : logFHIRQuery
    *  @param   : 1. startDate       :  Captures the value for start date of API call.
                  2. selectedId      :  Captures the value for encounter id.
                  3. resourceName    :  Captures the value for resourceName.
                  4. empi            :  Captures the value for Patient's empi.  
                  5. endDate         :  Captures the value for end date of the API call.
                  6. makeExternalCall:  Captures the boolean value for making API calls.
    *  @return  : String
    *  @purpose : This method insert a new log entry:
    */
    private static void logFHIRQuery(String resourceName, String empi, String selectedId, String startDate,
                                     String endDate, Boolean makeExternalCall) {
                
        FHIRQuery__c fhirQ = new FHIRQuery__c();
        fhirQ.User__c = System.UserInfo.getUserId();
        fhirQ.UserName__c = System.UserInfo.getUserName();
        fhirQ.User_Name__c = System.UserInfo.getName();
        fhirQ.Resource_Name__c = resourceName;
        fhirQ.EMPI__c = empi;
        fhirQ.Start_Date__c = startDate;
        fhirQ.End_Date__c = endDate;
        fhirQ.External_Call__c = makeExternalCall;
        fhirQ.Selected_Id__c = selectedId;
        insert fhirQ;
    }
}