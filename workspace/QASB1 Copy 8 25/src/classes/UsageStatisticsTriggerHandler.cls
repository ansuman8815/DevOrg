public class UsageStatisticsTriggerHandler implements ITriggerHandler{

    public Boolean IsDisabled()
    {
        return true;
    }
    public void BeforeInsert(Map<Id, SObject> newItems) {}
 
    public void BeforeUpdate(Map<Id, SObject> newItems, Map<Id, SObject> oldItems) {}
 
    public void BeforeDelete(Map<Id, SObject> oldItems) {}
    
    public void AfterInsert(Map<Id, SObject> newItems) {
        Map<String,Id> mapPrimFacilityNameAccountId = new Map<String,Id>();
        Map<Id,Integer> mapAccountIdCount = new Map<Id,Integer>();
        //Iterate through the list and collect the ids
        for(Usage_Statistics_Aggregate__c usa:(List<Usage_Statistics_Aggregate__c>)newItems.values()){
            Id Accountid = usa.Primary_Facility__c.split('/')[1];
            mapPrimFacilityNameAccountId.put(usa.Primary_Facility__c,Accountid);
        }
        //Query the contact object where account id in the above collected list group by account id
        //List<AggregateResult> lstContact = [select Accountid,count(id) from Contact where AccountId in :mapPrimFacilityNameAccountId.values() group by AccountId];
        //Form a map of Accountid and the count of number of active users
        for(AggregateResult ag : [select Accountid,count(id) from Contact where AccountId in :mapPrimFacilityNameAccountId.values() group by AccountId]){
            mapAccountIdCount.put((Id)ag.get('Accountid'),(integer)ag.get('expr0'));
        }
        //Update the records with the total number
        for(Usage_Statistics_Aggregate__c usa:(List<Usage_Statistics_Aggregate__c>)newItems.values()){
            usa.Total_Active_User__c = mapAccountIdCount.get(mapPrimFacilityNameAccountId.get(usa.Primary_Facility__c));
        } 
        
        update newItems.values();
    
    }
    
    public void AfterUpdate(Map<Id, SObject> newItems, Map<Id, SObject> oldItems) {}
 
    public void AfterDelete(Map<Id, SObject> oldItems) {}
 
    public void AfterUndelete(Map<Id, SObject> oldItems) {}
}