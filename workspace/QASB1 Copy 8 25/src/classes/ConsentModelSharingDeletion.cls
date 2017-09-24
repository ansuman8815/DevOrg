global class ConsentModelSharingDeletion implements Database.Batchable<sObject> , Database.Stateful{
   /**
        ConsentModelSharingDeletion newBatch = new ConsentModelSharingDeletion('1', boolean);
        Database.executeBatch(newBatch);
   **/
    String indexVal = '';
    //Boolean value to indicate if batch cascading required or not.
    Boolean isCascade;
    ConsentModel__c consentModelSettings;
    
    global ConsentModelSharingDeletion(String index , Boolean isCascade){
        this.indexVal = index;
        this.isCascade = isCascade;
    }
   
   global Database.QueryLocator start(Database.BatchableContext BC){
      String query = '';
      Set<ID> setAccountIds = new Set<ID>();
      Set<ID> setFacilityIds = new Set<ID>();
      List<Patient_Consent_Facility__c> lstPCF = [select Account__c,FacilityPublicGroupId__c,Consent_Status__c FROM Patient_Consent_Facility__c WHERE Consent_Status__c='No'];

      for(Patient_Consent_Facility__c pcf:lstPCF){
        setAccountIds.add(pcf.Account__c);
        setFacilityIds.add(pcf.FacilityPublicGroupId__c);
      }
      
      consentModelSettings = ConsentModel__c.getinstance(indexVal);
      if(consentModelSettings != null){
        query = 'SELECT ' +consentModelSettings.Account_Api__c + ' FROM ' + consentModelSettings.object__c +' WHERE '+consentModelSettings.Account_Api__c +' IN :setAccountIds';
         system.debug('query :: ' + query);
       }  
      return Database.getQueryLocator(query);
    }

   global void execute(Database.BatchableContext BC, List<sObject> scope){
      Set<ID> setAccountIds = new Set<ID>();
      Set<ID> setFacilityIds = new Set<ID>();
      List<sObject> lstShare = new List<sObject>();
      List<sObject> deleteList = new List<sObject>();
      String RowCause = 'Manual';
      List<Patient_Consent_Facility__c> lstPCS = new List<Patient_Consent_Facility__c>();
      Map<String,Boolean> mapAccountIdFacilityGroupIDs = new Map<String,Boolean>();
      Map<String,String> mapRecordIdAccountId = new Map<String,String>();

      List<Patient_Consent_Facility__c> lstPCF = [select Account__c,FacilityPublicGroupId__c,Consent_Status__c FROM Patient_Consent_Facility__c WHERE Consent_Status__c='No'];

      for(Patient_Consent_Facility__c pcf:lstPCF){
        mapAccountIdFacilityGroupIDs.put(pcf.Account__c+pcf.FacilityPublicGroupId__c,true);
      }

      for(sObject temp:scope){
        mapRecordIdAccountId.put((String)temp.get('id'),(String)temp.get(consentModelSettings.Account_Api__c));
      }  
      system.debug('--mapRecordIdAccountId--'+mapRecordIdAccountId);
      
      Set<String> lstKeySet = mapRecordIdAccountId.keySet();
      String query='';
      if(consentModelSettings.Object__c=='Account')
          query = 'SELECT '+'Accountid,UserorGroupId'+' FROM '+consentModelSettings.Share_Object__c+' WHERE '+'Accountid IN :lstKeySet and RowCause=:RowCause';      
      else
          query = 'SELECT '+'Parentid,UserorGroupId'+' FROM '+consentModelSettings.Share_Object__c+' WHERE '+'Parentid IN :lstKeySet and RowCause=:RowCause';    
      lstShare = Database.query(query);

      for(Sobject temp:lstShare){
        String accId = '';
        if(consentModelSettings.Object__c=='Account')
            accId=mapRecordIdAccountId.get((String)temp.get('Accountid'));
        else
            accId =mapRecordIdAccountId.get((String)temp.get('Parentid')); 
        if(mapAccountIdFacilityGroupIDs.containsKey(accId+(String)temp.get('UserorGroupId')))
            deleteList.add(temp);
      }

      delete deleteList;
    }

   global void finish(Database.BatchableContext BC){
       //system.debug('without incremented index :: ' + Integer.valueOf(indexVal));
       indexVal = String.valueOf(Integer.valueOf(indexVal) + 1);
       //system.debug('incremented index :: ' + indexVal);
       consentModelSettings = ConsentModel__c.getinstance(indexVal);
       if(consentModelSettings != null && isCascade){
            ConsentModelSharingDeletion newBatch = new ConsentModelSharingDeletion(indexVal , isCascade);
            Database.executeBatch(newBatch);
       }
   }
}