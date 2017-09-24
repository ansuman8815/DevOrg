/**
    @Author      :   Cognizant Technology Solutions
    @name        :   IFHIRUtil
    @CreateDate  :   7/6/2017
    @Description : 
    @Version     :   1.0
*/
public interface IFHIRUtil {
    
    /**
	*  Description of the purpose of the class's method. 
	*  @name    : buildEndpoint
	*  @param   : 1. resource		:	Captures the value for resource name.
				  2. selectedId  	:	Captures the id for encounter.
				  3. startDate	 	:	Captures the value for startDate of Api call.
				  4. endDate        :	Captures the value for endDate of Api call.
				  5. empi	  		:	Captures the value for Patient's empi.	
				  6. src            :   Captures the Source System name.
	*  @return  : void
	*  @purpose : Interface has the Declaration of buildEndpoint method which generate's endpoint dynamically.
	*/
    String buildEndpoint(Source_System__c src, String resource, String empi, String selectedId, String startDate, String endDate);

}