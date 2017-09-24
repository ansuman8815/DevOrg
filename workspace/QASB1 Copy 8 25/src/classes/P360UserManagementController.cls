Public without sharing class P360UserManagementController {
    @AuraEnabled
    public static List<User> getAllActiveUsers(){
        List<User> lstUser = [select id, name, email, username, profile.name, contact.account.name,createddate from User where isactive=true and Profile.name IN ('Basic Access','Clinical Access')];
        return lstUser;
    }

    @AuraEnabled
    public static List<User> getUserWithEmail(String email){
        List<User> lstUser = [select id, name, email, username, profile.name, contact.account.name,createddate from User where isactive=true and email=:email];
        return lstUser;
    }
}