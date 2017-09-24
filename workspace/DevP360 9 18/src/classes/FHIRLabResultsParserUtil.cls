public class FHIRLabResultsParserUtil {
    
    class ObsResult{
        String acctId;
        String encounterId;
        String effectiveDateTime;
        String status;
        String codeSystem;
        String codeCode;
        String codeDisplay;
        String valueValue;
        String valueUnit;
        String valueCode;
        String valueSystem;
        String refRangeLoVal;
        String refRangeLoUnit;
        String refRangeLoCode;
        String refRangeLoSystem;
        String refRangeHiVal;
        String refRangeHiUnit;
        String refRangeHiCode;
        String refRangeHiSystem;
    }
    
    public static void parseResultsXML(XmlStreamReader fhirResult) {
        
        String localName;
        String dateRecorded;
        String clinicalStatus;
        String onsetDateTime;
        String verificationStatus;
        String acctId = '0013B00000AQllR';
        
        List<ObsResult> obsResults = new List<ObsResult>();
        
        // Remove any pre-existing conditions for this test patient:
        deletePatientObservations(acctId);
        
        while(fhirResult.hasNext()) {
            if (fhirResult.getEventType() == XmlTag.START_ELEMENT) {
            	localName = fhirResult.getLocalName();
                
                if (localName.compareTo('Observation') == 0) {
                    System.debug('New Observation');
                    ObsResult obsRes = new ObsResult();
                    obsRes.acctId = acctId;
                    parseObservation(fhirResult, obsRes);
                    obsResults.add(obsRes);
                }
                
            } 

            fhirResult.next();
        }

        System.debug('Parsed ' + obsResults.size() + ' observations');
        mapAndSaveResults(obsResults);
        
    }
    
    private static void mapAndSaveResults(List<ObsResult> obsResults) {
        
        List<HealthCloudGA__EhrObservation__c> observations = new List<HealthCloudGA__EhrObservation__c>();
        
        for (ObsResult obsRes : obsResults) {
            
            HealthCloudGA__EhrObservation__c observation = new HealthCloudGA__EhrObservation__c();
            observation.HealthCloudGA__Account__c = obsRes.acctId;
            observation.Type__c = 'Lab Result';
            observation.Data_Warehouse_Key__c = obsRes.effectiveDateTime;
            //observation.HealthCloudGA__ValuePeriodStartDate__c = getDateTimeFromString(obsRes.effectiveDateTime);
            observation.HealthCloudGA__Status__c = obsRes.status;
            observation.HealthCloudGA__NameCode__c = obsRes.codeCode;
            observation.HealthCloudGA__NameSystem__c = obsRes.codeSystem;
            observation.HealthCloudGA__NameLabel__c = obsRes.codeDisplay;
            observation.HealthCloudGA__ValueQuantity__c = obsRes.valueValue;
            observation.HealthCloudGA__ValueQuantityUnit__c = obsRes.valueUnit;
            observation.HealthCloudGA__ValueCode__c = obsRes.valueCode;
            observation.HealthCloudGA__ValueLabel__c = obsRes.valueSystem;
            observation.HealthCloudGA__ReferenceRangeLowValue__c = obsRes.refRangeLoVal;
            observation.HealthCloudGA__ReferenceRangeLowUnit__c = obsRes.refRangeLoUnit;
            observation.HealthCloudGA__ReferenceRangeMeaningCode__c = obsRes.refRangeLoCode;
            observation.HealthCloudGA__ReferenceRangeMeaningSystem__c = obsRes.refRangeLoSystem;
            observation.HealthCloudGA__ReferenceRangeHighValue__c = obsRes.refRangeHiVal;
            observation.HealthCloudGA__ReferenceRangeHighUnit__c = obsRes.refRangeHiUnit;
            
            observations.add(observation);
            
        }
        
        insert observations;
    }
    
    private static DateTime getDateTimeFromString(String myDate) {
        
        //myDate = '2016-11-23T00:40:00Z';
		Integer theHour;
		String myHour = myDate.substring(11,13);
        String dayTime;
		if (myHour.compareTo('00') == 0) { 
            myHour = '12';
        } 
        theHour = Integer.valueOf(myHour);
        if (theHour > 12) {
            theHour -= 12;
            dayTime = 'PM';
        }
        else {
            dayTime = 'AM';
        }
        String strHour = String.valueOf(theHour);
        
		String newDate = myDate.substring(5,7) + '/' + myDate.substring(8,10) + '/' + myDate.substring(0,4) + ' ' + strHour + ':' + myDate.substring(14,16) + ' AM';
		DateTime theDate = DateTime.parse(newDate);
        
        return theDate;
    }
    
    private static void parseObservation(XmlStreamReader fhirObs, ObsResult obsRes) {
        String localName;
        
        String effectiveDate;
        String status;
        
        while (fhirObs.hasNext()) {
            fhirObs.next();
            
            if (fhirObs.getEventType() == XmlTag.START_ELEMENT) {
                localName = fhirObs.getLocalName();
                if (localName.compareTo('effectiveDateTime') == 0) {
                    obsRes.effectiveDateTime = fhirObs.getAttributeValueAt(0);
                }
                else if (localName.compareTo('status') == 0 ) {
                    obsRes.status = fhirObs.getAttributeValueAt(0);
                }
                else if (localName.compareTo('valueString') == 0) {
                    // This is an observation that doesn't return a value in a valueQuantity
                    // or valueRatio block.  It returns a string, like 'Positive' or 'Negative'
                    obsRes.valueValue = fhirObs.getAttributeValueAt(0);
                }
                else if (localName.compareTo('code') == 0) {
                    // we're in a code block
                    parseObservationCodeBlock(fhirObs, obsRes);
                }
                else if (localName.compareTo('valueQuantity') == 0) {
                    parseObservationValueBlock(fhirObs, obsRes);
                }
                else if (localName.compareTo('referenceRange') == 0) {
                    parseRefRangeBlock(fhirObs, obsRes);
                }
            }
            else if (fhirObs.getEventType() == XmlTag.END_ELEMENT && fhirObs.getLocalName().compareTo('Observation') == 0) {
                    break;
            }
        }
    }
    
    private static void parseRefRangeBlock(XMLStreamReader fhirRefRange, ObsResult obsRes) {
        
        String localName;
        
        while (fhirRefRange.hasNext()) {
            fhirRefRange.next();
            if (fhirRefRange.getEventType() == XmlTag.END_ELEMENT && fhirRefRange.getLocalName().compareTo('referenceRange') == 0) {
                break;                
            }
            else if (fhirRefRange.getEventType() == XmlTag.START_ELEMENT) {
                localName = fhirRefRange.getLocalName();
                if (localName.compareTo('low') == 0) {
                    // now we're in the low range.
                    while (fhirRefRange.hasNext()) {
                        fhirRefRange.next();
                        if (fhirRefRange.getEventType() == XmlTag.START_ELEMENT) {
                            if (fhirRefRange.getLocalName().compareTo('value') == 0) {
                                obsRes.refRangeLoVal = fhirRefRange.getAttributeValueAt(0);
                            } else if (fhirRefRange.getLocalName().compareTo('unit') == 0) {
                                obsRes.refRangeLoUnit = fhirRefRange.getAttributeValueAt(0);
                            } else if (fhirRefRange.getLocalName().compareTo('code') == 0) {
                                obsRes.refRangeLoCode = fhirRefRange.getAttributeValueAt(0);
                            } else if (fhirRefRange.getLocalName().compareTo('system') == 0) {
                                obsRes.refRangeLoSystem = fhirRefRange.getAttributeValueAt(0);
                            }
                        }
                        else if (fhirRefRange.getEventType() == XmlTag.END_ELEMENT && fhirRefRange.getLocalName().compareTo('low') == 0) {
                            System.debug('Ref range low: value: ' + obsRes.refRangeLoVal);
                            System.debug('Ref range low: unit: ' + obsRes.refRangeLoUnit);
                            System.debug('Ref range low: code: ' + obsRes.refRangeLoCode);
                            System.debug('Ref range low: system: ' + obsRes.refRangeLoSystem);
                            break;
                        }
                    }
                } else if (localName.compareTo('high') == 0) {
                    // now we're in the high range.
                    while (fhirRefRange.hasNext()) {
                        fhirRefRange.next();
                        if (fhirRefRange.getEventType() == XmlTag.START_ELEMENT) {
                            if (fhirRefRange.getLocalName().compareTo('value') == 0) {
                                obsRes.refRangeHiVal = fhirRefRange.getAttributeValueAt(0);
                            } else if (fhirRefRange.getLocalName().compareTo('unit') == 0) {
                                obsRes.refRangeHiUnit = fhirRefRange.getAttributeValueAt(0);
                            } else if (fhirRefRange.getLocalName().compareTo('code') == 0) {
                                obsRes.refRangeHiCode = fhirRefRange.getAttributeValueAt(0);
                            } else if (fhirRefRange.getLocalName().compareTo('system') == 0) {
                                obsRes.refRangeHiSystem = fhirRefRange.getAttributeValueAt(0);
                            }
                        }
                        else if (fhirRefRange.getEventType() == XmlTag.END_ELEMENT && fhirRefRange.getLocalName().compareTo('high') == 0) {
                            System.debug('Ref range high: value: ' + obsRes.refRangeHiVal);
                            System.debug('Ref range high: unit: ' + obsRes.refRangeHiUnit);
                            System.debug('Ref range high: code: ' + obsRes.refRangeHiCode);
                            System.debug('Ref range high: system: ' + obsRes.refRangeHiSystem);
                            break;
                        }
                    }
                }
                   
            }
        }
    }
    
    private static void parseObservationCodeBlock(XMLStreamReader fhirCode, ObsResult obsRes) {
        
        String localName;

        while (fhirCode.hasNext()) {
            fhirCode.next();
            //System.debug('At LocalName: ' + localName);
            if (fhirCode.getEventType() == XmlTag.END_ELEMENT && fhirCode.getLocalName().compareTo('code') == 0) {
                break;
            }
            else if (fhirCode.getEventType() == XmlTag.START_ELEMENT) {
                localName = fhirCode.getLocalName();
                if (localName.compareTo('coding') == 0) {
                    parseCoding(fhirCode, obsRes);
                	//System.debug('done with Coding block');
                    break;
                }
            } 
        }
        
    }
    
    private static void parseObservationValueBlock(XMLStreamReader fhirValue, ObsResult obsRes) {
        String localName;

        while (fhirValue.hasNext()) {
            fhirValue.next();
            //System.debug('At LocalName: ' + localName);
            if (fhirValue.getEventType() == XmlTag.END_ELEMENT && fhirValue.getLocalName().compareTo('valueQuantity') == 0) {
                System.debug('value: ' + obsRes.valueValue + ';  unit: ' + obsRes.valueUnit + ';  code: ' + obsRes.valueCode + ';  system: ' + obsRes.valueSystem);
                break;
            }
            else if (fhirValue.getEventType() == XmlTag.START_ELEMENT) {
                localName = fhirValue.getLocalName();
                if (localName.compareTo('value') == 0) {
					obsRes.valueValue=fhirValue.getAttributeValueAt(0);
                }
                else if (localName.compareTo('unit') == 0) {
					obsRes.valueUnit=fhirValue.getAttributeValueAt(0);
                    
                }
                else if (localName.compareTo('code') == 0) {
					obsRes.valueCode=fhirValue.getAttributeValueAt(0);
                    
                }
                else if (localName.compareTo('system') == 0) {
					obsRes.valueSystem=fhirValue.getAttributeValueAt(0);
                    
                }
            }
        }
        
    }
    
    private static void parseCoding(XmlStreamReader fhirCoding, ObsResult obsRes) {
        //System.debug('Parsing Coding');
        String localName;

        while (fhirCoding.hasNext()) {
            fhirCoding.next();
            //System.debug('At LocalName: ' + localName);
            if (fhirCoding.getEventType() == XmlTag.END_ELEMENT && fhirCoding.getLocalName().compareTo('coding') == 0) {
                //System.debug('done with Coding block');
                System.debug('Coding system: ' + obsRes.codeSystem + ';  Code: ' + obsRes.codeCode + ';  Code Name: ' + obsRes.codeDisplay);
                break;
            }
            else if (fhirCoding.getEventType() == XmlTag.START_ELEMENT) {
                localName = fhirCoding.getLocalName();
                if (localName.compareTo('system') == 0) {
                    //System.debug('Got coding system');
                    obsRes.codeSystem = fhirCoding.getAttributeValueAt(0);
                }
                else if (localName.compareTo('code') == 0) {
                    //System.debug('Got code value');
                    obsRes.codeCode = fhirCoding.getAttributeValueAt(0);
                }
                else if (localName.compareTo('display') == 0) {
                    //System.debug('Got display value');
                    obsRes.codeDisplay = fhirCoding.getAttributeValueAt(0);
                }
            } 
        }
    }
    
    private static void deletePatientObservations(String acctId) {
        List<HealthCloudGA__EhrObservation__c> obs = [SELECT Id FROM HealthCloudGA__EhrObservation__c WHERE HealthCloudGA__Account__c = :acctId];
    	delete obs;
    }
}