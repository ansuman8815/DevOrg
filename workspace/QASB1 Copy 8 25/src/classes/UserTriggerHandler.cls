public class UserTriggerHandler implements ITriggerHandler{

    public Boolean IsDisabled()
    {
        return true;
    }
    public void BeforeInsert(Map<Id, SObject> newItems) {}
 
    public void BeforeUpdate(Map<Id, SObject> newItems, Map<Id, SObject> oldItems) {}
 
    public void BeforeDelete(Map<Id, SObject> oldItems) {}
    
    public void AfterInsert(Map<Id, SObject> newItems) {
        List<PermissionSetAssignment> lstPermSetAssgnmnt = new List<PermissionSetAssignment>();
        //Map of Profile Id and Profile that are P360 specific 
        Map<Id,Profile> mapProfileIdName  = new Map<Id,Profile>([select id,name from Profile where Name =:UtilityData.labelforBasicProfle OR Name=:UtilityData.labelforClinicalProfile]);
        //Id of the P360_community permission set to be used while creating an entry in the PermissionSetAssginment table
        Id permissionSetId = [select id,name from PermissionSet where name = 'P360_community' limit 1].id;
        //Iterate through the user list and check if the User belongs Clinical Access or Basic Acces profile
        //If yes, prepare the PermissionSetAssignment record for the user
        for(User u:(List<User>)newItems.values()){
            //check if user belongs to one of the above profiles
            if(mapProfileIdName.containsKey(u.profileId)){
                PermissionSetAssignment psa = new PermissionSetAssignment(AssigneeId = u.id, PermissionSetId = permissionSetId);
                lstPermSetAssgnmnt.add(psa);
            }
        }
        //Insert the PermissionSetAssignment records for each of the P360 users
        if(lstPermSetAssgnmnt.size()>0){
            insert lstPermSetAssgnmnt;
        }
    }
    
    public void AfterUpdate(Map<Id, SObject> newItems, Map<Id, SObject> oldItems) {}
 
    public void AfterDelete(Map<Id, SObject> oldItems) {}
 
    public void AfterUndelete(Map<Id, SObject> oldItems) {}
}