public class UserCredentialFacilitiesHandler implements ITriggerHandler{
    
    public Boolean IsDisabled()
    {
        return true;
    }
 
    public void BeforeInsert(Map<Id, SObject> newItems) {}
 
    public void BeforeUpdate(Map<Id, SObject> newItems, Map<Id, SObject> oldItems) {}
 
    public void BeforeDelete(Map<Id, SObject> oldItems) {}
 
    public void AfterInsert(Map<Id, SObject> newItems) {
        //Instantiate GroupMember list
        List<GroupMember> lstGroupMembers = new List<GroupMember>();
        //Create a list of GroupMember records
        for(User_Credential_Facility__c ucf:(List<User_Credential_Facility__c>)newItems.values()){
            GroupMember gm = new GroupMember();
            gm.GroupId = ucf.FacilityOrPublicGroupId__c;
            gm.UserOrGroupId = ucf.User__c;
            lstGroupMembers.add(gm);
        }
        //Database.insert operation for the GroupMember records
        Database.SaveResult[] srList = Database.insert(lstGroupMembers, false);
        //Post processing of records failed during the DML transaction
        for (Database.SaveResult sr : srList) {
                if (sr.isSuccess()) {
                    // Operation was successful, so get the ID of the record that was processed
                    }
                else {
                    // Operation failed, so get all errors                
                    /*for(Database.Error err : sr.getErrors()) {
                        System.debug('The following error has occurred.');                    
                        System.debug(err.getStatusCode() + ': ' + err.getMessage());
                        System.debug('Account fields that affected this error: ' + err.getFields());
                    }*/
                    newItems.get(sr.getId()).addError(sr.getErrors()+'');
                }
            
            }
    }
 
    public void AfterUpdate(Map<Id, SObject> newItems, Map<Id, SObject> oldItems) {}
 
    public void AfterDelete(Map<Id, SObject> oldItems) {}
 
    public void AfterUndelete(Map<Id, SObject> oldItems) {}

}