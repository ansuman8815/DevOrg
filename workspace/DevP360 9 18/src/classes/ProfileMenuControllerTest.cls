/**
	@Author      :	Cognizant Technology Solutions
	@name        :	ProfileMenuControllerTest
	@CreateDate  :	24/02/2017 
	@Description :  Test Class to validate User Profile data on the basis of logged in user id 
	@Version     :	1.0
*/
@isTest(SeeAllData = false)
private class ProfileMenuControllerTest {
    static testMethod void validategetLoggedInUser() {
        test.startTest();
        User uId = ProfileMenuController.getLoggedInUser();
        system.assertEquals(uId.Id, UserInfo.getUserId());
        test.stopTest();
    }
  
    static testMethod void validategetLoggedInUserProfile(){
        test.startTest();
        ProfileMenuController.getLoggedInUserProfile();
        User loggedinUser = [SELECT profileId FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1];
        Profile profileData = [SELECT name FROM Profile WHERE Id = :loggedinUser.profileId LIMIT 1];
        System.assertEquals(loggedinUser.profileId, profileData.Id);
        test.stopTest();
    }
    
    static testMethod void validategetLandingPage(){
        
        Profile profileId=UtilityTestData.retriveProfile();
        User u = UtilityTestData.createUser(profileId.Id, 'lname', 'puser000@amamama.com', 'puser000@amamama.com' + System.currentTimeMillis(),'TEST','title','alias','America/Los_Angeles','UTF-8', 'en_US', 'en_US',System.now());
        User_Session__c usersession= UtilityTestData.createUserSession('Encounter Details', 'Registery', 'Y', '1212122', '2016,02,10','F', UserInfo.getUserId());
        BackNavigation__c backnavigation= UtilityTestData.createBackNavigation('Reg', 'Clinical Access', 'P360 Landing Page', '/', true, 'Encounter Details');
        test.startTest();
        ProfileMenuController.userSessionWrapper ouserSessionWrapper = ProfileMenuController.getLandingPage();
        System.assertEquals(ouserSessionWrapper.Landingpage, 'P360 Landing Page');
        System.assertEquals(ouserSessionWrapper.pageName , '/');
        System.assertEquals(ouserSessionWrapper.urlParam.contains('Registery'), True);
        test.stopTest();
    }
    static testMethod void validateupdateUserRecord() {
        AnnouncementInfo__c info = new AnnouncementInfo__c();
        DateTime myDateTime = DateTime.newInstance(2001, 7, 19, 10, 7, 12);
        info.Value__c = myDateTime;
        info.Name     = 'Release Date';
        insert info;     
        test.startTest();
        ProfileMenuController.updateUserRecord();
        List<User> lstUser	=	[SELECT AnnouncementVisitDate__c FROM User WHERE Id=:UserInfo.getUserId() LIMIT 1];
        if(!lstUser.isEmpty())
        {
         	System.assertEquals(Date.valueOf(System.now()) , Date.valueOf(lstUser[0].AnnouncementVisitDate__c));
        }
        Boolean isRead = ProfileMenuController.checkIfAnnouncementRead();
        System.assertEquals(isRead,true);
      	test.stopTest();
    }
    
    static testMethod void validatecheckPatientConsentForCurrentUser(){
        Account act =UtilityTestData.createAccount('Shradha', Date.newInstance(2016,02,10), '21217212', 'abc', '121212121', 'EPIC');
        Contact c=new Contact(FirstName='abc',LastName='xyz',AccountId =act.id);
        insert c;
        Boolean patientId=ProfileMenuController.checkPatientConsentForCurrentUser(act.Id,act.EMPI__c);
        System.assertEquals(null, patientId);
    }
    
    static testmethod void validategetRefreshDate(){
        ETL_Refresh_Date__c dataRefreshObj=new ETL_Refresh_Date__c(Name='P360 Release date',Refresh_Datetime__c=Date.newInstance(2017, 07, 30));
    	insert dataRefreshObj;
        
        ETL_Refresh_Date__c dataRefreshObj1=new ETL_Refresh_Date__c(Name='Last_Refresh_Datetime',Refresh_Datetime__c=Date.newInstance(2017, 07, 08));
    	insert dataRefreshObj1;
        
        test.startTest();
        ProfileMenuController.RefreshData refreshData;
        refreshData=ProfileMenuController.getRefreshDate();
        test.stopTest();
        System.assertEquals(refreshData.dataRefreshDate, 'July 07, 2017');
    }
    
}