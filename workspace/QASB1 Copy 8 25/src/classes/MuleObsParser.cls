public class MuleObsParser implements IFHIRParser {
    
    // The purpose of this class is to parse a JSON stream.  Not using the 
    // Salesforce-provided JSONParser because we found it to be too slow
    // for large record sets.
   
    private String empi;
    List<Account> accts;
    
    public MuleObsParser() {
    }
    
    public void parseResponse(String theService, String empi, String json, FHIRQueryResults fqResults, List<HealthCloudGA__EhrObservation__c> observations) {

        //this.acctId = acctId;
        this.empi = empi;
        
        Integer start = 0;
        Integer newStart = 0;
        Integer strEnd = 0;
        Integer ctr = 0;
        Integer ping = 0;
        
        // fqResults.addError(theService, 'TEST', 'Heap at start of parseJSON', String.valueOf(Limits.getHeapSize()));

        accts = PatientUtil.getRelatedAccountsByEMPI(empi);
            
        while (true) {
            
            newStart = json.indexOf('"resourceType": "Observation"', start);
            if (newStart == -1) {
                System.debug('done');
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
                
            Integer myTime = Limits.getCpuTime();
            if (myTime > 9500) {
            	//System.debug('Mule Parser: parseJSON: CPU Time: ' + myTime);
            	fqResults.addError(theService, 'CPU', 'ERROR', 'Apex CPU time limit exceeded');
            	throw new CPUTimeException('Apex CPU time: ' + myTime);
            }
        }

        //fqResults.addError(theService, 'TEST', 'Heap before returning from parseJSON', String.valueOf(Limits.getHeapSize()));
        return;
        
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
        //	

        String mrn;
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
                
        // We'll use a combination of sourceSystem and mrn to find which 
        //   Account to attach this to.
        sourceSystemId = getSourceSystemId(obs, 0);
        sourceSystem = getSourceSystem(obs, 0);
        mrn = getMRN(obs, 0);
        
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
            ehrObs.HealthCloudGA__Account__c = getAccount(sourceSystem, mrn);
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
            
        	//System.debug('Observation #' + observations.size() + ':  code = ' + ehrObs.HealthCloudGA__NameCode__c);
        }

    }
    
    private Id getAccount(String sourceSystem, String mrn) {
        for(Account acct : this.accts) {
            if(acct.HealthCloudGA__SourceSystem__c.compareTo(sourceSystem) ==0) {
                if(acct.HealthCloudGA__MedicalRecordNumber__c.compareTo(mrn) == 0) {
                    return acct.Id;
                }
            }
        }
        return (Id)null;
    }
    
    private String getMRN(String obs, Integer codeOffset) {
        // Find the first occurrence of "subject"
		Integer newOffset = obs.indexOf('subject');        
        // After that, find the string "Patient"
        newOffset = obs.indexOf('Patient', newOffset);
        // After that, find the first "value" property:
        newOffset = obs.indexOf('value":', newOffset);
        newOffset += 6;
        return getValue(obs, newOffset);
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

    
}