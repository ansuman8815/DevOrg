public class FHIRCalloutUtil {
    
    //public static void queryActiveFHIRSources(String resource, Id acctId, String startDate, String endDate, FHIRQueryResults fqResults) {
    public static void queryActiveFHIRSources(String resource, String empi, String startDate, String endDate, FHIRQueryResults fqResults) {
   
        List<FHIR_Callout__c> fhirResponses = new List<FHIR_Callout__c>();
        List<HealthCloudGA__EhrObservation__c> observations = new List<HealthCloudGA__EhrObservation__c>();
        List<Source_System__c> sources = [SELECT Name__c, FHIR_URL__c, Accept_Type__c, Response_Parser_Class__c, Endpoint_Generator_Class__c, Use_Client_ID_and_Secret__c, Use_HTTP_Basic_Auth__c, URL_Client_ID__c, URL_Client_Secret__c, HTTP_Auth_UserName__c, HTTP_Auth_Password__c FROM Source_System__c WHERE FHIR_Resource_Name__c = :resource AND Active__c = true];

        System.debug('Heap: ' + String.valueOf(Limits.getHeapSize()));
        
        // The getFHIRResponse call could generate a couple of different Exceptions:
        // System.CalloutException
        // System.Limit Exception (Heap Size, CPU Time, etc.)
        // CPUTimeException
        
        Boolean heapSizeProblem = false;
        Boolean cpuTimeProblem = false;
        try {
        	getFHIRResponse(resource, empi, sources, startDate, endDate, fqResults, observations, fhirResponses);
        } catch (Exception e) {
            String exceptionType = e.getTypeName();
            System.debug('FHIRCalloutUtil caught exception: ' + exceptionType + '; ' + e.getMessage());
            System.debug('Heap on return: ' + String.valueOf(Limits.getHeapSize()));
            System.debug('CPU time so far: ' + String.valueOf(Limits.getCpuTime()));
            
            if (e.getMessage().containsIgnoreCase('Exceeded max size limit')) {
                heapSizeProblem = true;
            }
        }
        
        Integer limitTime = Limits.getLimitCpuTime();
        Integer cpuTime = Limits.getCpuTime();
        Integer remainingTime = limitTime - cpuTime;
        System.debug('Remaining Time: ' + remainingTime);
        
        if (remainingTime > 4000 && heapSizeProblem) {
            
            if ((Limits.getLimitCpuTime() - Limits.getCpuTime()) > 4000) {
            
            	String strOrigEndDate = endDate;
            	Date origStartDate = StringUtil.getDateFromDDMMYYYY(startDate);
            	Date origEndDate = StringUtil.getDateFromDDMMYYYY(endDate);
            	Integer origMonths = origStartDate.monthsBetween(origEndDate);
            	Integer months = origMonths / 3;
            
            	System.debug('Original span: ' + String.valueOf(origMonths));
            	System.debug('New span: ' + String.valueOf(months + 1));
            
            	String strStartDate;
            	String strEndDate;

            	System.debug('Original date span: ' + startDate + ' to ' + endDate);
            
            	Date newEndDate = origStartDate.addMonths(months);
            	strEndDate = StringUtil.getStrFromDate(newEndDate);
            	System.debug('Calling getFHIRResponse with new date span: ' + startDate + ' to ' + strEndDate);
            	try {
               		getFHIRResponse(resource, empi, sources, startDate, strEndDate, fqResults, observations, fhirResponses);
            	} catch (Exception e1) {
                	System.debug('e1: ' + e1.getTypeName() + ': ' + e1.getMessage());
            	}
                
        		limitTime = Limits.getLimitCpuTime();
        		cpuTime = Limits.getCpuTime();
        		remainingTime = limitTime - cpuTime;
                
            	System.debug('Remaining CPU time (2): ' + remainingTime);
                
                if (remainingTime > 4000) {

            		origStartDate = newEndDate.addDays(1);
            		newEndDate = origStartDate.addMonths(months);
            		strStartDate = StringUtil.getStrFromDate(origStartDate);
            		strEndDate = StringUtil.getStrFromDate(newEndDate);
            		System.debug('Calling getFHIRResponse with new date span: ' + strStartDate + ' to ' + strEndDate);
            		try {
               			getFHIRResponse(resource, empi, sources, strStartDate, strEndDate, fqResults, observations, fhirResponses);
            		} catch (Exception e2) {
                		System.debug('e2: ' + e2.getTypeName() + ': ' + e2.getMessage());
            		}

        			limitTime = Limits.getLimitCpuTime();
        			cpuTime = Limits.getCpuTime();
        			remainingTime = limitTime - cpuTime;
            		System.debug('Remaining CPU time (3): ' + remainingTime);
                
                	if (remainingTime > 4000) {
            			origStartDate = newEndDate.addDays(1);
            			newEndDate = origStartDate.addMonths(months);
            			strStartDate = StringUtil.getStrFromDate(origStartDate);
            			strEndDate = StringUtil.getStrFromDate(newEndDate);
            			System.debug('Calling getFHIRResponse with new date span: ' + strStartDate + ' to ' + strOrigEndDate);
            	
            			try {
               				getFHIRResponse(resource, empi, sources, strStartDate, strEndDate, fqResults, observations, fhirResponses);
            			} catch (Exception e3) {
                			System.debug('e3: ' + e3.getTypeName() + ': ' + e3.getMessage());
            			}
                	}
                }
                
        	}
  
        }

        if (null == observations) {
            System.debug('Observations is null');
        } else {
            System.debug('Number of observations: ' + String.valueOf(observations.size()));
        }
        
        if (null != observations && observations.size() < 9950) {
            // Can only insert 10,000 max, and we want to leave room for the 
            // fhirResponses and fhirQueryResults inserts.
            
        	try {
            	upsert observations HealthCloudGA__SourceSystemId__c;
        	} catch (DmlException e) {
            	fqResults.addError('', 'DML', 'ERROR', e.getMessage());
        	}
            
        }

        insert fhirResponses;

    }
    
    private static void getFHIRResponse(String resource, String empi, List<Source_System__c> sources, String startDate, String endDate, FHIRQueryResults fqResults, List<HealthCloudGA__EhrObservation__c> observations, List<FHIR_Callout__c> fhirResponses) {
    //private static void getFHIRResponse(String resource, Id acctId, List<Source_System__c> sources, String startDate, String endDate, FHIRQueryResults fqResults, List<HealthCloudGA__EhrObservation__c> observations, List<FHIR_Callout__c> fhirResponses) {
        
        Http httpProtocol = new Http();
        HttpRequest req = new HttpRequest();
        
        for (Integer i=0; i<sources.size(); i++) {
            
			HttpResponse res;
            
            // Build the endpoint based on the class provided in Source_System__c.Endpoint_Generator_Class__c:
            Type fhirUtilImpl = Type.forName(sources[i].Endpoint_Generator_Class__c);
            IFHIRUtil fhirUtil = (IFHIRUtil)fhirUtilImpl.newInstance();
            String endpoint = fhirUtil.buildEndpoint(sources[i], resource, empi, startDate, endDate); 
            req.setEndpoint(endPoint); 

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
                } else {

                    Long startParse = DateTime.now().getTime();
                    Long endParse;
                    String json = res.getBody();
                    res = null;
                    Integer jsonLen = json.length();
            		//fqResults.addError(sources[i].Name__c, 'TEST', 'HEAP after FHRICalloutUtil res cleanup', String.valueOf(Limits.getHeapSize()));
                    
                    Type fhirParserImpl = Type.forName(sources[i].Response_Parser_Class__c);
                    IFHIRParser fhirParser = (IFHIRParser)fhirParserImpl.newInstance();
                	fhirParser.parseResponse(sources[i].Name__c, empi, json, fqResults, observations);
                    
                    endParse = DateTime.now().getTime();
                
            		//fqResults.addError(sources[i].Name__c, 'TEST', 'HEAP after return from parseJSON', String.valueOf(Limits.getHeapSize()));
                    json = null;
            		//fqResults.addError(sources[i].Name__c, 'TEST', 'HEAP after json cleanup', String.valueOf(Limits.getHeapSize()));
                    
            		if (null == endParse) {
            			endParse = 0;
            		}
            		fhirResponse = new FHIR_Callout__c(Endpoint__c = endPoint, Parsing_Time__c = endParse - startParse, Rows_Returned__c = observations.size(), Bytes_Returned__c = jsonLen, Response_Time__c = recTime-sentTime, HTTP_Status_Code__c = httpStatusCode, HTTP_Status__c = httpStatus, User__c = UserInfo.getUserName(), UserName__c = UserInfo.getName());
					
                }
                fhirResponses.add(fhirResponse);
                    
			} catch (Exception e) {
            	System.debug('FHIRCalloutUtil.getFHIRResponse: Exception: ' + e.getTypeName() + ': ' + e.getMessage());
                System.debug('FHIRCalloutUtil.getFHIRResponse: Heap now: ' + String.valueOf(Limits.getHeapSize()));
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
        
        //fqResults.addError('blah', 'TEST', 'Cpu Time', String.valueOf(Limits.getCpuTime()));
        return;
    }
    
}