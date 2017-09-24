/**
	@Author      :	Cognizant Technology Solutions
	@name        :	patientProfilePageController
	@CreateDate  :  23/01/2017
	@Description :  To redirect the patient profile Page
	@Version     :  1.0
*/
public class patientProfilePageController {
    public string accId {get;set;}
    /**
	*  Description of the purpose of the class's method. 
	*  @name	:	redirect
	*  @return  :	PageReference
	*  @purpose :	To redirect the patient profile Page.
	*/
    public PageReference redirect() { 
        accId = ApexPages.currentPage().getParameters().get('id');
        return null;
    }
}