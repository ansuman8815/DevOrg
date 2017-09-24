/*
Description: Displays Help and FAQ content on P360 Community
Created By : Cognizant Technology Solutions
Create Date: 25/03/2017
*/

Public with sharing class P360CommunityHelpPageController {

    @AuraEnabled
    public static List<FAQ__c> getFAQs() {
        List<FAQ__c> faqs = 
                [SELECT Question__c,Answer__c,sequence__c 
                 FROM FAQ__c 
                 ORDER By sequence__c
                 LIMIT 50000];
        return faqs;
    }

    @AuraEnabled
    // Method to get logged in user details
    public static String getLoggedInUserProfile(){
        String profileName;
        system.debug('User id >>>' + UserInfo.getUserId());
        User loggedinUser = [SELECT profileId FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1];
        system.debug('Profile id >>>' + loggedinUser.profileId);
        if(loggedinUser.profileId != null)
        {
            Profile profileData = [SELECT name FROM Profile WHERE Id = :loggedinUser.profileId LIMIT 1];
            profileName = profileData.name;
        }
        return profileName; 
    }
    
     @AuraEnabled
    // Method to get logged in user session Id
    public static void updateUserSession(String currentPage, String fname, String lname, String cin, String dob, String gender,String encounterId){
    	system.debug('Inside pat seasrch updateUserSession');
        UtilityGeneral.updateUserSession(currentPage, fname, lname, cin, dob, gender,encounterId);
    }
}