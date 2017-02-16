@isTest
private class ProfileMenuControllerTest {
    
    static testMethod void validategetLoggedInUser() {
        
        User uId = ProfileMenuController.getLoggedInUser();
        User u =[select Id,Name,FirstName, LastName, LastLoginDate from user where Id =: uId.Id ];     
         
         System.debug(u.Id);
         System.debug(u.Name);
         System.debug(u.FirstName);
         System.debug(u.LastName);
         System.debug(u.LastLoginDate);
            
          
    }

}