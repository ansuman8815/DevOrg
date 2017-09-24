/**
	@Author      :	Cognizant Technology Solutions
	@name        :	IFHIRParser
	@CreateDate  :	7/13/2017 
	@Description :  This class parse the JSON response. 
	@Version     :	1.0
*/
public interface IFHIRParser {
    
    /**
	*  Description of the purpose of the class's method. 
	*  @name    : parseResponse
	*  @param   : 1. service		:	Captures the value for source system.
				  2. selectedId  	:	Captures the id for encounter.
				  3. response	 	:	Captures the value for response.
				  4. empi	  		:	Captures the value for Patient's empi.	
				  5. fqResults		:	Captures the error status details.	
				  6. sObjectData    :   Captures the List of sObjects.
	*  @return  : void
	*  @purpose : parseResponse method parses the Json Response based on ResponseParser class dynamically.
	*/
    void parseResponse(String service, String empi, String selectedId, String response,
                       FHIRQueryResults fqResults, List<SObject> sObjectData);
}