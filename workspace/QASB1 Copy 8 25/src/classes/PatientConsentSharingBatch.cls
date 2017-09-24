global class PatientConsentSharingBatch implements Database.Batchable<sObject> , Database.Stateful{
   
   ConsentModel__c consentModelSettings;
   Map<Id,List<String>> mapAccountIdFacilityGroupIDs = new Map<Id,List<String>>();
   global Database.QueryLocator start(Database.BatchableContext BC){
        consentModelSettings = ConsentModel__c.getinstance('0');
        String query = 'SELECT Account__c , FacilityPublicGroupId__c FROM Patient_Consent_Facility__c ';
        if(consentModelSettings != null && consentModelSettings.whereClause__c != null)
            query = query + ' WHERE ' + consentModelSettings.whereClause__c;
        return Database.getQueryLocator(query);
   }
    
   global void execute(Database.BatchableContext BC, List<Patient_Consent_Facility__c> scope){
       for(Patient_Consent_Facility__c patientConsentFacility : scope){
           if(!mapAccountIdFacilityGroupIDs.containsKey(patientConsentFacility.Account__c)){
                mapAccountIdFacilityGroupIDs.put(patientConsentFacility.Account__c,new List<String>());      
            }
            mapAccountIdFacilityGroupIDs.get(patientConsentFacility.Account__c).add(patientConsentFacility.FacilityPublicGroupId__c);
       }
   }

   global void finish(Database.BatchableContext BC){
       system.debug('mapAccountIdFacilityGroupIDs :: ' + mapAccountIdFacilityGroupIDs);
       //Cascade Data Domain sharing Batch
      // PatientConsentDataDomainSharing newBatch = new PatientConsentDataDomainSharing(mapAccountIdFacilityGroupIDs , '1');
      // Database.executeBatch(newBatch,2000);
   }
}