public class MuleFHIRObsParser implements IFHIRParser {
    
    // The purpose of this class is to parse a JSON stream.  Not using the 
    // Salesforce-provided JSONParser because we found it to be too slow
    // for large record sets.
    
    //private List<HealthCloudGA__EhrObservation__c> observations;
    private String acctId;
    
    public MuleFHIRObsParser() {
    }
    
    // Called like this: 
    // fhirParser.parseResponse(sources[i].Name__c, acctId, apiResponse, fqResults);

    public void parseResponse(String theService, Id accountId, String response, FHIRQueryResults fqResults, List<HealthCloudGA__EhrObservation__c> observations) {
        
        Integer ctr;
        
        //fqResults.addError(theService, 'Time', 'Start Parsing', DateTime.now().getTime().format());
        ctr = parseJSON(accountId, response, fqResults, observations);
        //fqResults.addError(theService, 'Time', 'Parsed ' + ctr + ' rows', DateTime.now().getTime().format());
        
    }
    
    public Integer parseJSON(Id acctId, String json, FHIRQueryResults fqResults, List<HealthCloudGA__EhrObservation__c> observations) {
        
        this.acctId = acctId;
        
        Integer start = 0;
        Integer newStart = 0;
        Integer strEnd = 0;
        Integer ctr = 0;
        Integer ping = 0;
        
        while (true) {
            
            newStart = json.indexOf('"resourceType": "Observation"', start);
            if (newStart == -1) {
                break;
            }
            ctr++;
            
            strEnd = json.indexOf('"resourceType": "Observation"', newStart + 1);
            if (strEnd == -1) {
                strEnd = json.length() - 1;
            }
            
            String observation = json.substring(newStart, strEnd);
            processObservation(observation, observations);
            start = newStart + 20;
            
            // We can't catch a LimitException, so we need to do our best to prevent
            //  them from occurring.  In this operation, a large result set may push
            //  us over the Apex CPU Time Limit (10,000 milliseconds).
            ping++;
            if (ping == 10) {
                
        System.debug('HEAP in MuleFHIRObsParser.parseJSON(): ' + String.valueOf(Limits.getHeapSize()));
            	System.debug('CPU Limit Time: ' + Limits.getLimitCpuTime() + '; CPU Time: ' + Limits.getCpuTime());
                if (Limits.getCpuTime() > 9500) {
                    System.debug('CPU Limit Time: ' + Limits.getLimitCpuTime() + '; CPU Time: ' + Limits.getCpuTime());
                	fqResults.addError('', 'CPU', 'ERROR', 'Apex CPU time limit exceeded');
                    return ctr;
                }
                // reassign the variable:
                ping = 0;
            }
        }
        
        return ctr;
        
    }
    
