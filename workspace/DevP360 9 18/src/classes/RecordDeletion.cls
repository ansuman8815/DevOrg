/**
	@Author      :   Cognizant Technology Solutions
	@name        :   RecordDeletion
	@CreateDate  :   06/07/2017
	@Description :   To delete records from objects which are 1 year older
	@Version     :   1.0
	@Step		 :   RecordDeletion newBatch = new RecordDeletion('12', boolean);
                     Database.executeBatch(newBatch);
*/
global class RecordDeletion implements Database.Batchable<sObject>,Database.Stateful{  
    
    /**
    *  @param   :   1. indexVal      :   Captures the value for index
                    2. isCascade     :   Boolean value to indicate if batch cascading required or not
                    3. totalCount    :   Captures the totalCount count for records processed to delete
					4. recordDeleted :   Captures the recordDeleted count for processed records
    */
    String indexVal = '';
    Boolean isCascade;
    Integer totalCount = 0;
    Integer recordDeleted = 0;
    ConsentModel__c consentModelSettings;
    
    /**
    *  Description of the purpose of the class's method. 
    *  @name    :	RecordDeletion
    *  @param   :	1. indexVal     :   Captures the value for index.
                  	2. isCascade    :   Boolean value to indicate if batch cascading required or not.	
    */
    global RecordDeletion(String index, Boolean isCascade){
		this.indexVal = index;
        this.isCascade = isCascade;        
    }
    
    /**
    *  Description of the purpose of the class's method. 
    *  @name    :	start
    *  @param   :	database.batchableContext   :   Context variable which store the runtime information
	*  @return  :	Returns the record set as an iterable that will be batched for execution
    *  @purpose :	Gets invoked when the batch job starts.
    */
    global Database.QueryLocator start(Database.BatchableContext bc){
        consentModelSettings = ConsentModel__c.getinstance(indexVal);
        String query='';
        if(consentModelSettings != null){
        	query = 'SELECT Id FROM ' + consentModelSettings.Object__c;
            if(consentModelSettings.deletionWhereClause__c!= null) 
            	query = query + ' WHERE ' + consentModelSettings.deletionWhereClause__c;
        return Database.getQueryLocator(query);
        }
        return null; 
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
        indexVal = String.valueOf(Integer.valueOf(indexVal) + 1);
        consentModelSettings = ConsentModel__c.getinstance(indexVal);
        if(consentModelSettings != null && isCascade){
            RecordDeletion newBatch = new RecordDeletion(indexVal, isCascade);
            Database.executeBatch(newBatch , 2000);
        }
    }
}