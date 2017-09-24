/**
	@Author      :	Cognizant Technology Solutions
	@name        :	UtilityTestData
	@CreateDate  :	5/16/201 
	@Description :  Class used to created test data.
	@Version     :	1.0
*/
public class UtilityTestData {
    
    /**
	*  Description of the purpose of the class's method. 
	*  @name    : createAccount
	*  @param   : 1. name  		        :	Captures the name of patient.
				  2. dob  				:	Captures the dob of patient.
				  3. medicaidCin		:	Captures the medicaidCin of patient.
				  4. empi	  		 	:	Captures the empi of patient.
				  5. medicalRecordNumber:	Captures the medicalRecordNumber of patient.
				  6. sourceSystem		:	Captures the sourceSystem of the patient.
				 
	*  @return  : Account
	*  @purpose : Create the account record.
	*/
    public static Account createAccount(String name,Date dob,String medicaidCin,String empi,
                                        String medicalRecordNumber,String sourceSystem)
    {
        Account objact= new Account();
        objact.name=name;
        objact.Date_of_Birth__c=dob;
        objact.Medicaid_CIN__c=medicaidCin;
        objact.EMPI__c=empi;
        objact.HealthCloudGA__MedicalRecordNumber__c=medicalRecordNumber;
        objact.HealthCloudGA__SourceSystem__c=sourceSystem;
        insert objact;
        return objact;
    }
    
    /**
	*  Description of the purpose of the class's method. 
	*  @name    : createUserSession
	*  @param   : 1. currentPage  	:	Captures the current page name.
				  2. fname  		:	Captures the first name.
				  3. lname			:	Captures the last name.
				  4. cin	  		:	Captures the cin number.
				  5. dob			:	Captures the date of birth of patient.
				  6. gender			:	Captures the gender of the patient.
				  7. user  			:	captures the user.
	*  @return  : User_Session__c
	*  @purpose : Create a user session.
	*/
    public static User_Session__c createUserSession(String currentPage,String fname,String lname,String cin,
                                                    String dob,String gender,String user){
        User_Session__c objUsersession=new User_Session__c();
        objUsersession.Current_Page__c=currentPage;
        objUsersession.First_Name__c=fname;
        objUsersession.Last_Name__c=lname;
        objUsersession.CIN__c=cin;
        objUsersession.DOB__c=dob;
        objUsersession.Gender__c=gender;
        objUsersession.User__c=UserInfo.getUserId();
        insert objUsersession;
        return objUsersession;
    }
    
    /**
	*  Description of the purpose of the class's method. 
	*  @name    : createBackNavigation
	*  @param   : 1. name  			:	Captures the current name.
				  2. profile  		:	Captures the profile.
				  3. landingPage	:	Captures the landing page name.
				  4. pageName	  	:	Captures the page name.
				  5. hasUrlParam	:	Captures the the boolean value.
				  6. currentPage	:	Captures the current page of the application.
	*  @return  : BackNavigation__c
	*  @purpose : Create a back navaigation record for the back button.
	*/
    public static BackNavigation__c createBackNavigation(String name,String profile,String landingPage,
                                                         String pageName,Boolean hasUrlParam,String currentPage)
    {
        BackNavigation__c objBackNavigation=new BackNavigation__c();
        objBackNavigation.Name=name;
        objBackNavigation.Profile__c=profile;
        objBackNavigation.Landing_page__c=landingPage;
        objBackNavigation.pageName__c=pageName;
        objBackNavigation.hasURLParam__c=hasUrlParam;
        objBackNavigation.Current_Page__c=currentPage;
        insert objBackNavigation;
        return objBackNavigation;   
    }
    
    /**
	*  Description of the purpose of the class's method. 
	*  @name    : retriveProfile
	*  @return  : Profile
	*  @purpose : Fetches the profile where the name is Administrator.
	*/
    public static Profile retriveProfile(){
        Profile profileobj=[SELECT Id FROM Profile WHERE Name = 'System Administrator'];
        return profileobj;
    }
    
    /**
	*  Description of the purpose of the class's method. 
	*  @name    : createUser
	*  @param   : 1.  profileId  			:	Captures the profileId of the user.
				  2.  lname  				:	Captures the lastname of the user.
				  3.  email					:	Captures the email id of the user.
				  4.  username	  			:	Captures the username of the user.
				  5.  companyname			:	Captures the companyname of user.
				  6.  title					:	Captures the title.
				  7.  alias					:	Captures the alias for the user.
                  8.  timezone				:	Captures the timezone of the user.
                  9.  EmailEncodingKey		:	Captures the EmailEncodingKey.
                  10. languageLocale	    :	Captures the languageLocale.
                  11. localeSidKey			:	Captures the localeSidKey.
                  12. announcementVisitDate	:	Captures the announcementVisitDate.
	*  @return  : User
	*  @purpose : Creates a user record.
	*/
    public static User createUser(ID profileId,String lname,String email,String username,String companyname,
                                  String title,String alias,String timezone,String EmailEncodingKey,
                                  String languageLocale,String localeSidKey,Datetime announcementVisitDate)
    {
        User objuser=new User();
        objuser.ProfileId=profileId;
        objuser.LastName=lname;
        objuser.Email=email;
        objuser.Username=username;
        objuser.CompanyName=companyname;
        objuser.Title=title;
        objuser.Alias=alias;
        objuser.TimeZoneSidKey=timezone;
        objuser.EmailEncodingKey=EmailEncodingKey;
        objuser.LanguageLocaleKey=languageLocale;
        objuser.LocaleSidKey=localeSidKey;
        objuser.AnnouncementVisitDate__c=announcementVisitDate;
        insert objuser;
        return objuser;
    }
}