    private void processObservation(String obs, List<HealthCloudGA__EhrObservation__c> observations) {
        
        // The key data in the observation looks something like this:
        // 
		// "code": {
		//	"coding": [
		//		{
		//			"system": "SCC_MS_LAB_PROCEDURE",
		//			"code": "03373",
		//			"display": "PO2 - ART (POCT)"
		//		}
		//	],
		//	"text": "stuff here"
        //	},
        //	"value": {
        //		"valueDateTime": "datetime here"
        //		"valueQuantity": {
        //			"value": "value here",
        //			"unit": "unit here"
        //		}
        //	},
        //	"referenceRange": {
        //		"low": {
        //			"value": "1",
        //			"unit": "adfasf"
        //		},
        //		"high": {
        //			"value": "2",
        //			"unit": "adfasf"
        //		}
        //	}

        String sourceSystem;
        String sourceSystemId;
        String codingSystem;
        String codingCode;
		String codingDisplay;
        String valueDateTime;
        String valueQuantityValue;
        String valueQuantityUnit;
        String refLowValue;
        String refLowUnit;
        String refHiValue;
        String refHiUnit;
		Integer codeOffset;
                
        sourceSystemId = getSourceSystemId(obs, 0);
        sourceSystem = getSourceSystem(obs, 0);
        
        codeOffset = obs.indexOf('"code": {');
        if (codeOffset > 0) {
            codingSystem = getCodingSystem(obs, codeOffset);
            codingCode = getCodingCode(obs, codeOffset + 5);
            codingDisplay = getCodingDisplay(obs, codeOffset);
            valueDateTime = getValueDateTime(obs, codeOffset);
            valueQuantityValue = getValueQuantityValue(obs, codeOffset);
            valueQuantityUnit = getValueQuantityUnit(obs, codeOffset);
			refLowValue = getRefLowValue(obs, codeOffset);
            // Commented out the following line, since we're not persisting reference units:
            // refLowUnit = getRefLowUnit(obs, codeOffset);
            refHiValue = getRefHiValue(obs, codeOffset);
            // Commented out the following line, since we're not persisting reference units:
            // refHiUnit = getRefHiUnit(obs, codeOffset);
             
            HealthCloudGA__EhrObservation__c ehrObs = new HealthCloudGA__EhrObservation__c();
            ehrObs.HealthCloudGA__Account__c = this.acctId;
            ehrObs.HealthCloudGA__SourceSystemId__c = sourceSystemId;
            ehrObs.HealthCloudGA__SourceSystem__c = sourceSystem;
            ehrObs.HealthCloudGA__NameCode__c = codingCode;
            ehrObs.HealthCloudGA__NameSystem__c = codingSystem;
            ehrObs.HealthCloudGA__NameLabel__c = codingDisplay;
            ehrObs.HealthCloudGA__ValuePeriodStartDate__c = StringUtil.getDTFromString(valueDateTime);
            if (valueQuantityValue.length() > 250) {
                ehrObs.HealthCloudGA__ValueQuantity__c = valueQuantityValue.substring(0, 249) + ' ...';
                ehrObs.HealthCloudGA__Comments__c = valueQuantityValue;
            } else {
            	ehrObs.HealthCloudGA__ValueQuantity__c = valueQuantityValue;
            }
            ehrObs.HealthCloudGA__ValueQuantityUnit__c = valueQuantityUnit;
            ehrObs.HealthCloudGA__ReferenceRangeHighValue__c = refHiValue;
            ehrObs.HealthCloudGA__ReferenceRangeLowValue__c = refLowValue;
            ehrObs.Type__c = 'Lab Result';
            
            observations.add(ehrObs);
        }
        
        //System.debug('Source System Id: ' + sourceSystemId);
        //System.debug('Source System: ' + sourceSystem);
        //System.debug('System: ' + codingSystem + '; Code: ' + codingCode + '; Display: ' + codingDisplay + '; ValueDateTime: ' + valueDateTime + '; Value: ' + valueQuantityValue + '; Unit: ' + valueQuantityUnit);
        //System.debug('Ref Low Val: ' + refLowValue + '; Ref Low Unit: ' + refLowUnit + '; Ref Hi Value: ' + refHiValue + '; Ref Hi Unit: ' + refHiUnit);

    }
    
    private String getSourceSystemId(String obs, Integer codeOffset) {
        // the first occurence of 'value' is in the entry's identifier:
        codeOffset = obs.indexOf('value":');
        codeOffset += 6;
        return getValue(obs, codeOffset);
    }
    
    private String getSourceSystem(String obs, Integer codeOffset) {
        // the first occurence of 'status' is in the entry's source system:
        codeOffset = obs.indexOf('status":');
        codeOffset += 7;
        return getValue(obs, codeOffset);
    }
    
    private String getRefHiValue(String obs, Integer codeOffset) {
        // increment the pointer to the beginning of "referenceRange":
        codeOffset = obs.indexOf('referenceRange', codeOffset);
        codeOffset += 10;
        codeOffset = obs.indexOf('high":', codeOffset);
        codeOffset = obs.indexOf('value":', codeOffset);
        codeOffset += 6;
        return getValue(obs, codeOffset);
    }
    
    private String getRefHiUnit(String obs, Integer codeOffset) {
        // increment the pointer to the beginning of "referenceRange":
        codeOffset = obs.indexOf('referenceRange', codeOffset);
        codeOffset += 10;
        codeOffset = obs.indexOf('high":', codeOffset);
        codeOffset = obs.indexOf('unit":', codeOffset);
        codeOffset += 5;
        return getValue(obs, codeOffset);
    }
    
    private String getRefLowValue(String obs, Integer codeOffset) {
        // increment the pointer to the beginning of "referenceRange":
        codeOffset = obs.indexOf('referenceRange', codeOffset);
        codeOffset += 10;
        codeOffset = obs.indexOf('low":', codeOffset);
        codeOffset = obs.indexOf('value":', codeOffset);
        codeOffset += 6;
        return getValue(obs, codeOffset);
    }
    
