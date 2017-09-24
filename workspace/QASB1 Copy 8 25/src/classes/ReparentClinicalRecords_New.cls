global class ReparentClinicalRecords_New implements Database.Batchable<sObject> , Database.Stateful{
   /**
        ReparentClinicalRecords newBatch = new ReparentClinicalRecords('1', boolean);
        Database.executeBatch(newBatch);
   **/
    String indexVal = '';
    String debug='';
    //Boolean value to indicate if batch cascading required or not.
    Boolean isCascade;
    ConsentModel__c consentModelSettings;
    
    global ReparentClinicalRecords_New(String index , Boolean isCascade){
        this.indexVal = index;
        this.isCascade = isCascade;
    }
   
   global Database.QueryLocator start(Database.BatchableContext BC){
      consentModelSettings = ConsentModel__c.getinstance(indexVal);
      //List<Id> lstAccountIds = new List<Id>{'0014100000UIgO0'};
      String query = '';
      if(consentModelSettings != null){
        //query = 'SELECT ' + consentModelSettings.Source_System_Key__c+','+consentModelSettings.Source_System_MRN_Key__c+','+consentModelSettings.Account_Key__c+'.'+consentModelSettings.Account_MRN_Key__c+','+ consentModelSettings.Account_Api__c+ ' FROM ' + consentModelSettings.Object__c+' WHERE '+consentModelSettings.Account_Api__c+' IN :lstAccountIds';
        query = 'SELECT ' + consentModelSettings.Source_System_Key__c+','+consentModelSettings.Source_System_MRN_Key__c+','+consentModelSettings.Account_Key__c+'.'+consentModelSettings.Account_MRN_Key__c+','+ consentModelSettings.Account_Api__c+ ' FROM ' + consentModelSettings.Object__c;
        if(consentModelSettings.whereClause__c!=null)
            query = query+' WHERE '+consentModelSettings.whereClause__c;
        system.debug('query :: ' + query);
      }
      return Database.getQueryLocator(query);
    }

   global void execute(Database.BatchableContext BC, List<sObject> scope){
      Set<String> setAccountSSIds = new Set<String>();
      List<Account> lstAccounts = new List<Account>();
      Map<String,Id> mapAccSSIdRecId = new Map<String,Id>();
      List<sObject> lstAffectedRecs = new List<sObject>();
      List<Sobject> lstUpdatedRecs = new List<Sobject>();
      List<Reparenting_Job_Log__c> lstLogs = new List<Reparenting_Job_Log__c>();
      List<Patient_Consent_Facility__c> lstPCS = new List<Patient_Consent_Facility__c>();
      Map<string,string> mapOldAccidNewAccid = new Map<string,string>();
      //List of records queried
      for(Sobject temp:scope){
        System.DEBUG('--SCOPE--'+temp);  
      }
      
      //Iterate through the list and check if the concatenation of Source System MRN and Source System is matching with the Source System Id column of the related Account record
      for(sObject temp:scope){
        String Source_System_MRN_Key = String.valueOf(temp.get(consentModelSettings.Source_System_MRN_Key__c));
        String Source_System_Key = String.valueOf(temp.get(consentModelSettings.Source_System_Key__c));
        String concatenatedKey = Source_System_MRN_Key+'~'+Source_System_Key;
        String Account_Source_System_Id = String.valueOf(temp.getSobject(consentModelSettings.Account_Key__c).get(consentModelSettings.Account_MRN_Key__c));
        System.debug('--concatenatedKey--'+concatenatedKey);
        System.debug('--Account_Source_System_Id--'+Account_Source_System_Id);
        if(concatenatedKey.equals(Account_Source_System_Id)==false){

            setAccountSSIds.add(concatenatedKey);
            lstAffectedRecs.add(temp);
        }
      }
      System.debug('--setAccountSSIds--'+setAccountSSIds);
      SYSTEM.DEBUG('--LIST of Affected Records--'+lstAffectedRecs);
      //Query the list of Account ids associated with the Source System Ids and create a map of Source System Id and Account id
      lstAccounts = [SELECT Id, HealthCloudGA__SourceSystemId__c from Account WHERE HealthCloudGA__SourceSystemId__c IN :setAccountSSIds];
      for (Account acc:lstAccounts){
        mapAccSSIdRecId.put(acc.HealthCloudGA__SourceSystemId__c,acc.Id);
      }
      
      System.debug('--mapAccSSIdRecId--'+mapAccSSIdRecId);
      //Iterate the Sobject list and link it with the new Account record
      for(Sobject temp:lstAffectedRecs){
        String Source_System_MRN_Key = String.valueOf(temp.get(consentModelSettings.Source_System_MRN_Key__c));
        String Source_System_Key = String.valueOf(temp.get(consentModelSettings.Source_System_Key__c));
        String concatenatedKey = Source_System_MRN_Key+'~'+Source_System_Key;
        System.debug('--mapkey--'+concatenatedKey);
        if(mapAccSSIdRecId.containsKey(concatenatedKey)){
            System.debug('--inside if--');
            temp.put(consentModelSettings.Account_Api__c,mapAccSSIdRecId.get(concatenatedKey));  
            lstUpdatedRecs.add(temp);  
        }
      }
      
      for(sObject temp:lstAffectedRecs){
        system.debug('--UPDATED LIST--'+temp);
      }
      Database.saveResult[] saveResults =  Database.update(lstUpdatedRecs,false);

      for (Database.SaveResult sr : saveResults) {
            if (sr.isSuccess()) {
                // Operation was successful, so get the ID of the record that was processed
                //System.debug('Successfully inserted account. Account ID: ' + sr.getId());
            }
            else {
                // Operation failed, so get all errors
                Reparenting_Job_Log__c rjl = new Reparenting_Job_Log__c();
                rjl.Object_Name__c = consentModelSettings.Object__c;
                rjl.Record_Id__c = String.valueOf(sr.getId());
                rjl.Error_Message__c = '';                
                for(Database.Error err : sr.getErrors()) {
                    rjl.Error_Message__c = rjl.Error_Message__c+'==='+err.getStatusCode();
                }
                lstLogs.add(rjl);
            }
        }
        if(lstLogs.size()>0)
        {
            Database.saveResult[] savelogResults =  Database.insert(lstLogs,false);
        }
    }

   global void finish(Database.BatchableContext BC){
       //system.debug('without incremented index :: ' + Integer.valueOf(indexVal));
       indexVal = String.valueOf(Integer.valueOf(indexVal) + 1);
       //system.debug('incremented index :: ' + indexVal);
       consentModelSettings = ConsentModel__c.getinstance(indexVal);
       if(consentModelSettings != null && isCascade){
            //ReparentClinicalRecords newBatch = new ReparentClinicalRecords(indexVal , isCascade);
            //Database.executeBatch(newBatch);
       }
   }
}