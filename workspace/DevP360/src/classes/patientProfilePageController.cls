public class patientProfilePageController {
    public string accId {get;set;}
    public PageReference redirect() { 
        accId = ApexPages.currentPage().getParameters().get('id');
        return null;
    }
}