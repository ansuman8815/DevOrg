/**
    @Author      :   Cognizant Technology Solutions
    @name        :   FHIRCalloutUtil
    @CreateDate  :   08/31/2017
    @Description :   To make the HTTP Callout & Parse the response.
    @Version     :   1.0
*/

public class FHIRCalloutUtil {
    
    /**
	*  Description of the purpose of the class's method. 
	*  @name    : queryActiveFHIRSources
	*  @param   : 1. resource		:	Captures the value for resource name.
				  2. selectedId  	:	Captures the id for encounter.
				  3. startDate	 	:	Captures the value for startDate of Api call.
				  4. endDate        :	Captures the value for endDate of Api call.
				  5. empi	  		:	Captures the value for Patient's empi.	
				  6. fqResults		:	Captures the error status details.	
	*  @return  : void
	*  @purpose : Get the detail of active sourceSystem's &  call getFHIRResponse method to make API call.
	*/
    public static void queryActiveFHIRSources(String resource, String empi, String selectedId, String startDate,
                                              String endDate, FHIRQueryResults fqResults) {
   
        List<FHIR_Callout__c> fhirResponses = new List<FHIR_Callout__c>();
        String externalIdVal = '';
        //List<HealthCloudGA__EhrObservation__c> observations = new List<HealthCloudGA__EhrObservation__c>();
        List<sObject> sObjectData = new List<sObject>();
        List<Source_System__c> sources = [SELECT Name__c, FHIR_URL__c, Accept_Type__c, Response_Parser_Class__c,
                                          Endpoint_Generator_Class__c, Use_Client_ID_and_Secret__c,
                                          Use_HTTP_Basic_Auth__c, URL_Client_ID__c, URL_Client_Secret__c,
                                          HTTP_Auth_UserName__c, HTTP_Auth_Password__c, External_Id__c FROM Source_System__c
                                          WHERE FHIR_Resource_Name__c = :resource AND Active__c = true];
        if(!sources.isEmpty())
            externalIdVal = sources[0].External_Id__c;
        // The getFHIRResponse call could generate a couple of different Exceptions:
        // System.CalloutException
        // System.Limit Exception (Heap Size, CPU Time, etc.)
        // CPUTimeException
        
        Boolean heapSizeProblem = false;
        Boolean cpuTimeProblem = false;
        try {
        	getFHIRResponse(resource, empi, selectedId, sources, startDate, endDate, fqResults, sObjectData, fhirResponses);
        } 
        catch (Exception e) {
            String exceptionType = e.getTypeName();
            
            if (e.getMessage().containsIgnoreCase('Exceeded max size limit')) {
                heapSizeProblem = true;
            }
        }
        
        Integer limitTime = Limits.getLimitCpuTime();
        Integer cpuTime = Limits.getCpuTime();
        Integer remainingTime = limitTime - cpuTime;
        
        if (remainingTime > 4000 && heapSizeProblem) {
            
            if ((Limits.getLimitCpuTime() - Limits.getCpuTime()) > 4000) {
            
            	String strOrigEndDate = endDate;
            	Date origStartDate = StringUtil.getDateFromDDMMYYYY(startDate);
            	Date origEndDate = StringUtil.getDateFromDDMMYYYY(endDate);
            	Integer origMonths = origStartDate.monthsBetween(origEndDate);
            	Integer months = origMonths / 3;
            
            	String strStartDate;
            	String strEndDate;
            
            	Date newEndDate = origStartDate.addMonths(months);
            	strEndDate = StringUtil.getStrFromDate(newEndDate);
            	try {
                    
               		getFHIRResponse(resource, empi, selectedId, sources, startDate, strEndDate, fqResults, sObjectData, fhirResponses);
            	} 
                catch (Exception e1) {
            	}
                
        		limitTime = Limits.getLimitCpuTime();
        		cpuTime = Limits.getCpuTime();
        		remainingTime = limitTime - cpuTime;
                
                if (remainingTime > 4000) {

            		origStartDate = newEndDate.addDays(1);
            		newEndDate = origStartDate.addMonths(months);
            		strStartDate = StringUtil.getStrFromDate(origStartDate);
            		strEndDate = StringUtil.getStrFromDate(newEndDate);
            		try {
                        
               			getFHIRResponse(resource, empi, selectedId, sources, strStartDate, strEndDate, fqResults, sObjectData, fhirResponses);
            		} 
                    catch (Exception e2)
                    {
            		}

        			limitTime = Limits.getLimitCpuTime();
        			cpuTime = Limits.getCpuTime();
        			remainingTime = limitTime - cpuTime;
                
                	if (remainingTime > 4000) {
            			origStartDate = newEndDate.addDays(1);
            			newEndDate = origStartDate.addMonths(months);
            			strStartDate = StringUtil.getStrFromDate(origStartDate);
            			strEndDate = StringUtil.getStrFromDate(newEndDate);
            	
            			try 
                        {
               				getFHIRResponse(resource, empi, selectedId, sources, strStartDate, strEndDate, fqResults, sObjectData, fhirResponses);
            			} 
                        catch (Exception e3) 
                        {
            			}
                	}
                }
        	}
        }
        system.debug('sObjectData :::::::: ' + sObjectData);
        
        if (!sObjectData.isEmpty() && sObjectData.size() < 9950) {
            // Can only insert 10,000 max, and we want to leave room for the 
            // fhirResponses and fhirQueryResults inserts.
            
        	try {
        	    Schema.SObjectType sObjectType = sObjectData[0].getSObjectType();
                system.debug('sObjectType :: ' + sObjectType);
                String listType = 'List<' + sObjectType + '>';
                List<SObject> castRecords = (List<SObject>)Type.forName(listType).newInstance();
                castRecords.addAll(sObjectData);
        	    Map<String, Schema.SObjectField> fieldMap = Schema.getGlobalDescribe().get(String.valueOf(sObjectType)).getDescribe().fields.getMap();
                system.debug('fieldMap :: ' + fieldMap);
                system.debug('externalIdVal :: ' + externalIdVal);
                Schema.SObjectField schemaField = fieldMap.get( externalIdVal );
                system.debug('castRecords :: ' + schemaField);
                system.debug('schemaField :: ' + schemaField);
                Database.upsert(castRecords, schemaField);
        	} 
        	catch (DmlException e) {
                system.debug('exception  :: ' + e);
            	fqResults.addError('', 'DML', 'ERROR', e.getMessage());
        	}           
        }
        system.debug('sObjectData :::::::: ' + sObjectData);                                           
        insert fhirResponses;
    }
    
    
    /**
	*  Description of the purpose of the class's method. 
	*  @name    : getFHIRResponse
	*  @param   : 1. resource		:	Captures the value for resource name.
				  2. selectedId  	:	Captures the id for encounter.
				  3. startDate	 	:	Captures the value for startDate of Api call.
				  4. endDate        :	Captures the value for endDate of Api call.
				  5. empi	  		:	Captures the value for Patient's empi.	
				  6. fqResults		:	Captures the error status details.	
				  7. sources        :   Captures the list of the source systems.
	*  @return  : void
	*  @purpose : Makes Http request,gets Http response and calls parseResponse method to parse the json response.
	*/
    public static void getFHIRResponse(String resource, String empi, String selectedId, List<Source_System__c> sources,
                                        String startDate, String endDate, FHIRQueryResults fqResults,
                                        List<sObject> sObjectData, 
                                        List<FHIR_Callout__c> fhirResponses) {
        
        Http httpProtocol = new Http();
        HttpRequest req = new HttpRequest();
        
        for (Integer i=0; i<sources.size(); i++) {
            
			HttpResponse res;
            
            // Build the endpoint based on the class provided in Source_System__c.Endpoint_Generator_Class__c:
            Type fhirUtilImpl = Type.forName(sources[i].Endpoint_Generator_Class__c);
            IFHIRUtil fhirUtil = (IFHIRUtil)fhirUtilImpl.newInstance();
            String endpoint = fhirUtil.buildEndpoint(sources[i], resource, empi, selectedId, startDate, endDate); 
            req.setEndpoint(endPoint); 
            System.debug('EndPoint '+endpoint);

            // Finish building the HttpRequest object:
            req.setMethod('GET');
            req.setTimeout(120000);
            if (sources[i].Accept_Type__c != null) {
            	req.setHeader('Accept', sources[i].Accept_Type__c);
            }
            
            // Add HTTP Basic Authentication, if required:
            if (sources[i].Use_HTTP_Basic_Auth__c) {
            	Blob headerVal = Blob.valueOf(sources[i].HTTP_Auth_UserName__c + ':' + sources[i].HTTP_Auth_Password__c);
            	String authHdr = 'Basic ' + EncodingUtil.base64Encode(headerVal);
            	req.setHeader('Authorization', authHdr);
            }
            
            // Get the timestamp immediately before the send:
            Long sentTime = DateTime.now().getTime();
            Long recTime;
            FHIR_Callout__c fhirResponse;
            Integer httpStatusCode;
            String httpStatus;
            
            try {
                
            	//fqResults.addError(sources[i].Name__c, 'TEST', 'HEAP before send', String.valueOf(Limits.getHeapSize()));
                res = httpProtocol.send(req);
                recTime = DateTime.now().getTime();
                httpStatusCode = res.getStatusCode();
                httpStatus = res.getStatus();
            	//fqResults.addError(sources[i].Name__c, 'TEST', 'HEAP after send', String.valueOf(Limits.getHeapSize()));
                // Add a new error message if it was not successful:
                if (httpStatusCode != 200 ) {
                	fhirResponse = new FHIR_Callout__c(Endpoint__c = endPoint, Parsing_Time__c = 0, Rows_Returned__c = 0, Bytes_Returned__c = 0, Response_Time__c = recTime-sentTime, HTTP_Status__c = httpStatus, HTTP_Status_Code__c = httpStatusCode, User__c = UserInfo.getUserName(), UserName__c = UserInfo.getName());
                }
                else {

                    Long startParse = DateTime.now().getTime();
                    Long endParse;
                    String json = res.getBody();
                    //System.debug('Json Response '+json);
                    res = null;
                    Integer jsonLen = json.length();
            		//fqResults.addError(sources[i].Name__c, 'TEST', 'HEAP after FHRICalloutUtil res cleanup', String.valueOf(Limits.getHeapSize()));
                    
                    System.debug('Response_Parser_Class__c : '+sources[i].Response_Parser_Class__c);
                    System.debug('sources[i].Name__c : '+sources[i].Name__c);
                    System.debug('empi : '+empi);
                    System.debug('selectedId : '+selectedId);
                    System.debug('Response_Parser_Class__c : '+sources[i].Response_Parser_Class__c);
                    
                    Type fhirParserImpl = Type.forName(sources[i].Response_Parser_Class__c);
                    IFHIRParser fhirParser = (IFHIRParser)fhirParserImpl.newInstance();
                	fhirParser.parseResponse(sources[i].Name__c, empi, selectedId, json, fqResults, sObjectData);
                    
                    endParse = DateTime.now().getTime();
                
            		//fqResults.addError(sources[i].Name__c, 'TEST', 'HEAP after return from parseJSON', String.valueOf(Limits.getHeapSize()));
                    json = null;
            		//fqResults.addError(sources[i].Name__c, 'TEST', 'HEAP after json cleanup', String.valueOf(Limits.getHeapSize()));
                    
            		if (null == endParse) {
            			endParse = 0;
            		}
            		fhirResponse = new FHIR_Callout__c(Endpoint__c = endPoint, Parsing_Time__c = endParse - startParse, Rows_Returned__c = sObjectData.size(), Bytes_Returned__c = jsonLen, Response_Time__c = recTime-sentTime, HTTP_Status_Code__c = httpStatusCode, HTTP_Status__c = httpStatus, User__c = UserInfo.getUserName(), UserName__c = UserInfo.getName());
                }
                fhirResponses.add(fhirResponse);
			} 
            catch (Exception e) {
                recTime = DateTime.now().getTime();
                fhirResponse = new FHIR_Callout__c(Endpoint__c = endPoint, Response_Time__c = recTime-sentTime, HTTP_Status__c = e.getMessage(), User__c = UserInfo.getUserName(), UserName__c = UserInfo.getName());
                fhirResponses.add(fhirResponse);
                
                String errorType;
                if (e.getMessage().containsIgnoreCase('CPU')) {
                	errorType = 'CPU';
                } else if (e.getMessage().containsIgnoreCase('HEAP')) {
                    errorType = 'HeapSize';
                } else {
                	errorType = 'OTHER';
                }
                fqResults.addError(sources[i].Name__c, errorType, 'ERROR', e.getMessage());
                throw e;
			}    
        }
        return;
    }
}