    private String getRefLowUnit(String obs, Integer codeOffset) {
        // increment the pointer to the beginning of "referenceRange":
        codeOffset = obs.indexOf('referenceRange', codeOffset);
        codeOffset += 10;
        codeOffset = obs.indexOf('low":', codeOffset);
        codeOffset = obs.indexOf('unit":', codeOffset);
        codeOffset += 5;
        return getValue(obs, codeOffset);
    }
    
    private String getValueQuantityUnit(String obs, Integer codeOffset) {
        
        codeOffset = obs.indexOf('unit":');
        codeOffset += 5;
        return getValue(obs, codeOffset);
    }
    
    private String getValueQuantityValue(String obs, Integer codeOffset) {
        // increment the pointer to the beginning of "valueQuantity":
        codeOffset = obs.indexOf('valueQuantity', codeOffset);
        codeOffset += 10;
        codeOffset = obs.indexOf('value":', codeOffset);
        codeOffset += 6;
        return getValue(obs, codeOffset);
        
    }
    
    private String getValueDateTime(String obs, Integer codeOffset) {     
		codeOffset = obs.indexOf('valueDateTime":', codeOffset);
		codeOffset += 14;
        //System.debug(obs.substring(codeOffset, codeOffset + 20));
		return getValue(obs, codeOffset);
    }
    
    private String getCodingSystem(String obs, Integer codeOffset) {
        
		codeOffset = obs.indexOf('system":', codeOffset);
		// Now that we know where "system" starts, we can capture its value.  This
		// increments codeOffset so that it now points to the first character of 
		// the value:
		codeOffset += 7;
        //System.debug(obs.substring(codeOffset, codeOffset + 20));
		return getValue(obs, codeOffset);
        
    }
    
    private String getCodingCode(String obs, Integer codeOffset) {
        
		codeOffset = obs.indexOf('code":', codeOffset);
		// Now that we know where "code" starts, we can capture its value.  This
		// increments codeOffset so that it now points to the first character of 
		// the value:
		codeOffset += 5;
        //System.debug(obs.substring(codeOffset, codeOffset + 10));
		return getValue(obs, codeOffset);
        
    }
    
    private String getCodingDisplay(String obs, Integer codeOffset) {
        
		codeOffset = obs.indexOf('display":', codeOffset);
		// Now that we know where "display" starts, we can capture its value.  This
		// increments codeOffset so that it now points to the first character of 
		// the value:
		codeOffset += 8;
		return getValue(obs, codeOffset);
        
    }
    
    private String getValue(String str, Integer offset) {
        String obsSystem;
        // get the position of the first double quote:
        Integer i = str.indexOf('"', offset);
        //System.debug('first quote: ' + i);
        if (i < 0) {
            obsSystem = 'i dont know';
        } else {
            offset = i + 1;
            // get the position of the second double quote:
            i = str.indexOf('"', offset);
            //System.debug('second quote: ' + i);
        	obsSystem = str.substring(offset, i);
        }
        //System.debug('value: ' + obsSystem);
        return obsSystem;
    }
    
    /*
    public String getStream() {
    	List<KC_Test__c> tests = [SELECT Id, text1__c, text2__c, text3__c, text4__c, text5__c, text6__c, text7__c, text8__c, text9__c, text10__c, text11__c, text12__c, text13__c FROM KC_test__c WHERE Id = 'a1O3B000000jkVUUAY'];
        if (tests.size() > 0) {
            String json = tests[0].text1__c + tests[0].text2__c + tests[0].text3__c + tests[0].text4__c + tests[0].text5__c + tests[0].text6__c + tests[0].text7__c + tests[0].text8__c + tests[0].text9__c + tests[0].text10__c + tests[0].text11__c + tests[0].text12__c + tests[0].text13__c;
			Long startTime = DateTime.now().getTime();
            parseJSON('1', json);
            Long endTime = DateTime.now().getTime();
            Long elapsedTime = endTime - startTime;
            FHIRQueryResults fqRes = new FHIRQueryResults();
            fqRes.addError('test', 'Time', 'complete', elapsedTime.format());
            fqRes.saveResults();
        }
        String results = 'Got ' + tests.size() + ' rows';
        return results;
    }
	*/
    
}