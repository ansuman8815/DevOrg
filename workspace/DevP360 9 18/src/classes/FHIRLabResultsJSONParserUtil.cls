public class FHIRLabResultsJSONParserUtil {
    
    public class Observation {
		public String resourceType;
		public String id;
		public String status;
		public Category category;
		public Code code;
		public Subject subject;
		public Encounter encounter;
		public ValueQuantity valueQuantity;
	}

	public class Code {
		List<Coding> codings;
	}

	public class Category {
		List<Coding> codings;
	}

	public class Coding {
		public String xsystem;
		public String code;
		public String display;
	}

	public class Subject {
		public String reference;
	}

	public class Encounter {
		public String reference;
	}

	public class ValueQuantity {
		public String value;
		public String unit;
		public String xsystem;
		public String code;
	}
    
    public static void parseResults(JSONParser parser) {
        
        while (parser.nextToken() != null) {
            if (parser.getCurrentToken() == JSONToken.START_OBJECT) {
                Observation obs = (Observation)parser.readValueAs(Observation.class);
                System.debug(obs.id);
                System.debug(obs.ValueQuantity.value);
                System.debug(obs.ValueQuantity.xsystem);
                parser.skipChildren();
            }
        }
        
    }

}