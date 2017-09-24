global class EncounterSummaryPrimaryDiagnosisBatch implements Database.Batchable<sObject> , Database.Stateful{
   
   global Map<Id,String> mapEncIdPrimaryDiagnosesDesc = new Map<Id,String>();
   
   global Database.QueryLocator start(Database.BatchableContext BC){
      String query = 'SELECT HealthCloudGA__Account__c , HealthCloudGA__Encounter__c , Id, HealthCloudGA__CodeLabel__c, Hospital_Problem__c ' + 
                     ' FROM HealthCloudGA__EhrCondition__c ' + 
                     ' WHERE Hospital_Problem__c=true ORDER BY HealthCloudGA__Encounter__c ';
      return Database.getQueryLocator(query);
   }

   global void execute(Database.BatchableContext BC, List<HealthCloudGA__EhrCondition__c> scope){
       //Set<Id> encounterIdSet = new Set<Id>();
       Map<Id,String> tempmapEncIdPrimaryDiagnosesDesc = new Map<Id,String>();
       List<HealthCloudGA__EhrEncounter__c> ehrEncounterListToUpdate = new List<HealthCloudGA__EhrEncounter__c>();
       Integer count = 0;
       system.debug('--MAP b4--'+mapEncIdPrimaryDiagnosesDesc);
       system.debug('--scope.size()--'+scope.size());
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
                //encounterIdSet.add(conditionData.HealthCloudGA__Encounter__c);
           }
       }
       system.debug('--count--'+count);
       system.debug('--tempmapEncIdPrimaryDiagnosesDesc--'+tempmapEncIdPrimaryDiagnosesDesc);
       
       List<HealthCloudGA__EhrEncounter__c> ehrEncounterList = [SELECT Id , Primary_Diagnosis__c FROM HealthCloudGA__EhrEncounter__c WHERE Id IN: mapEncIdPrimaryDiagnosesDesc.keyset()];
       for(HealthCloudGA__EhrEncounter__c encounterData : ehrEncounterList){
           if(mapEncIdPrimaryDiagnosesDesc.containsKey(encounterData.Id)){
                encounterData.Primary_Diagnosis__c = mapEncIdPrimaryDiagnosesDesc.get(encounterData.Id);
                ehrEncounterListToUpdate.add(encounterData);    
           }
       }
       system.debug('--ehrEncounterListToUpdate--'+ehrEncounterListToUpdate);
       mapEncIdPrimaryDiagnosesDesc.clear();
       mapEncIdPrimaryDiagnosesDesc = tempmapEncIdPrimaryDiagnosesDesc.clone();
       update ehrEncounterListToUpdate;
    }

   global void finish(Database.BatchableContext BC){
   }
}