global class ConsentModelSharingCalculation implements Database.Batchable<sObject> , Database.Stateful{
   /**
        ConsentModelSharingCalculation newBatch = new ConsentModelSharingCalculation('1', boolean);
        Database.executeBatch(newBatch);
   **/
    String indexVal = '';
    //Boolean value to indicate if batch cascading required or not.
    Boolean isCascade;
    ConsentModel__c consentModelSettings;
    
    global ConsentModelSharingCalculation(String index , Boolean isCascade){
        this.indexVal = index;
        this.isCascade = isCascade;
    }
   
   global Database.QueryLocator start(Database.BatchableContext BC){
      consentModelSettings = ConsentModel__c.getinstance(indexVal);
      String query = '';
      system.debug('consentModelSettings :: ' + consentModelSettings);
      if(consentModelSettings != null){
        query = 'SELECT ' + consentModelSettings.Account_Api__c + ' FROM ' + consentModelSettings.Object__c ;
        if(consentModelSettings.whereClause__c != null) 
            query = query + ' WHERE ' + consentModelSettings.whereClause__c;
        system.debug('query :: ' + query);
      }
      return Database.getQueryLocator(query);
    }

   global void execute(Database.BatchableContext BC, List<sObject> scope){
      Set<ID> setAccountIds = new Set<ID>();
      List<sObject> lstShare = new List<sObject>();
      List<Patient_Consent_Facility__c> lstPCS = new List<Patient_Consent_Facility__c>();
      Map<id,List<String>> mapAccountIdFacilityGroupIDs = new Map<Id,List<String>>();

      //collect the accountids related to the queried recordset
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
       //system.debug('without incremented index :: ' + Integer.valueOf(indexVal));
       indexVal = String.valueOf(Integer.valueOf(indexVal) + 1);
       //system.debug('incremented index :: ' + indexVal);
       consentModelSettings = ConsentModel__c.getinstance(indexVal);
       if(consentModelSettings != null && isCascade){
            ConsentModelSharingCalculation newBatch = new ConsentModelSharingCalculation(indexVal , isCascade);
            Database.executeBatch(newBatch);
       }
   }
}