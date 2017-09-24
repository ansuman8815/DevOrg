global class PatientConsentDataDomainSharing implements Database.Batchable<sObject> , Database.Stateful{
    /*
       PatientConsentDataDomainSharing newBatch = new PatientConsentDataDomainSharing('1');
       Database.executeBatch(newBatch,50);
   */
    String indexVal = '';
    ConsentModel__c consentModelSettings;
    
    global PatientConsentDataDomainSharing(String index){
        this.indexVal = index;
    }
   
   global Database.QueryLocator start(Database.BatchableContext BC){
      consentModelSettings = ConsentModel__c.getinstance(indexVal);
      ConsentModel__c patientConsentModelSetting = ConsentModel__c.getinstance('0');
      String query = '';
      String subQuery = '';
      if(patientConsentModelSetting != null && patientConsentModelSetting.whereClause__c != null){
        subQuery = 'SELECT Account__c FROM Patient_Consent_Facility__c WHERE ' + patientConsentModelSetting.whereClause__c;
      }
      system.debug('subQuery :: ' + subQuery);
      system.debug('consentModelSettings :: ' + consentModelSettings);
      if(consentModelSettings != null){
        /*query = 'SELECT ' + consentModelSettings.Account_Api__c + ' FROM ' + consentModelSettings.Object__c +
                ' WHERE ' +  consentModelSettings.Account_Api__c + ' IN :' + mapAccountIdFacilityGroupIDs.keySet() + ' ';
        */
        query = 'SELECT ' + consentModelSettings.Account_Api__c + ' FROM ' + consentModelSettings.Object__c +
              ' WHERE ' +  consentModelSettings.Account_Api__c + ' IN (' + subQuery  +')';
        if(consentModelSettings.whereClause__c != null) 
            query = query + ' AND ' + consentModelSettings.whereClause__c;
        system.debug('query :: ' + query);
      }
      return Database.getQueryLocator(query);
    }

   global void execute(Database.BatchableContext BC, List<sObject> scope){
      List<sObject> lstShare = new List<sObject>();
      Set<ID> setAccountIds = new Set<ID>();
      List<Patient_Consent_Facility__c> lstPCS = new List<Patient_Consent_Facility__c>();
      Map<id,List<String>> mapAccountIdFacilityGroupIDs = new Map<Id,List<String>>();
      
      for(sObject temp:scope){
        setAccountIds.add((Id)temp.get(consentModelSettings.Account_Api__c));
      }
      
      //Query all the Consent records related to the accountids associated with the queried recordset above.
      lstPCS = [SELECT Account__c,Facility__c,FacilityPublicGroupId__c FROM Patient_Consent_Facility__c WHERE Account__c IN :setAccountIds and Consent_Status__c='Yes'];

      //Create a map with AccountIds as Keys and Facility Public Group Ids list as the Value
      List<String> lstTemp = new List<String>();
      for(Patient_Consent_Facility__c temp:lstPCS){
        if(!mapAccountIdFacilityGroupIDs.containsKey(temp.Account__c)){
            mapAccountIdFacilityGroupIDs.put(temp.Account__c,new List<String>());      
        }
        mapAccountIdFacilityGroupIDs.get(temp.Account__c).add(temp.FacilityPublicGroupId__c);
      }
      
      //Loop through the recordset and find an entry of the associated Accountid in 'mapAccountIdFacilityGroupIDs' map to instantiate the Sharing records.
      for(sObject temp : scope){
        system.debug('temp :: ' + temp);
        if((mapAccountIdFacilityGroupIDs.get((Id)temp.get(consentModelSettings.Account_Api__c)))!=null){
            for(String str : mapAccountIdFacilityGroupIDs.get((Id)temp.get(consentModelSettings.Account_Api__c))){
                 system.debug('str :: ' + str);
                 sObject share = Schema.getGlobalDescribe().get(consentModelSettings.Share_object__c).newSObject() ;
                 
                 if(consentModelSettings.AccessLevel_Api__c == null){
                     share.put('AccessLevel' , 'Read');
                     share.put('ParentId' , (Id)temp.get('id'));
                 }
                 else{
                    String[] arrTest = consentModelSettings.AccessLevel_Api__c.split(',');
                    for(string accessVal : arrTest){
                        system.debug(accessVal);
                        share.put(accessVal , 'Read');
                    }
                    share.put(consentModelSettings.Object__c+'Id' , (Id)temp.get('id'));
                 }
                 
                 share.put('UserOrGroupId' , str);//FacilityPublicGroupId__c
                 lstShare.add(share);
            }
        }
      }
      //INSERT the sharing records
      insert lstShare;
    }

   global void finish(Database.BatchableContext BC){
       indexVal = String.valueOf(Integer.valueOf(indexVal) + 1);
       consentModelSettings = ConsentModel__c.getinstance(indexVal);
       if(consentModelSettings != null){
            PatientConsentDataDomainSharing newBatch = new PatientConsentDataDomainSharing(indexVal);
            Database.executeBatch(newBatch,2000);
       }
   }
}