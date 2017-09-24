/**
    @Author      :   Cognizant Technology Solutions
    @name        :   FHIRQueryResults
    @CreateDate  :   7/13/2017
    @Description :   To capture the service,type,status & message returned by API response. 	
    @Version     :   1.0
*/

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
    
    /**
	*  Description of the purpose of the class's method. 
	*  @name    : FHIRQueryResults
	*  @purpose : Creates the object of Error class.
	*/
    public FHIRQueryResults() {
        errors = new List<Error>();
    }
    
    /**
	*  Description of the purpose of the class's method. 
	*  @name    : addError
	*  @param   : 1. eSvc 		:	Captures the service of the error.
				  2. eType  	:	Captures the type of error.
				  3. eStatus	:	Captures the Status of the error.
				  4. eMessage	:	Captures the message of the error.	
	*  @return  : void
	*  @purpose : This method defines the error.
	*/
    public void addError(String eSvc, String eType, String eStatus, String eMessage) {
        Error err = new Error();
        err.service = eSvc;
        err.type = eType;
        err.status = eStatus;
        err.message = eMessage;
        errors.add(err);
        
        if (null == fhirResults) {
            fhirResults = new List<FHIRQueryResult__c>();
        }
        FHIRQueryResult__c result = new FHIRQueryResult__c();
        result.Service__c = eSvc;
        result.ResultType__c = eType;
        result.Status__c = eStatus;
        result.ResultMessage__c = eMessage;
        result.ResultTimestamp__c = DateTime.now();
        fhirResults.add(result);
    }
    
    /**
	*  Description of the purpose of the class's method. 
	*  @name    : saveResults
	*  @return  : void
	*  @purpose : This method saves the results.
	*/
    public void saveResults() {
        if (fhirResults != null && fhirResults.size() > 0) {
            insert fhirResults;
        }
    }
}