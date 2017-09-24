/**
	@Author      :   Cognizant Technology Solutions
	@name        :   ProfileMenuController
	@CreateDate  :   24/02/2017
	@Description :   All user related info is fetched using this class 
	@Version     :   1.0
*/
public class ProfileMenuController {
    /**
	*  Description of the purpose of the class's method. 
	*  @name    : getLoggedInUser
	*  @return  : loggedinUser[Current loggedin User details will be returned]
	*  @purpose : Method used to get logged in user details.
	*/
    @AuraEnabled
    public static User getLoggedInUser(){
        User loggedinUser = [SELECT Id, Name,FirstName, LastName, LastLoginDate FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1];
        return loggedinUser; 
    }
    
    /**
	*  Description of the purpose of the class's method. 
	*  @name    : checkPatientConsentForCurrentUser
	*  @param   : 1. Accid :   Captures the value for Patient Id
	*  @return  : boolean
	*  @purpose : Method to check patient has access to organization data.
	*/
     @AuraEnabled
    public static boolean checkPatientConsentForCurrentUser(Id Accid, String Empi){
        System.debug('Accid'+Accid+'Empi'+Empi);
        PatientSearchController.checkPatientsConsentForCurrentUser(Accid);
        return PatientSearchController.mapAccountidConsentFlag.get(Empi);
    }  
    
    /**
	*  Description of the purpose of the class's method. 
	*  @name    : checkIfAnnouncementRead
	*  @return  : boolean
	*  @purpose : If user read the announcement then it sets the isReadAnnouncementPage value to true.
	*/
    @AuraEnabled
    public static boolean checkIfAnnouncementRead()
    {
        AnnouncementInfo__c info = AnnouncementInfo__c.getValues('Release Date');
        System.debug('info in apex'+info);
        if (info != null){
            DateTime releaseDate = info.Value__c;
            List<User> lstuser = [Select AnnouncementVisitDate__c from User where Id = :UserInfo.getUserId() LIMIT 1];
            if(!lstuser.isEmpty()){
                return (releaseDate < lstuser[0].AnnouncementVisitDate__c);
            }
        }
        return false; 
    }
    
    /**
	*  Description of the purpose of the class's method. 
	*  @name    : getLoggedInUserProfile
	*  @return  : profileName
	*  @purpose : To get current logged in profileName.
	*/
    @AuraEnabled
    public static String getLoggedInUserProfile(){
        String profileName;
        User loggedinUser = [SELECT profileId FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1];
        system.debug('Profile id >>>' + loggedinUser.profileId);
        if(loggedinUser.profileId != null)
        {
            Profile profileData = [SELECT name FROM Profile WHERE Id = :loggedinUser.profileId LIMIT 1];
            profileName = profileData.name;
        }
        return profileName; 
    }
    
    /**
	*  Description of the purpose of the class's method. 
	*  @name    : getLandingPage
	*  @return  : userSessionWrapper
	*  @purpose : To get user to previous page on press of go back icon in P360 Community UI .
	*/
    @AuraEnabled
    public static userSessionWrapper getLandingPage(){
        userSessionWrapper userSessionWrapperData;
        String Landingpage= '';
        String EncounterId= '';
        String pageName= '';
        String urlParam= '';
        String profileName = getLoggedInUserProfile();
        System.debug('profileName'+profileName);
        if(profileName == 'System Administrator')
            profileName = 'Clinical Access';
        System.debug('profileName11 : '+profileName);
        List<User_Session__c> lstUserSession = [SELECT Current_Page__c,Encounter_Id__c,First_Name__c,Last_Name__c,CIN__c,DOB__c,Gender__c FROM User_Session__c WHERE user__c = :UserInfo.getUserId() LIMIT 1];
        if(lstUserSession.size() > 0){
            List<BackNavigation__c> lstBackNav = BackNavigation__c.getall().values();
            
            for(BackNavigation__c backNav : lstBackNav ){
                if(profileName == backNav.Profile__c  && backNav.Current_Page__c == lstUserSession[0].Current_Page__c){
                    Landingpage = backNav.Landing_page__c;
                    pageName = backNav.pageName__c;
                    EncounterId = lstUserSession[0].Encounter_Id__c;
                    System.debug('EncounterId'+EncounterId);
                    if(backNav.hasURLParam__c){
                        if(lstUserSession[0].First_Name__c != '' && lstUserSession[0].First_Name__c != null)
                            urlParam = 'fn='+lstUserSession[0].First_Name__c;
                        if(lstUserSession[0].Last_Name__c != '' && lstUserSession[0].Last_Name__c != null){
                            if(urlParam !='') urlParam += '&ln='+lstUserSession[0].Last_Name__c;
                            else urlParam = 'ln='+lstUserSession[0].Last_Name__c;
                        }
                        if(lstUserSession[0].CIN__c != '' && lstUserSession[0].CIN__c != null){
                            if(urlParam !='') urlParam += '&cin='+lstUserSession[0].CIN__c;
                            else urlParam = 'cin='+lstUserSession[0].CIN__c;
                        }  
                        if(lstUserSession[0].Gender__c != '' && lstUserSession[0].Gender__c != null){
                            if(urlParam !='') urlParam += '&gn='+lstUserSession[0].Gender__c;
                            else urlParam = 'gn='+lstUserSession[0].Gender__c;
                        }
                        if(lstUserSession[0].DOB__c != '' && lstUserSession[0].DOB__c != null){
                            if(urlParam !='') urlParam += '&dob='+lstUserSession[0].DOB__c;
                            else urlParam = 'dob='+lstUserSession[0].DOB__c;
                        }
                    }
                }
            }
          
            userSessionWrapperData = new userSessionWrapper(Landingpage , pageName , urlParam , EncounterId);
              System.debug('userSessionWrapperData'+userSessionWrapperData);
        }
        return userSessionWrapperData;
    }
    
