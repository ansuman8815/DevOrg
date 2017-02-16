public class ProfileMenuController {
	@AuraEnabled
    public static User getLoggedInUser(){
        User loggedinUser = [SELECT Id, Name,FirstName, LastName, LastLoginDate FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1];
        return loggedinUser; 
    }
}