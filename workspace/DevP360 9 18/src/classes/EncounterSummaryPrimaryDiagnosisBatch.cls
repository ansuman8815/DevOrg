/**
	@Author      :   Cognizant Technology Solutions
	@name        :   EncounterSummaryPrimaryDiagnosisBatch
	@CreateDate  :   21/03/2017
	@Description :   To update the Encounter object
	@Version     :   1.0
	@Step		 :   EncounterSummaryPrimaryDiagnosisBatch newBatch = new EncounterSummaryPrimaryDiagnosisBatch();
                     Database.executeBatch(newBatch);
*/
global class EncounterSummaryPrimaryDiagnosisBatch implements Database.Batchable<sObject> , Database.Stateful{
    
    global Map<Id,String> mapEncIdPrimaryDiagnosesDesc = new Map<Id,String>();
    
    /**
    *  Description of the purpose of the class's method. 
    *  @name    :	start
    *  @param   :	database.batchableContext   :   Context variable which store the runtime information
	*  @return  :	Returns the record set as an iterable that will be batched for execution
    *  @purpose :	Gets invoked when the batch job starts.
    */
    global Database.QueryLocator start(Database.BatchableContext BC){  
        String query = 'SELECT HealthCloudGA__Account__c , HealthCloudGA__Encounter__c , Id, HealthCloudGA__CodeLabel__c, Hospital_Problem__c ' + 
            ' FROM HealthCloudGA__EhrCondition__c ' + 
            ' WHERE Hospital_Problem__c=true AND HealthCloudGA__Encounter__c = :setEncounters  ORDER BY HealthCloudGA__Encounter__c ';
        return Database.getQueryLocator(query);
    }
    
    /**
    *  Description of the purpose of the class's method. 
    *  @name    : 	execute
    *  @param   :	database.batchableContext     :   Context variable which store the runtime information
    *  @purpose : 	Gets invoked when the batch job executes and operates on one batch of records.
    */
    global void execute(Database.BatchableContext BC, List<HealthCloudGA__EhrCondition__c> scope){
        Map<Id,String> tempmapEncIdPrimaryDiagnosesDesc = new Map<Id,String>();
        List<HealthCloudGA__EhrEncounter__c> ehrEncounterListToUpdate = new List<HealthCloudGA__EhrEncounter__c>();
        Integer count = 0;
     
        for(HealthCloudGA__EhrCondition__c conditionData : scope){
            count++;
            if(conditionData.HealthCloudGA__CodeLabel__c != null){
                String primaryDxString = '';
                if(mapEncIdPrimaryDiagnosesDesc.containsKey(conditionData.HealthCloudGA__Encounter__c) && mapEncIdPrimaryDiagnosesDesc.get(conditionData.HealthCloudGA__Encounter__c) != null){
                    primaryDxString = mapEncIdPrimaryDiagnosesDesc.get(conditionData.HealthCloudGA__Encounter__c);
                    primaryDxString = primaryDxString + '\n' + conditionData.HealthCloudGA__CodeLabel__c;
                    mapEncIdPrimaryDiagnosesDesc.put(conditionData.HealthCloudGA__Encounter__c , primaryDxString);
                    if(count == scope.size())
                        tempmapEncIdPrimaryDiagnosesDesc.put(conditionData.HealthCloudGA__Encounter__c , primaryDxString);
                }
                else{
                    primaryDxString = conditionData.HealthCloudGA__CodeLabel__c;
                    mapEncIdPrimaryDiagnosesDesc.put(conditionData.HealthCloudGA__Encounter__c , primaryDxString);
                    if(count == scope.size())
                        tempmapEncIdPrimaryDiagnosesDesc.put(conditionData.HealthCloudGA__Encounter__c , primaryDxString);
                }
            }
        }
       
        List<HealthCloudGA__EhrEncounter__c> ehrEncounterList = [SELECT Id , Primary_Diagnosis__c FROM HealthCloudGA__EhrEncounter__c WHERE Id IN: mapEncIdPrimaryDiagnosesDesc.keyset()];
        for(HealthCloudGA__EhrEncounter__c encounterData : ehrEncounterList){
            if(mapEncIdPrimaryDiagnosesDesc.containsKey(encounterData.Id)){
                encounterData.Primary_Diagnosis__c = mapEncIdPrimaryDiagnosesDesc.get(encounterData.Id);
                ehrEncounterListToUpdate.add(encounterData);    
            }
        }
        mapEncIdPrimaryDiagnosesDesc.clear();
        mapEncIdPrimaryDiagnosesDesc = tempmapEncIdPrimaryDiagnosesDesc.clone();
        update ehrEncounterListToUpdate;
    }
    
    /**
    *  Description of the purpose of the class's method. 
    *  @name    :	finish
    *  @param   :	database.batchableContext     :   Context variable which store the runtime information
    *  @purpose :	Gets invoked when the batch job finishes.
    */
    global void finish(Database.BatchableContext BC){
    }
}