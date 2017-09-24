public class FHIRQueryUtil {
    
    public static void queryActiveFHIRSources(String resource, Id acctId, String startDate, String endDate, FHIRQueryResults fqResults) {
    /*
        
        List<FHIR_Callout__c> fhirResponses = new List<FHIR_Callout__c>();
        List<HealthCloudGA__EhrObservation__c> observations = new List<HealthCloudGA__EhrObservation__c>();
        List<Source_System__c> sources = [SELECT Name__c, FHIR_URL__c, Accept_Type__c, Response_Parser_Class__c, Endpoint_Generator_Class__c, Use_Client_ID_and_Secret__c, Use_HTTP_Basic_Auth__c, URL_Client_ID__c, URL_Client_Secret__c, HTTP_Auth_UserName__c, HTTP_Auth_Password__c FROM Source_System__c WHERE FHIR_Resource_Name__c = :resource AND Active__c = true];

        getFHIRResponse(resource, acctId, sources, startDate, endDate, fqResults, observations, fhirResponses);
  
        if (fqResults.heapSizeExceeded) {
            // Whoa!  Payload was too big.
            System.debug('Payload was too big');        
            
            Date origStartDate = StringUtil.getDateFromDDMMYYYY(startDate);
            Date origEndDate = StringUtil.getDateFromDDMMYYYY(endDate);
            // Break the query up into thirds:
            Integer months = origStartDate.monthsBetween(origEndDate) / 3;
            
            // Recalculate dates and call getFHIRResponse for each pair.
            // The date values are passed as strings, and they need to look like "mm-dd-yyy"
            String strStartDate;
            String strEndDate;
            
            Date newEndDate = origStartDate.addMonths(months);
            strEndDate = StringUtil.getStrFromDate(newEndDate);
            fqResults.heapSizeExceeded = false;
            getFHIRResponse(resource, acctId, sources, startDate, strEndDate, fqResults, observations, fhirResponses);
            if (fqResults.heapSizeExceeded) {
                System.debug('Whoa! Payload still too big!  First third');
            }
            
            Date newStartDate = newEndDate.addDays(1);
            startDate = StringUtil.getStrFromDate(newStartDate);
            newEndDate = newStartDate.addMonths(months);
            strEndDate = StringUtil.getStrFromDate(newEndDate);
            fqResults.heapSizeExceeded = false;
            getFHIRResponse(resource, acctId, sources, startDate, strEndDate, fqResults, observations, fhirResponses);
            if (fqResults.heapSizeExceeded) {
                System.debug('Whoa! Payload still too big!  Second third');
            }
            
            newStartDate = newEndDate.addDays(1);
            newEndDate = newStartDate.addMonths(months);
            startDate = StringUtil.getStrFromDate(newStartDate);
            endDate = StringUtil.getStrFromDate(newEndDate);
            fqResults.heapSizeExceeded = false;
            getFHIRResponse(resource, acctId, sources, startDate, endDate, fqResults, observations, fhirResponses);
            if (fqResults.heapSizeExceeded) {
                System.debug('Whoa! Payload still too big!  Third third');
            }
            
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

        insert fhirResponses;*/

    }
    
    /*private static void getFHIRResponse(String resource, Id acctId, List<Source_System__c> sources, String startDate, String endDate, FHIRQueryResults fqResults, List<HealthCloudGA__EhrObservation__c> observations, List<FHIR_Callout__c> fhirResponses) {
        
        Http httpProtocol = new Http();
        HttpRequest req = new HttpRequest();
        
        for (Integer i=0; i<sources.size(); i++) {
            
            Boolean needMoreRows = true;

            while (needMoreRows) {
                
                HttpResponse res;
            
                // Build the endpoint based on the class provided in Source_System__c.Endpoint_Generator_Class__c:
                Type fhirUtilImpl = Type.forName(sources[i].Endpoint_Generator_Class__c);
                IFHIRUtil fhirUtil = (IFHIRUtil)fhirUtilImpl.newInstance();
                String endpoint = fhirUtil.buildEndpoint(sources[i], resource, acctId, startDate, endDate); 
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
                //System.debug('Sending API Request');
                Long sentTime = DateTime.now().getTime();
                Long recTime;
                //fqResults.addError(sources[i].Name__c, 'Time', 'API Send', sentTime.format());
                FHIR_Callout__c fhirResponse;
                //String apiResponse;
                try {
                    fqResults.addError(sources[i].Name__c, 'TEST', 'HEAP before send', String.valueOf(Limits.getHeapSize()));
                    res = httpProtocol.send(req);
                    //apiResponse = httpProtocol.send(req).getBody();
                    // if the call had been successful, we probably don't need to get more rows:
                    needMoreRows = false;
                    recTime = DateTime.now().getTime();
                } catch (System.CalloutException e) {
                    
                    recTime = DateTime.now().getTime();
                    fhirResponse = new FHIR_Callout__c(Endpoint__c = endPoint, Response_Time__c = recTime-sentTime, HTTP_Status__c = e.getMessage(), UserName__c = UserInfo.getName());
                    fhirResponses.add(fhirResponse);
                    fqResults.addError(sources[i].Name__c, 'HeapSize', 'ERROR', e.getMessage());
                    return;
                }
        
                // Get the timestamp immediately after receiving response:
                //long recTime = DateTime.now().getTime();
                //fqResults.addError(sources[i].Name__c, 'Time', 'API Response', recTime.format());
                
                //System.debug('apiResponse: ' + apiResponse);
                fqResults.addError(sources[i].Name__c, 'TEST', 'HEAP before getBody()', String.valueOf(Limits.getHeapSize()));
                String apiResponse = res.getBody();
                fqResults.addError(sources[i].Name__c, 'TEST', 'HEAP after getBody()', String.valueOf(Limits.getHeapSize()));

                // TEST TEST TEST TEST TEST
                //APIResponseUtil.persistResponse(endPoint, apiResponse);


                // Add a new error message if it was not successful:
                if (res.getStatusCode() != 200 ) {
                    fqResults.addError(sources[i].Name__c, 'HttpRequest', String.valueOf(res.getStatusCode()), res.getStatus());
                } else {

                    // Parse the results and persist them in the Health Cloud data objects, based on the defined parser class:

                    
                    Type fhirParserImpl = Type.forName(sources[i].Response_Parser_Class__c);
                    IFHIRParser fhirParser = (IFHIRParser)fhirParserImpl.newInstance();
                    
                    Long startParse = DateTime.now().getTime();
                    Long endParse;
                    
                    // If we're going to run out of APEX CPU time, it will be in this method:
                    try {
                        fhirParser.parseResponse(sources[i].Name__c, acctId, apiResponse, fqResults, observations);
                        endParse = DateTime.now().getTime();
                    } catch (System.Exception e) {
                        String errorType;
                        if (e.getMessage().containsIgnoreCase('CPU')) {
                            errorType = 'CPU';
                        } else {
                            errorType = 'OTHER';
                        }
                        fqResults.addError(sources[i].Name__c, errorType, 'ERROR', e.getMessage());
                    }
            
                    //fhirResponse.Rows_Returned__c = fhirParser.entry.size();
                    //System.debug('Number of entries: ' + fhirResponse.Rows_Returned__c);
                    //fhirResponse.Bytes_Returned__c = apiResponse.length();
                    //if (apiResponse.length() < 131073) {
                        //fhirResponse.Response_Body__c = apiResponse;
                    //}
                    //
                    if (null == endParse) {
                        endParse = 0;
                    }
                    fhirResponse = new FHIR_Callout	__c(Endpoint__c = endPoint, Parsing_Time__c = endParse - startParse, Rows_Returned__c = observations.size(), Bytes_Returned__c = apiResponse.length(), Response_Time__c = recTime-sentTime, HTTP_Status_Code__c = res.getStatusCode(), HTTP_Status__c = res.getStatus(), User__c = UserInfo.getUserName(), UserName__c = UserInfo.getName());
                
                    
                }
                fhirResponses.add(fhirResponse);
                
            }
            
        }
        
        return;
    }*/
    
}