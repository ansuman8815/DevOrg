/**
	@Author      :   Cognizant Technology Solutions
	@name        :   ConsentModelSharingCalculation
	@CreateDate  :   29/05/2017
	@Description :   To create ConsentModelSharingCalculation
	@Version     :   1.0
	@Step		 :   ConsentModelSharingCalculation newBatch = new ConsentModelSharingCalculation('1', boolean);
        			 Database.executeBatch(newBatch);
*/
global class ConsentModelSharingCalculation implements Database.Batchable<sObject> , Database.Stateful{
	/**
    *  @VariableDeclaration   :	1. indexVal		:   Captures the value for index
                    			2. isCascade	:   Boolean value to indicate if batch cascading required or not
    */
    String indexVal = '';
    Boolean isCascade;
    ConsentModel__c consentModelSettings;
    /**
    *  Description of the purpose of the class's method. 
    *  @name    :	ConsentModelSharingCalculation
    *  @param   :	1. index     :   Captures the value for index.
                  	2. isCascade    :   Boolean value to indicate if batch cascading required or not.	
    */
    global ConsentModelSharingCalculation(String index , Boolean isCascade){
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
   global Database.QueryLocator start(Database.BatchableContext BC){
      consentModelSettings = ConsentModel__c.getinstance(indexVal);
      String query = '';
      if(consentModelSettings != null){
        query = 'SELECT ' + consentModelSettings.Account_Api__c + ' FROM ' + consentModelSettings.Object__c ;
        if(consentModelSettings.whereClause__c != null) 
            query = query + ' WHERE ' + consentModelSettings.whereClause__c;
      }
      return Database.getQueryLocator(query);
    }

   /**
    *  Description of the purpose of the class's method. 
    *  @name    : 	execute
    *  @param   :	database.batchableContext     :   Context variable which store the runtime information
    *  @purpose : 	Gets invoked when the batch job executes and operates on one batch of records.
    */ 
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
                 
                 share.put('UserOrGroupId' , str);//FacilityPublicGroupId__c
                 lstShare.add(share);
            }
        }
      }
      //INSERT the sharing records
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
       if(consentModelSettings != null && isCascade){
            ConsentModelSharingCalculation newBatch = new ConsentModelSharingCalculation(indexVal , isCascade);
            Database.executeBatch(newBatch,2000);
       }
   }
}