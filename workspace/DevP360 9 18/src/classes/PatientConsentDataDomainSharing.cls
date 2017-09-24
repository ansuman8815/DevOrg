/**
	@Author      :   Cognizant Technology Solutions
	@name        :   PatientConsentDataDomainSharing
	@CreateDate  :   5/29/2017
	@Description :   Method to create the Data Domain consent for the patient.
	@Version     :   1.0
*/
global class PatientConsentDataDomainSharing implements Database.Batchable<sObject> , Database.Stateful{
    String indexVal = '';
    ConsentModel__c consentModelSettings;
    
    global PatientConsentDataDomainSharing(String index){
        this.indexVal = index;
    }
   
    /**
    *  Description of the purpose of the class's method. 
    *  @name    :	start
    *  @param   :	database.batchableContext   :   Context variable which store the runtime information
	*  @return  :	Returns the record set as an iterable that will be batched for execution
    *  @purpose :	Gets invoked when the batch job starts.
    */
   global Database.QueryLocator start(Database.BatchableContext BC){
      consentModelSettings = ConsentModel__c.getinstance(indexVal);
      ConsentModel__c patientConsentModelSetting = ConsentModel__c.getinstance('0');
      String query = '';
      String subQuery = '';
      if(patientConsentModelSetting != null && patientConsentModelSetting.whereClause__c != null){
        subQuery = 'SELECT Account__c FROM Patient_Consent_Facility__c WHERE ' + patientConsentModelSetting.whereClause__c;
      }
      if(consentModelSettings != null){
        query = 'SELECT ' + consentModelSettings.Account_Api__c + ' FROM ' + consentModelSettings.Object__c +
              ' WHERE ' +  consentModelSettings.Account_Api__c + ' IN (' + subQuery  +')';
        if(consentModelSettings.whereClause__c != null) 
            query = query + ' AND ' + consentModelSettings.whereClause__c;
      }
       return Database.getQueryLocator(query);
    }
    
    /**
    *  Description of the purpose of the class's method. 
    *  @name    :	execute
    *  @param   :   database.batchableContext     :   Context variable which store the runtime information
    *  @purpose :	Gets invoked when the batch job executes and operates on one batch of records.
    */
   global void execute(Database.BatchableContext BC, List<sObject> scope){
      List<sObject> lstShare = new List<sObject>();
      Set<ID> setAccountIds = new Set<ID>();
      List<Patient_Consent_Facility__c> lstPCS = new List<Patient_Consent_Facility__c>();
      Map<id,List<String>> mapAccountIdFacilityGroupIDs = new Map<Id,List<String>>();
      
      for(sObject temp:scope){
        setAccountIds.add((Id)temp.get(consentModelSettings.Account_Api__c));
      }
       
      lstPCS = [SELECT Account__c,Facility__c,FacilityPublicGroupId__c FROM Patient_Consent_Facility__c WHERE Account__c IN :setAccountIds and Consent_Status__c='Yes'];
      List<String> lstTemp = new List<String>();
      for(Patient_Consent_Facility__c temp:lstPCS){
        if(!mapAccountIdFacilityGroupIDs.containsKey(temp.Account__c)){
            mapAccountIdFacilityGroupIDs.put(temp.Account__c,new List<String>());      
        }
        mapAccountIdFacilityGroupIDs.get(temp.Account__c).add(temp.FacilityPublicGroupId__c);
      }
      
      for(sObject temp : scope){
        if((mapAccountIdFacilityGroupIDs.get((Id)temp.get(consentModelSettings.Account_Api__c)))!=null){
            for(String str : mapAccountIdFacilityGroupIDs.get((Id)temp.get(consentModelSettings.Account_Api__c))){
                 sObject share = Schema.getGlobalDescribe().get(consentModelSettings.Share_object__c).newSObject() ;
                 if(consentModelSettings.AccessLevel_Api__c == null){
                     share.put('AccessLevel' , 'Read');
                     share.put('ParentId' , (Id)temp.get('id'));
                 }
                 else{
                    String[] arrTest = consentModelSettings.AccessLevel_Api__c.split(',');
                    for(string accessVal : arrTest){
                        share.put(accessVal , 'Read');
                    }
                    share.put(consentModelSettings.Object__c+'Id' , (Id)temp.get('id'));
                 }
                 
                 share.put('UserOrGroupId' , str);
                 lstShare.add(share);
            }
        }
      }
      insert lstShare;
    }
    
    /**
    *  Description of the purpose of the class's method. 
    *  @name    :	finish
    *  @param   :	database.batchableContext     :   Context variable which store the runtime information
    *  @purpose :	Gets invoked when the batch job finishes.
    */
   global void finish(Database.BatchableContext BC){
       indexVal = String.valueOf(Integer.valueOf(indexVal) + 1);
       consentModelSettings = ConsentModel__c.getinstance(indexVal);
       if(consentModelSettings != null){
            PatientConsentDataDomainSharing newBatch = new PatientConsentDataDomainSharing(indexVal);
            Database.executeBatch(newBatch,2000);
       }
   }
}