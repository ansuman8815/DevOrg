public class FHIRQueryResults {

    private List<FHIRQueryResult__c> fhirResults;
    
    public class Error {
        public String service;
        public String type;
        public String status;
        public String message;  
    }
    
    public String operationSuccess {get;set;}
    public List<Error> errors; 
    public Boolean heapSizeExceeded = false;
    
    public FHIRQueryResults() {
        errors = new List<Error>();
        // default is no errors
        operationSuccess = 'OK';
    }
    
    public void addError(String eSvc, String eType, String eStatus, String eMessage) {
        Error err = new Error();
        err.service = eSvc;
        err.type = eType;
        err.status = eStatus;
        err.message = eMessage;
        errors.add(err);
        
        // We're adding what appears to be an error.  Unless the type is marked as 'TEST':
        if (eType != 'TEST') {
            operationSuccess = 'ERROR';
        }
        
        if (null == fhirResults) {
            fhirResults = new List<FHIRQueryResult__c>();
        }
        FHIRQueryResult__c result = new FHIRQueryResult__c();
        result.Service__c = eSvc;
        result.ResultType__c = eType;
        result.Status__c = eStatus;
        result.ResultMessage__c = eMessage;
        result.ResultTimestamp__c = DateTime.now();
        result.User__c = UserInfo.getName();
        result.UserName__c = UserInfo.getUserName();
        fhirResults.add(result);
        
        if (null != eMessage && eMessage.containsIgnoreCase('Exceeded max size limit')) {
            heapSizeExceeded = true;
        }
        
    }
    
    public void saveResults() {
        if (null != fhirResults) {
       		if (fhirResults.size() > 0) {
            	insert fhirResults;
        	}
        }
    }

}