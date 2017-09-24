public interface IFHIRUtil {
    
    String buildEndpoint(Source_System__c src, String resource, String empi, String startDate, String endDate);

}