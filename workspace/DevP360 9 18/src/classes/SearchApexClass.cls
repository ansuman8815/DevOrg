// Author: Priyank Srivastava
// Patient 360 Search SOSL Query
// 

public class SearchApexClass {    
    
    @AuraEnabled
    public static List<List<SObject>> findAll(){
        return [FIND 'John' IN ALL FIELDS RETURNING Contact(ID,Name)];
    }    
	//System.debug(searchResult);

}
// Looks for word "John" in Contact Object
// How to connect this class to Component
// How to search in all the objects and return object names
// 
// // List<contact> obj = [Select ID, name from Contact Limit 5];
// System.debug(obj);

//List<List<SObject>> searchResult = [FIND 'John' IN ALL FIELDS RETURNING Contact(ID,Name)];
//System.debug(searchResult);

/*List<List<SObject>> searchList = [FIND 'CL-001' IN ALL FIELDS RETURNING Account (Id, Name), Contact, Opportunity, Lead,EHR_Procedure__c(Code_Label__c),	Ehr_Clinical_Note__c(Note_Text__c)];

for(List<Sobject> lst:searchList)
{
    System.debug(lst);
    
    //for(Sobject sobj:lst)
    //{
        //system.debug('RESULTS--'+sobj);
    //}
}

//system.debug('searchList--'+searchList);
//*/