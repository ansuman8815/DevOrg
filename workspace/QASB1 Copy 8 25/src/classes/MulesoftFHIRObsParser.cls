public class MulesoftFHIRObsParser {
    /*
    private System.JSONParser parser;
    private Id patientId;
    private String service;
    
    public String resourceType {get;set;} 
    public String type_Z {get;set;} // in json: type
    public List<Link> link {get;set;} 
    public Meta meta {get;set;} 
    public List<Entry> entry {get;set;} 

    public MulesoftFHIRObsParser() {
        // Do-nothing constructor
    }
    
    public void parseResponse(String theService, Id accountId, String response, FHIRQueryResults fqResults) {
        
        service = theService;
        parser = System.JSON.createParser(response);
        patientId = accountId;
        
        while (parser.nextToken() != JSONToken.END_OBJECT) {
            if (parser.getCurrentToken() == JSONToken.FIELD_NAME) {
                String text = parser.getText();
                if (parser.nextToken() != JSONToken.VALUE_NULL) {
                    if (text == 'resourceType') {
                        resourceType = parser.getText();
                    } else if (text == 'type') {
                        type_Z = parser.getText();
                    } else if (text == 'link') {
                        link = new List<Link>();
                        while (parser.nextToken() != JSONToken.END_ARRAY) {
                            link.add(new Link(parser));
                        }
                    } else if (text == 'meta') {
                        meta = new Meta(parser);
                    } else if (text == 'entry') {
                        entry = new List<Entry>();
                        while (parser.nextToken() != JSONToken.END_ARRAY) {
                            entry.add(new Entry(parser));
                        }
                    } else {
                        //System.debug(LoggingLevel.WARN, 'MulesoftFHIRObservationParser consuming unrecognized property: '+text);
                        consumeObject(parser);
                    }
                }
            }
        }
        
        buildSFRecords(fqResults);
    }
    
    public static void consumeObject(JSONParser parser) {
        Integer depth = 0;
        do {
            JSONToken curr = parser.getCurrentToken();
            if (curr == JSONToken.START_OBJECT || 
                curr == JSONToken.START_ARRAY) {
                depth++;
            } else if (curr == JSONToken.END_OBJECT ||
                curr == JSONToken.END_ARRAY) {
                depth--;
            }
        } while (depth > 0 && parser.nextToken() != null);
    }
    
    public class Category {
        public List<Coding> coding {get;set;} 

        public Category(JSONParser parser) {
            while (parser.nextToken() != JSONToken.END_OBJECT) {
                if (parser.getCurrentToken() == JSONToken.FIELD_NAME) {
                    String text = parser.getText();
                    if (parser.nextToken() != JSONToken.VALUE_NULL) {
                        if (text == 'coding') {
                            coding = new List<Coding>();
                            while (parser.nextToken() != JSONToken.END_ARRAY) {
                                coding.add(new Coding(parser));
                            }
                        } else {
                            //System.debug(LoggingLevel.WARN, 'Code consuming unrecognized property: '+text);
                            consumeObject(parser);
                        }
                    }
                }
            }
        }
        
    }

    public class Meta {
        public String lastUpdated {get;set;} 

        public Meta(JSONParser parser) {
            while (parser.nextToken() != JSONToken.END_OBJECT) {
                if (parser.getCurrentToken() == JSONToken.FIELD_NAME) {
                    String text = parser.getText();
                    if (parser.nextToken() != JSONToken.VALUE_NULL) {
                        if (text == 'lastUpdated') {
                            lastUpdated = parser.getText();
                        } else {
                            //System.debug(LoggingLevel.WARN, 'Meta consuming unrecognized property: '+text);
                            consumeObject(parser);
                        }
                    }
                }
            }
        }
    }
    
    public class Assigner {
        public String display {get;set;}
        public Assigner(JSONParser parser) {
            while (parser.nextToken() != JSONToken.END_OBJECT) {
                if (parser.getCurrentToken() == JSONToken.FIELD_NAME) {
                    String text = parser.getText();
                    if (parser.nextToken() != JSONToken.VALUE_NULL) {
                        if (text == 'display') {
                            display = parser.getText();
                        }else {
                            //System.debug(LoggingLevel.WARN, 'Assigner consuming unrecognized property: '+text);
                            consumeObject(parser);
                        }
                    }
                }
            }
        }
    }
    public class Identifier {
        public String value {get;set;}
        public Assigner assigner {get;set;}
        
        public Identifier(JSONParser parser) {
            while (parser.nextToken() != JSONToken.END_OBJECT) {
                if (parser.getCurrentToken() == JSONToken.FIELD_NAME) {
                    String text = parser.getText();
                    if (parser.nextToken() != JSONToken.VALUE_NULL) {
                        if (text == 'value') {
                            value = parser.getText();
                        } else if (text == 'assigner') {
                            assigner = new Assigner(parser);
                        } else {
                            //System.debug(LoggingLevel.WARN, 'Entry consuming unrecognized property: '+text);
                            consumeObject(parser);
                        }
                    }
                }
            }  
        }
    }
    
    public class Entry {
        public String resourceType {get;set;} 
        public String id {get;set;} 
        public String status {get;set;}
        public List<Category> category {get;set;}
        public List<Identifier> identifiers {get;set;}
        public Code code {get;set;} 
        public Subject subject {get;set;} 
        public Subject encounter {get;set;} 
        public ValueQuantity valueQuantity {get;set;} 
        public List<ReferenceRange> referenceRange {get;set;} 
        public Value value {get;set;}

        public Entry(JSONParser parser) {
            while (parser.nextToken() != JSONToken.END_OBJECT) {
                if (parser.getCurrentToken() == JSONToken.FIELD_NAME) {
                    String text = parser.getText();
                    if (parser.nextToken() != JSONToken.VALUE_NULL) {
                        if (text == 'resourceType') {
                            resourceType = parser.getText();
                        } else if (text == 'id') {
                            id = parser.getText();
                        } else if (text == 'status') {
                            status = parser.getText();
                        } else if (text == 'category') {
                            category = new List<Category>();
                            while (parser.nextToken() != JSONToken.END_ARRAY) {
                                category.add(new Category(parser));
                            }
                        } else if (text == 'code') {
                            code = new Code(parser);
                        } else if (text == 'subject') {
                            subject = new Subject(parser);
                        } else if (text == 'value') {
                            value = new Value(parser);
                        } else if (text == 'encounter') {
                            encounter = new Subject(parser);
                        } else if (text == 'valueQuantity') {
                            valueQuantity = new ValueQuantity(parser);
                        } else if (text == 'referenceRange') {
                            referenceRange = new List<ReferenceRange>();
                            while (parser.nextToken() != JSONToken.END_ARRAY) {
                                referenceRange.add(new ReferenceRange(parser));
                            }
                        } else if (text == 'identifier') {
                            identifiers = new List<Identifier>();
                            while (parser.nextToken() != JSONToken.END_ARRAY) {
                                identifiers.add(new Identifier(parser));
                            }
                        } else {
                            //System.debug(LoggingLevel.WARN, 'Entry consuming unrecognized property: '+text);
                            consumeObject(parser);
                        }
                    }
                }
            }
        }
    }
    
    public class Low {
        public String value {get;set;} 
        public String unit {get;set;} 

        public Low(JSONParser parser) {
            while (parser.nextToken() != JSONToken.END_OBJECT) {
                if (parser.getCurrentToken() == JSONToken.FIELD_NAME) {
                    String text = parser.getText();
                    if (parser.nextToken() != JSONToken.VALUE_NULL) {
                        if (text == 'value') {
                            value = parser.getText();
                        } else if (text == 'unit') {
                            unit = parser.getText();
                        } else {
                            //System.debug(LoggingLevel.WARN, 'Low consuming unrecognized property: '+text);
                            consumeObject(parser);
                        }
                    }
                }
            }
        }
    }
    
    public class High {
        public String value {get;set;} 
        public String unit {get;set;} 

        public High(JSONParser parser) {
            while (parser.nextToken() != JSONToken.END_OBJECT) {
                if (parser.getCurrentToken() == JSONToken.FIELD_NAME) {
                    String text = parser.getText();
                    if (parser.nextToken() != JSONToken.VALUE_NULL) {
                        if (text == 'value') {
                            value = parser.getText();
                        } else if (text == 'unit') {
                            unit = parser.getText();
                        } else {
                            //System.debug(LoggingLevel.WARN, 'High consuming unrecognized property: '+text);
                            consumeObject(parser);
                        }
                    }
                }
            }
        }
    }
    
    public class Coding {
        public String system_Z {get;set;} // in json: system
        public String code {get;set;} 
        public String display {get;set;} 

        public Coding(JSONParser parser) {
            while (parser.nextToken() != JSONToken.END_OBJECT) {
                if (parser.getCurrentToken() == JSONToken.FIELD_NAME) {
                    String text = parser.getText();
                    if (parser.nextToken() != JSONToken.VALUE_NULL) {
                        if (text == 'system') {
                            system_Z = parser.getText();
                        } else if (text == 'code') {
                            code = parser.getText();
                        } else if (text == 'display') {
                            display = parser.getText();
                        } else {
                            //System.debug(LoggingLevel.WARN, 'Coding consuming unrecognized property: '+text);
                            consumeObject(parser);
                        }
                    }
                }
            }
        }
    }
    
    public class ReferenceRange {
        public High high {get;set;} 
        public Low low {get;set;} 

        public ReferenceRange(JSONParser parser) {
            while (parser.nextToken() != JSONToken.END_OBJECT) {
                if (parser.getCurrentToken() == JSONToken.FIELD_NAME) {
                    String text = parser.getText();
                    if (parser.nextToken() != JSONToken.VALUE_NULL) {
                        if (text == 'high') {
                            high = new High(parser);
                        } else if (text == 'low') {
                            low = new Low(parser);
                        } else {
                            //System.debug(LoggingLevel.WARN, 'ReferenceRange consuming unrecognized property: '+text);
                            consumeObject(parser);
                        }
                    }
                }
            }
        }
    }
    
    public class Code {
        public List<Coding> coding {get;set;} 

        public Code(JSONParser parser) {
            while (parser.nextToken() != JSONToken.END_OBJECT) {
                if (parser.getCurrentToken() == JSONToken.FIELD_NAME) {
                    String text = parser.getText();
                    if (parser.nextToken() != JSONToken.VALUE_NULL) {
                        if (text == 'coding') {
                            coding = new List<Coding>();
                            while (parser.nextToken() != JSONToken.END_ARRAY) {
                                coding.add(new Coding(parser));
                            }
                        } else {
                            //System.debug(LoggingLevel.WARN, 'Code consuming unrecognized property: '+text);
                            consumeObject(parser);
                        }
                    }
                }
            }
        }
    }
    
    public class Link {
        public String relation {get;set;} 
        public String url {get;set;} 

        public Link(JSONParser parser) {
            while (parser.nextToken() != JSONToken.END_OBJECT) {
                if (parser.getCurrentToken() == JSONToken.FIELD_NAME) {
                    String text = parser.getText();
                    if (parser.nextToken() != JSONToken.VALUE_NULL) {
                        if (text == 'relation') {
                            relation = parser.getText();
                        } else if (text == 'url') {
                            url = parser.getText();
                        } else {
                            //System.debug(LoggingLevel.WARN, 'Link consuming unrecognized property: '+text);
                            consumeObject(parser);
                        }
                    }
                }
            }
        }
    }
    
    public class Subject {
        public String reference {get;set;} 

        public Subject(JSONParser parser) {
            while (parser.nextToken() != JSONToken.END_OBJECT) {
                if (parser.getCurrentToken() == JSONToken.FIELD_NAME) {
                    String text = parser.getText();
                    if (parser.nextToken() != JSONToken.VALUE_NULL) {
                        if (text == 'reference') {
                            reference = parser.getText();
                        } else {
                            //System.debug(LoggingLevel.WARN, 'Subject consuming unrecognized property: '+text);
                            consumeObject(parser);
                        }
                    }
                }
            }
        }
    }
    
    public class Value {
        public String valueDateTime {get;set;}
        public ValueQuantity valueQuantity {get;set;}
        
        public Value(JSONParser parser) {
            while (parser.nextToken() != JSONToken.END_OBJECT) {
                if (parser.getCurrentToken() == JSONToken.FIELD_NAME) {
                    String text = parser.getText();
                    if (parser.nextToken() != JSONToken.VALUE_NULL) {
                        if (text == 'valueDateTime') {
                            valueDateTime = parser.getText();
                        } else if (text == 'valueQuantity') {
                            valueQuantity = new ValueQuantity(parser);
                        } else {
                            //System.debug(LoggingLevel.WARN, 'Value consuming unrecognized property: '+text);
                            consumeObject(parser);
                        }
                    }
                }
            }
        }
    }
    
    public class ValueQuantity {
        public String value {get;set;} 
        public String unit {get;set;} 

        public ValueQuantity(JSONParser parser) {
            while (parser.nextToken() != JSONToken.END_OBJECT) {
                if (parser.getCurrentToken() == JSONToken.FIELD_NAME) {
                    String text = parser.getText();
                    if (parser.nextToken() != JSONToken.VALUE_NULL) {
                        if (text == 'value') {
                            value = parser.getText();
                        } else if (text == 'unit') {
                            unit = parser.getText();
                        } else {
                            //System.debug(LoggingLevel.WARN, 'ValueQuantity consuming unrecognized property: '+text);
                            consumeObject(parser);
                        }
                    }
                }
            }
        }
    }
    
    private void buildSFRecords(FHIRQueryResults fqResults) {
            
        List<HealthCloudGA__EhrObservation__c> obsRecs = new List<HealthCloudGA__EhrObservation__c>();
        
        for (Integer i=0; i<entry.size(); i++) {
            //System.debug('Adding lab result for patient ' + patientId + ': ' + entry[i].code.coding[0].display);
            HealthCloudGA__EhrObservation__c observation = new HealthCloudGA__EhrObservation__c();
            // Lookup EhrEncounter.Id based on SourceSystemId__c;
            //Id encounterId = lookupEncounter(entry[i].id);
            //if (encounterId != null) {
              //  observation.Encounter__c = encounterId;
            //}
            //
            // store the Encounter ID in the Data Warehouse Key field:
            observation.Data_Warehouse_Key__c = entry[i].id;
            observation.HealthCloudGA__Account__c = patientId;
            observation.HealthCloudGA__SourceSystemId__c = entry[i].id;
            observation.HealthCloudGA__SourceSystem__c = entry[i].status;
            observation.HealthCloudGA__NameCode__c = entry[i].code.coding[0].code;
            observation.HealthCloudGA__NameSystem__c = entry[i].code.coding[0].system_Z;
            observation.HealthCloudGA__NameLabel__c = entry[i].code.coding[0].display;
            // Fix this here.  ValuePeriodStartDate__c is a DateTime, not a String
            DateTime resultDateTime = StringUtil.getDTFromString(entry[i].value.valueDateTime);
            observation.HealthCloudGA__ValuePeriodStartDate__c = resultDateTime;
            // Need to handle values that are > 254 characters:
            if (entry[i].value.valueQuantity.value.length() > 254) {
                observation.HealthCloudGA__ValueQuantity__c = entry[i].value.valueQuantity.value.left(250) + '...';
                observation.HealthCloudGA__Comments__c = entry[i].value.valueQuantity.value;
            } else {
                observation.HealthCloudGA__ValueQuantity__c = entry[i].value.valueQuantity.value;
            }
            observation.HealthCloudGA__ValueQuantityUnit__c = entry[i].value.valueQuantity.unit;
            observation.HealthCloudGA__ReferenceRangeHighValue__c = entry[i].referenceRange[0].high.value;
            observation.HealthCloudGA__ReferenceRangeLowValue__c = entry[i].referenceRange[0].low.value;
            observation.Type__c = 'Lab Result';
            obsRecs.add(observation);
        }
        
        // FIX THIS HERE:
        // This is only temporary.  Add a record in FHIR_Callout to record the number of rows:
        FHIR_Callout__c calloutLog = new FHIR_Callout__c();
        calloutLog.Endpoint__c = 'Received ' + entry.size() + ' records';
        
        if (entry.size() > 10000) {
            fqResults.addError(service, 'DMLRows', 'ERROR', entry[9999].value.valueDateTime);
        }
        
        try {
            upsert obsRecs HealthCloudGA__SourceSystemId__c;
        } catch (DmlException e) {
            fqResults.addError(service, 'DML', 'ERROR', e.getMessage());
        }
        
        return;
    }
    
    private Id lookupEncounter(String encounterKey) {
        List<HealthCloudGA__EhrEncounter__c> encounter = [SELECT Id FROM HealthCloudGA__EhrEncounter__c WHERE HealthCloudGA__SourceSystemId__c = :encounterKey];
        if (encounter.size() > 0) {
            return encounter[0].Id;
        }
        return null;
    }
    */
}