public class UtilityTestData {
    
    public static Account createAccount(String name,Date dob,String medicaidCin,String empi,String medicalRecordNumber,String sourceSystem)
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
    
    
    public static User_Session__c createUserSession(String currentPage,String fname,String lname,String cin,String dob,String gender,String user){
        System.debug('Inside UserSession');
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
    
    public static BackNavigation__c createBackNavigation(String name,String profile,String landingPage,String pageName,Boolean hasUrlParam,String currentPage){
        System.debug('Inside Backnavigation');
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
    
    
    public static Profile retriveProfile(){
        Profile profileobj=[SELECT Id FROM Profile WHERE Name = 'System Administrator'];
        
        return profileobj;
    }
    
    public static User createUser(ID profileId,String lname,String email,String username,String companyname,String title,String alias,String timezone,String EmailEncodingKey,String languageLocale,String localeSidKey,Datetime announcementVisitDate){
        System.debug('Inside User Creation');
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
        System.debug(objuser.CompanyName);
        return objuser;
    }
    
    
}