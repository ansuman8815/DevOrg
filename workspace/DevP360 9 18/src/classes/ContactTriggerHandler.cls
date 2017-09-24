public class ContactTriggerHandler implements ITriggerHandler
{
    public Boolean IsDisabled()
    {
        return true;
    }
 
    public void BeforeInsert(Map<Id, SObject> newItems ) {

    }
 
    public void BeforeUpdate(Map<Id, SObject> newItems, Map<Id, SObject> oldItems) {}
 
    public void BeforeDelete(Map<Id, SObject> oldItems) {}
 
    public void AfterInsert(Map<Id, SObject> newItems) {
        List<User> lstUser = new List<User>();
        Map<id,id> mapUseridContactId = new Map<id,id>();
        Map<String,id> mapProfileNameId = new Map<String,id>();
        String businessRecordTypeId = [Select id,DeveloperName from RecordType where DeveloperName='IndustriesBusiness' and SobjectType='Contact' limit 1].id;
        List<Profile> lstProfile = [select id,name from Profile where UserType='PowerCustomerSuccess'];
        
        //Create a map of profile name and profile id
        for(Profile p:lstProfile){
            mapProfileNameId.put(p.name,p.id);
        }
        
        //Iterate through the contact and instantiate user list
            for(Contact con:(List<Contact>)newItems.values()){
                if(con.recordtypeid == businessRecordTypeId){
                    User u = new User();
                    u.lastname = con.lastname;
                    if(con.Access_Type__c.equalsIgnoreCase(UtilityData.labelforClinicalProfile)){
                        u.profileid = mapProfileNameId.get(UtilityData.labelforClinicalProfile);
                    }
                    else if(con.Access_Type__c.equalsIgnoreCase(UtilityData.labelforBasicProfle)){
                        u.profileid = mapProfileNameId.get(UtilityData.labelforBasicProfle);    
                    }
                    u.username = con.email+UtilityData.usernameSuffix ;
                    u.alias = (con.lastname+con.firstname).left(6);
                    u.contactid = con.id;
                    u.EmailEncodingKey = 'ISO-8859-1';
                    u.LanguageLocaleKey = 'en_US';
                    u.LocaleSidKey = 'en_US';
                    u.EmailEncodingKey = 'ISO-8859-1';
                    u.TimeZoneSidKey = 'America/New_York';
                    u.email = con.email;
                    lstUser.add(u);
                }
            }
            
        //Insert users
            Database.SaveResult[] srList = Database.insert(lstUser, false);
        
        //Create map of Userid and Contactid
            for(User u:lstUser){
                mapUseridContactId.put(u.id,u.contactid);    
            }
            
        
        // Iterate through each returned result
            for (Database.SaveResult sr : srList) {
                if (sr.isSuccess()) {
                    // Operation was successful, so get the ID of the record that was processed
                    //System.debug('Successfully inserted account. Account ID: ' + sr.getId());
                }
                else {
                    // Operation failed, so get all errors                
                    /*for(Database.Error err : sr.getErrors()) {
                        System.debug('The following error has occurred.');                    
                        System.debug(err.getStatusCode() + ': ' + err.getMessage());
                        System.debug('Account fields that affected this error: ' + err.getFields());
                    }*/
                    newItems.get(mapUseridContactId.get(sr.getId())).addError(sr.getErrors()+'');
                }
            
            }
    }
 
    public void AfterUpdate(Map<Id, SObject> newItems, Map<Id, SObject> oldItems) {}
 
    public void AfterDelete(Map<Id, SObject> oldItems) {}
 
    public void AfterUndelete(Map<Id, SObject> oldItems) {}
}