    /**
	*  Description of the purpose of the class's method. 
	*  @name    : userSessionWrapper
	*  @param   :
	1. landingPage    :   Captures the value for landing page
	2. pageName		  :   Captures the value for PageName
	3. urlParam       :   Captures the value for url where it should be redirected            
	*/
    public class userSessionWrapper{
        @AuraEnabled public String landingPage;
        @AuraEnabled public String pageName;
        @AuraEnabled public String urlParam;
        @AuraEnabled public String EncounterId;
        public userSessionWrapper(String landingPage , String pageName, String urlParam, String EncounterId){
            this.landingPage = landingPage;
            this.pageName = pageName;
            this.urlParam = urlParam;
            this.EncounterId = EncounterId;
        }
    }
    
    /**
	*  Description of the purpose of the class's method. 
	*  @name    : updateUserRecord
	*  @return  : lstUser
	*  @purpose : We user clicks on Announcement icon in P360 Community Ui the user object should be updated So that
				  that notification should not be displayed.
	*/
    @AuraEnabled 
    public static void updateUserRecord (){
        String userId=UserInfo.getUserId();
        List<User> lstUser=[SELECT AnnouncementVisitDate__c FROM User where Id=:userId limit 1];
        if(!lstUser.isEmpty())
        {
            lstUser[0].AnnouncementVisitDate__c=System.now();
        }
        update lstUser;  
    }
    /**
    *  Description of the purpose of the class's method. 
    *  @name    : getRefreshDate
    *  @return  : refreshData[Returns the wrapper datarefreshdate and P360ReleaseDate from custom setting]
    *  @purpose : Method used to fetch the data from custom setting.
    */
    @AuraEnabled
    public static  RefreshData getRefreshDate(){
        String dataRefreshDate;
        String dataP360Date;
        ETL_Refresh_Date__c dataRefreshObj = ETL_Refresh_Date__c.getValues(UtilityData.labelLastRefreshDate);
        if(dataRefreshObj != null && dataRefreshObj.Refresh_Datetime__c != null)
            dataRefreshDate = string.valueof(dataRefreshObj.Refresh_Datetime__c.format('MMMM dd, yyyy')); 
        
        ETL_Refresh_Date__c dataP360Obj = ETL_Refresh_Date__c.getValues(UtilityData.labelP360ReleaseDate);
        if(dataP360Obj != null && dataP360Obj.Refresh_Datetime__c != null)
            dataP360Date = string.valueof(dataP360Obj.Refresh_Datetime__c.format('MMMM dd, yyyy'));
        
        RefreshData refreshData=new RefreshData(dataRefreshDate,dataP360Date); 	
        return refreshData;
    }
    /**
    *  Description of the purpose of the class's method. 
    *  @name    : RefreshData
    *  @purpose : Wrapper Class to pass the values.
    */
    public class RefreshData{
        @AuraEnabled public String dataRefreshDate;
        @AuraEnabled public String dataP360Date;
        public RefreshData(String dataRefreshDate , String dataP360Date){
            this.dataRefreshDate = dataRefreshDate;
            this.dataP360Date    = dataP360Date;
        }
    }
}