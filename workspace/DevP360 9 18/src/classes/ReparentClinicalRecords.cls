global class ReparentClinicalRecords implements Database.Batchable<sObject> , Database.Stateful{
   /**
        ReparentClinicalRecords newBatch = new ReparentClinicalRecords('1', boolean);
        Database.executeBatch(newBatch);
   **/
    String indexVal = '';
    //Boolean value to indicate if batch cascading required or not.
    Boolean isCascade;
    ConsentModel__c consentModelSettings;
    
    global ReparentClinicalRecords(String index , Boolean isCascade){
        this.indexVal = index;
        this.isCascade = isCascade;
    }
   
   global Database.QueryLocator start(Database.BatchableContext BC){
      consentModelSettings = ConsentModel__c.getinstance(indexVal);
      List<String> lstid = new List<String>();
      String query = '';
      List<EMPI_Mapping__c> lstEMPImapping = [Select Account_ID__c,Reparenting_Lookup_Key__c, Master_Patient_ID__c, New_Account_Id__c, New_Master_Patient_Id__c FROM EMPI_Mapping__c];
      for(EMPI_Mapping__c em:lstEMPImapping){
          lstid.add(em.Reparenting_Lookup_Key__c);  
      }
     // ConsentModelSettings is a custom setting that holds the all the object name along with the name of the column that holds the Account id value. In this case it is used 
      if(consentModelSettings != null){
        query = 'SELECT ' + consentModelSettings.Reparenting_Key__c + ' FROM ' + consentModelSettings.Object__c +' WHERE '+consentModelSettings.Reparenting_Key__c+' IN :lstid';
        system.debug('query :: ' + query);
      }
      return Database.getQueryLocator(query);
    }

   global void execute(Database.BatchableContext BC, List<sObject> scope){
      Set<ID> setAccountIds = new Set<ID>();
      List<sObject> lstShare = new List<sObject>();
      List<Patient_Consent_Facility__c> lstPCS = new List<Patient_Consent_Facility__c>();
      Map<string,string> mapOldAccidNewAccid = new Map<string,string>();

      //Query all the account record ids from the mapping table and create a map of old and new accountid
      List<EMPI_Mapping__c> lstEMPImapping = [Select Account_ID__c,Reparenting_Lookup_Key__c, Master_Patient_ID__c, New_Account_Id__c, New_Master_Patient_Id__c FROM EMPI_Mapping__c];
      for(EMPI_Mapping__c em:lstEMPImapping){
          mapOldAccidNewAccid.put(em.Reparenting_Lookup_Key__c,em.New_Account_Id__c);  
      }
      //Iterate through scope which has the queried record set and replace the old id with new id
      for(sObject temp:scope){
        if(mapOldAccidNewAccid.containsKey((String)temp.get(consentModelSettings.Reparenting_Key__c)))
          temp.put(consentModelSettings.Account_Api__c,(ID)mapOldAccidNewAccid.get((String)temp.get(consentModelSettings.Reparenting_Key__c)));
      }
      
      system.debug('--DEBUG STATEMENT--'+scope);
      update scope;
    }

   global void finish(Database.BatchableContext BC){
       //system.debug('without incremented index :: ' + Integer.valueOf(indexVal));
       indexVal = String.valueOf(Integer.valueOf(indexVal) + 1);
       //system.debug('incremented index :: ' + indexVal);
       consentModelSettings = ConsentModel__c.getinstance(indexVal);
       if(consentModelSettings != null && isCascade){
            ReparentClinicalRecords newBatch = new ReparentClinicalRecords(indexVal , isCascade);
            Database.executeBatch(newBatch);
       }
   }
}