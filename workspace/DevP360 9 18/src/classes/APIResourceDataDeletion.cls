/**
	@Author      :   Cognizant Technology Solutions
	@name        :   APIResourceDataDeletion
	@CreateDate  :   09/15/2017
	@Description :   To delete records from object APIResourceData
	@Version     :   1.0
	@Step		 :   APIResourceDataDeletion newBatch = new APIResourceDataDeletion();
                     Database.executeBatch(newBatch);
*/
global class APIResourceDataDeletion implements Database.Batchable<sObject>,Database.Stateful {
     /**
    *  @param   :   1. totalCount    :   Captures the totalCount count for records processed to delete
					2. recordDeleted :   Captures the recordDeleted count for processed records
    */
    Integer totalCount = 0;
    Integer recordDeleted = 0;
   
    /**
    *  Description of the purpose of the class's method. 
    *  @name    :	start
    *  @param   :	database.batchableContext   :   Context variable which store the runtime information
	*  @return  :	Returns the record set as an iterable that will be batched for execution
    *  @purpose :	Gets invoked when the batch job starts.
    */
    global Database.QueryLocator start(Database.BatchableContext bc){
           String query = 'SELECT Id FROM APIResourceData__c' ;
           return Database.getQueryLocator(query);
       
    }
    
     /**
    *  Description of the purpose of the class's method. 
    *  @name    : 	execute
    *  @param   :	database.batchableContext     :   Context variable which store the runtime information
    *  @purpose : 	Gets invoked when the batch job executes and operates on one batch of records.
    */
    global void execute(Database.BatchableContext bc, List<sObject> scope){
        List<Database.DeleteResult> drList = Database.delete(scope,false);
        for(Database.DeleteResult dr : drList) {
            if (dr.isSuccess()) {              
                recordDeleted++;
            }
            totalCount++;  
        }
        DataBase.emptyRecycleBin(scope); 
    }
    
    /**
    *  Description of the purpose of the class's method. 
    *  @name    :	finish
    *  @param   :	database.batchableContext     :   Context variable which store the runtime information
    *  @purpose :	Gets invoked when the batch job finishes.
    */
    global void finish(Database.BatchableContext bc) {
       System.debug('recordDeleted'+recordDeleted);
       System.debug('totalCount'+totalCount);
    }
    
}