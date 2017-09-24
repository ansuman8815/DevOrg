/**
	@Author      :	Cognizant Technology Solutions
	@name        :	P360CommunityHelpPageControllerTest
	@CreateDate  :	27/03/2017
	@Description :  Test class to validate Help and FAQ content on P360 Community 
	@Version     :	1.0
*/
@isTest(SeeAllData = false)
public class P360CommunityHelpPageControllerTest {
    static testMethod void validategetFAQs() {
        FAQ__c faq1 = new FAQ__c(Question__c='What is Patient 360?',Answer__c='Patient 360 is a simple, web-based tool that makes available a patient’s longitudinal record to MSPPS partners across the spectrum of a patient’s care.',    Sequence__c=1);
        insert faq1;
        
        FAQ__c faq2 = new FAQ__c(Question__c='What is Patient Clinical Notes?',Answer__c='Patient Clinical notes provide all required details of illness from which patient is suffering.', Sequence__c=2);
        insert faq2;
        
        test.startTest();
        List<FAQ__c> lstfaq =  P360CommunityHelpPageController.getFAQs();
        System.assertEquals('What is Patient 360?', lstfaq[0].Question__c);
        System.assertEquals('Patient 360 is a simple, web-based tool that makes available a patient’s longitudinal record to MSPPS partners across the spectrum of a patient’s care.', lstfaq[0].Answer__c);
        
        System.assertEquals('What is Patient Clinical Notes?', lstfaq[1].Question__c);
        System.assertEquals('Patient Clinical notes provide all required details of illness from which patient is suffering.', lstfaq[1].Answer__c);
        test.stopTest();
    }
    
    static testMethod void validateupdateUserSession(){
        test.startTest();
        P360CommunityHelpPageController.updateUserSession('Patient Search Result', 'fname', 'lname', 'cin', '10/10/2000', 'F','');
        List<User_Session__c> lstUserSession=[SELECT Id, Current_Page__c, First_Name__c, Last_Name__c, CIN__c, Gender__c, DOB__c FROM User_Session__c order by LastModifiedDate desc];
		System.assertEquals( lstUserSession[0].Current_Page__c, 'Patient Search Result');
		test.stopTest();
    }
    static testMethod void validategetLoggedInUserProfile(){
        test.startTest();
        P360CommunityHelpPageController.getLoggedInUserProfile();
        User loggedinUser = [SELECT profileId FROM User WHERE Id =: UserInfo.getUserId() LIMIT 1];
        Profile profileData = [SELECT name FROM Profile WHERE Id = :loggedinUser.profileId LIMIT 1];
        String usrProfileName = [select u.Profile.Name from User u where u.id = :Userinfo.getUserId() LIMIT 1].Profile.Name;
        String profileName = profileData.name;
        System.assertEquals(usrProfileName, profileName);
        test.stopTest(); 
    }
}