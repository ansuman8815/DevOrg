// Controller class for the Force.com Typeahead component
public with sharing class Typeahead {

  @RemoteAction
  public static List<sObject> searchRecords( String queryString, String objectName, 
    list<String> fieldNames, String fieldsToSearch, String filterClause, String orderBy, Integer recordLimit ) {

    if (queryString == null) return null;

    String sQuery = String.escapeSingleQuotes( queryString );
    if (sQuery.length() == 0) return null;

   // String sObjectName = (objectName == null) ? 'Contact' : String.escapeSingleQuotes( objectName );

   /* String sInFields = 
        (fieldsToSearch == null || fieldsToSearch == '' || fieldsToSearch.toUpperCase() == 'ALL') ? '' : 
            ( ' IN ' + String.escapeSingleQuotes(fieldsToSearch) + ' FIELDS' );
    
   
    
    String sFields = (fieldNames == null || fieldNames.isEmpty()) ? 'Id, Name' : 
        String.escapeSingleQuotes( String.join( fieldNames, ', ' ) );  
    
    String sOrder = ' ORDER BY ' + ( (orderBy == null || orderBy == '') ? 'Name' : String.escapeSingleQuotes(orderBy) ); 
    
    */
    
    String sLimit = (recordLimit == null || recordLimit == 0 || recordLimit >= 2000) ? '' : 
        ( ' LIMIT ' + String.valueOf(recordLimit));
    
    // can't escape the filter clause
    
    /*String sWhere = (filterClause == null || filterClause == '') ? '' : 
        ( ' WHERE ' + filterClause );
    

    
    String queryStr = 'FIND \'' + sQuery + '*\'' + sInFields + 
            ' RETURNING ' + sObjectName + '( ' + sFields + sWhere + sOrder + sLimit + ' )';
    system.debug('--QUERY--'+queryStr);
    
    list<list<sObject>> results = Search.query(
        'FIND \'' + sQuery + '*\'' + sInFields + 
            ' RETURNING ' + sObjectName + '( ' + sFields + sWhere + sOrder + sLimit + ' )' */
    
            
//==============================================================================================================================            
    List<sObject> valueReturn;  // The string that will store results
    
    
    //List<List<SObject>> results= [FIND :sQuery IN ALL FIELDS RETURNING Account (Id, Name), Contact, Opportunity, Lead,EHR_Procedure__c(Code_Label__c), Ehr_Clinical_Note__c(Note_Text__c)];
  	//sObject valueRet = new sObject();
     
     String searchquery='FIND\'CL-001*\'IN ALL FIELDS RETURNING Account(id,name),Contact, Lead, EHR_Procedure__c';
     List<List<SObject>> results = search.query(searchquery);
    
    for(List<Sobject> lst:results)
        {
            if (lst.size() != 0)
            {
            	System.debug('Actual--'+lst.getSobjectType());
                
                //String store = (String)lst.getSObjectType();// Can't do this Schema.SObjectType is never an instance of string
                //valueReturn.add(store);
                
            	//valueRet = String.valueOf(lst.getSobjectType());
                // ** adding to a List
               // valueReturn.add(valueRet); 
               
            }
        } 
    //System.debug('Result-- '+results[4]);    
  	//return results[3];
  	return valueReturn;
  }  
}