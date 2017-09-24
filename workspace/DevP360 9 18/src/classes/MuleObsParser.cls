/**
@Author      :   Cognizant Technology Solutions
@name        :   MuleObsParser
@CreateDate  :   08/31/2017
@Description :   To Parse the Json Response.
@Version     :   1.0
*/
public class MuleObsParser implements IFHIRParser {
    
    // The purpose of this class is to parse a JSON stream.  Not using the 
    // Salesforce-provided JSONParser because we found it to be too slow
    // for large record sets.
    
    private String empi;
    List<Account> accts;
    
    public MuleObsParser() {
    }
    
    /**
	*  Description of the purpose of the class's method. 
	*  @name	:	parseResponse
	*  @param	:	1.theService	:	Captures the value for theService
					2.empi			:	Captures the value for empi
					3.selectedId	:	Captures the value for encounterId
					4.json			:	Captures the json value					
					5.fqResults		:	Captures the fqResults object	
					6.observations	:	Captures the observations object	
	*  @purpose :	To parse the json response.
	*/
    public void parseResponse(String theService, String empi, String selectedId, String json, FHIRQueryResults fqResults, List<HealthCloudGA__EhrObservation__c> observations) {
        
        this.empi = empi;
        
        Integer start = 0;
        Integer newStart = 0;
        Integer strEnd = 0;
        Integer ctr = 0;
        Integer ping = 0;
        
        accts = PatientUtil.getRelatedAccountsByEMPI(empi);
        
        while (true) {
            
            newStart = json.indexOf('"resourceType": "Observation"', start);
            system.debug('NewStart Val : '+newStart);
            if (newStart == -1) {
                System.debug('done');
                break;
            }
            ctr++;
            
            strEnd = json.indexOf('"resourceType": "Observation"', newStart + 1);
            system.debug('startEnd'+strEnd);
            if (strEnd == -1) {
                strEnd = json.length() - 1;
            }
            
            String observation = json.substring(newStart, strEnd);
            processObservation(observation, observations);
            
            start = newStart + 20;
            system.debug('Start Pos after +20'+start);
            
            // We can't catch a LimitException, so we need to do our best to prevent
            //  them from occurring.  In this operation, a large result set may push
            //  us over the Apex CPU Time Limit (10,000 milliseconds).
            
            Integer myTime = Limits.getCpuTime();
            if (myTime > 9500) {
                fqResults.addError(theService, 'CPU', 'ERROR', 'Apex CPU time limit exceeded');
                throw new CPUTimeException('Apex CPU time: ' + myTime);
            }
        }
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
        system.debug('SourcesystemValue '+sourceSystemId);
        sourceSystem = getSourceSystem(obs, 0);
        mrn = getMRN(obs, 0);
        
        codeOffset = obs.indexOf('"code": {');
        system.debug('codeoffset at "code": { ' +codeOffset);
        if (codeOffset > 0) {
            codingSystem = getCodingSystem(obs, codeOffset);
            codingCode = getCodingCode(obs, codeOffset + 5);
            codingDisplay = getCodingDisplay(obs, codeOffset);
            valueDateTime = getValueDateTime(obs, codeOffset);
            valueQuantityValue = getValueQuantityValue(obs, codeOffset);
            valueQuantityUnit = getValueQuantityUnit(obs, codeOffset);
            refLowValue = getRefLowValue(obs, codeOffset);
            //Commented out the following line, since we're not persisting reference units:
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
            
        }
        
    }
    /**
		*  Description of the purpose of the class's method. 
		*  @name    :	getAccount
		*  @param   :	1. sourceSystem	:	Captures the value for sourceSystem
						2. mrn		:	Captures the value for Patient mrn
		*  @return  : 	Id
		*  @purpose :	Method which is used to get the Account Id.
	*/
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
        system.debug('codeOffset sourcesystem initial'+codeOffset);
        codeOffset = obs.indexOf('value":');
        system.debug('codeOffset sourcesystem after value":'+codeOffset);
        codeOffset += 6;
        system.debug('codeOffset sourcesystem after +6'+codeOffset);
        return getValue(obs, codeOffset);
    }
    /**
	*  Description of the purpose of the class's method. 
	*  @name    :	getSourceSystem
	*  @param   :	1. obs				:	Captures the value for obs
					2. codeOffset		:	Captures the value for codeOffset
	*  @return  : 	String
	*  @purpose :	Method to getSourceSystem.
	*/ 
    private String getSourceSystem(String obs, Integer codeOffset) {
        // the first occurence of 'status' is in the entry's source system:
        codeOffset = obs.indexOf('status":');
        codeOffset += 7;
        return getValue(obs, codeOffset);
    }
    /**
	*  Description of the purpose of the class's method. 
	*  @name    :	getRefHiValue
	*  @param   :	1. obs				:	Captures the value for obs
					2. codeOffset		:	Captures the value for codeOffset
	*  @return  : 	String
	*  @purpose :	Method to getRefHiValue.
	*/
    private String getRefHiValue(String obs, Integer codeOffset) {
        // increment the pointer to the beginning of "referenceRange":
        codeOffset = obs.indexOf('referenceRange', codeOffset);
        codeOffset += 10;
        codeOffset = obs.indexOf('high":', codeOffset);
        codeOffset = obs.indexOf('value":', codeOffset);
        codeOffset += 6;
        return getValue(obs, codeOffset);
    }
    /**
	*  Description of the purpose of the class's method. 
	*  @name    :	getRefHiUnit
	*  @param   :	1. obs				:	Captures the value for obs
					2. codeOffset		:	Captures the value for codeOffset
	*  @return  : 	String
	*  @purpose :	Method to getRefHiUnit.
	*/
    private String getRefHiUnit(String obs, Integer codeOffset) {
        // increment the pointer to the beginning of "referenceRange":
        codeOffset = obs.indexOf('referenceRange', codeOffset);
        codeOffset += 10;
        codeOffset = obs.indexOf('high":', codeOffset);
        codeOffset = obs.indexOf('unit":', codeOffset);
        codeOffset += 5;
        return getValue(obs, codeOffset);
    }
    /**
	*  Description of the purpose of the class's method. 
	*  @name    :	getRefLowValue
	*  @param   :	1. obs				:	Captures the value for obs
					2. codeOffset		:	Captures the value for codeOffset
	*  @return  : 	String
	*  @purpose :	Method to getRefLowValue.
	*/
    private String getRefLowValue(String obs, Integer codeOffset) {
        // increment the pointer to the beginning of "referenceRange":
        codeOffset = obs.indexOf('referenceRange', codeOffset);
        codeOffset += 10;
        codeOffset = obs.indexOf('low":', codeOffset);
        codeOffset = obs.indexOf('value":', codeOffset);
        codeOffset += 6;
        return getValue(obs, codeOffset);
    }
    /**
	*  Description of the purpose of the class's method. 
	*  @name    :	getRefLowUnit
	*  @param   :	1. obs				:	Captures the value for obs
					2. codeOffset		:	Captures the value for codeOffset
	*  @return  : 	String
	*  @purpose :	Method to getRefLowUnit.
	*/
    private String getRefLowUnit(String obs, Integer codeOffset) {
        // increment the pointer to the beginning of "referenceRange":
        codeOffset = obs.indexOf('referenceRange', codeOffset);
        codeOffset += 10;
        codeOffset = obs.indexOf('low":', codeOffset);
        codeOffset = obs.indexOf('unit":', codeOffset);
        codeOffset += 5;
        return getValue(obs, codeOffset);
    }
    /**
	*  Description of the purpose of the class's method. 
	*  @name    :	getValueQuantityUnit
	*  @param   :	1. obs				:	Captures the value for obs
					2. codeOffset		:	Captures the value for codeOffset
	*  @return  : 	String
	*  @purpose :	Method to getValueQuantityUnit.
	*/
    private String getValueQuantityUnit(String obs, Integer codeOffset) {
        
        codeOffset = obs.indexOf('unit":');
        system.debug('codeoffset Unit before +5 :'+codeOffset);
        codeOffset += 5;
        system.debug('codeoffset Unit after +5 :'+codeOffset);
        return getValue(obs, codeOffset);
    }
    /**
	*  Description of the purpose of the class's method. 
	*  @name    :	getValueQuantityValue
	*  @param   :	1. obs				:	Captures the value for obs
					2. codeOffset		:	Captures the value for codeOffset
	*  @return  : 	String
	*  @purpose :	Method to getValueQuantityValue.
	*/
    private String getValueQuantityValue(String obs, Integer codeOffset) {
        // increment the pointer to the beginning of "valueQuantity":
        codeOffset = obs.indexOf('valueQuantity', codeOffset);
        codeOffset += 10;
        codeOffset = obs.indexOf('value":', codeOffset);
        codeOffset += 6;
        return getValue(obs, codeOffset);
        
    }
    /**
	*  Description of the purpose of the class's method. 
	*  @name    :	getValueDateTime
	*  @param   :	1. obs				:	Captures the value for obs
					2. codeOffset		:	Captures the value for codeOffset
	*  @return  : 	String
	*  @purpose :	Method to getValueDateTime.
	*/
    private String getValueDateTime(String obs, Integer codeOffset) {     
        codeOffset = obs.indexOf('valueDateTime":', codeOffset);
        codeOffset += 14;
        //System.debug(obs.substring(codeOffset, codeOffset + 20));
        return getValue(obs, codeOffset);
    }
    /**
	*  Description of the purpose of the class's method. 
	*  @name    :	getCodingSystem
	*  @param   :	1. obs				:	Captures the value for obs
					2. codeOffset		:	Captures the value for codeOffset
	*  @return  : 	String
	*  @purpose :	Method to getCodingSystem.
	*/
    private String getCodingSystem(String obs, Integer codeOffset) {
        
        codeOffset = obs.indexOf('system":', codeOffset);
        // Now that we know where "system" starts, we can capture its value.  This
        // increments codeOffset so that it now points to the first character of 
        // the value:
        codeOffset += 7;
        //System.debug(obs.substring(codeOffset, codeOffset + 20));
        return getValue(obs, codeOffset);
        
    }
    /**
	*  Description of the purpose of the class's method. 
	*  @name    :	getCodingCode
	*  @param   :	1. obs				:	Captures the value for obs
					2. codeOffset		:	Captures the value for codeOffset
	*  @return  : 	String
	*  @purpose :	Method to getCodingCode.
	*/
    private String getCodingCode(String obs, Integer codeOffset) {
        
        codeOffset = obs.indexOf('code":', codeOffset);
        system.debug('codeoffset code before +5 : '+codeOffset);
        // Now that we know where "code" starts, we can capture its value.  This
        // increments codeOffset so that it now points to the first character of 
        // the value:
        codeOffset += 5;
        system.debug('codeoffset code after +5 : '+codeOffset);
        //System.debug(obs.substring(codeOffset, codeOffset + 10));
        return getValue(obs, codeOffset);
        
    }
    /**
	*  Description of the purpose of the class's method. 
	*  @name    :	getCodingDisplay
	*  @param   :	1. obs				:	Captures the value for obs
					2. codeOffset		:	Captures the value for codeOffset
	*  @return  : 	String
	*  @purpose :	Method to getCodingDisplay.
	*/
    private String getCodingDisplay(String obs, Integer codeOffset) {
        
        codeOffset = obs.indexOf('display":', codeOffset);
        // Now that we know where "display" starts, we can capture its value.  This
        // increments codeOffset so that it now points to the first character of 
        // the value:
        codeOffset += 8;
        return getValue(obs, codeOffset);
        
    }
    /**
	*  Description of the purpose of the class's method. 
	*  @name    :	getValue
	*  @param   :	1. str			:	Captures the value for str
					2. offset		:	Captures the value for offset
	*  @return  : 	String
	*  @purpose :	Method to getValue.
	*/
    private String getValue(String str, Integer offset) {
        String obsSystem;
        // get the position of the first double quote:
        Integer i = str.indexOf('"', offset);
        System.debug('first quote: ' + i);
        if (i < 0) {
            obsSystem = 'i dont know';
        } else {
            offset = i + 1;
            System.debug('offset : ' + offset);
            // get the position of the second double quote:
            i = str.indexOf('"', offset);
            System.debug('second quote: ' + i);
            obsSystem = str.substring(offset, i);
        }
        System.debug('value: ' + obsSystem);
        return obsSystem;
    }
    
}