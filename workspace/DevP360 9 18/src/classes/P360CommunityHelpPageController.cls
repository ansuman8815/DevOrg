/**
	@Author      :	Cognizant Technology Solutions
	@name        :	P360CommunityHelpPageController
	@CreateDate  :  25/03/2017
	@Description :  Displays Help and FAQ content on P360 Community
	@Version     :  1.0
*/
Public with sharing class P360CommunityHelpPageController {
	 /**
	*  Description of the purpose of the class's method. 
	*  @name	:	getFAQs
	*  @return  :	List of faq's
	*  @purpose :	Method used to get FAQ content on P360 Community.
	*/
    @AuraEnabled
    public static List<FAQ__c> getFAQs() {
        List<FAQ__c> faqs = 
                [SELECT Question__c,Answer__c,sequence__c 
                 FROM FAQ__c 
                 ORDER By sequence__c
                 LIMIT 50000];
        return faqs;
    }
	
    /**
	*  Description of the purpose of the class's method. 
	*  @name	:	getLoggedInUserProfile
	*  @return  :	String i.e returns the profileName for current logged in user.
	*  @purpose :	Method to get logged in user details.
	*/
    @AuraEnabled
    public static String getLoggedInUserProfile(){
        String profileName;
        User loggedinUser = [SELECT profileId FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1];
        if(loggedinUser.profileId != null)
        {
            Profile profileData = [SELECT name FROM Profile WHERE Id = :loggedinUser.profileId LIMIT 1];
            profileName = profileData.name;
        }
        return profileName; 
    }
    /**
    *  Description of the purpose of the class's method. 
    *  @name    :	updateUserSession
    *  @param   :	1.	currentPage	:	Captures the value for Patient currentPage
				  	2.	lastName	:	Captures the value for Patient fname
				  	3.	gender		:	Captures the value for Patient lname
				  	4.	cinNo	 	:	Captures the value for Patient cin	
				  	5.	dob	     	:	Captures the value for Patient dob
					6.	gender	    :	Captures the value for Patient gender
					7.	encounterId	:	Captures the value for Patient encounterId
    *  @purpose :	Method to get logged in user session Id.
    */
    @AuraEnabled
    public static void updateUserSession(String currentPage, String fname, String lname, String cin, String dob, String gender,String encounterId){
    	UtilityGeneral.updateUserSession(currentPage, fname, lname, cin, dob, gender,encounterId);
    }
}