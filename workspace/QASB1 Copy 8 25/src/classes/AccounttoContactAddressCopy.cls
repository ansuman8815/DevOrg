global class AccounttoContactAddressCopy implements Database.Batchable<sObject> , Database.Stateful{
   /**
        AccounttoContactAddressCopy newBatch = new AccounttoContactAddressCopy();
        Database.executeBatch(newBatch,100);
   **/
    
    global AccounttoContactAddressCopy(){

    }
   
   global Database.QueryLocator start(Database.BatchableContext BC){
        List<String> lstTestContactids = new List<String>();lstTestContactids.add('0034100000aHyXJ');
        String RecordTypeId = [SELECT DeveloperName,Id,SobjectType FROM RecordType where SobjectType='Contact' and Name = 'Individual' limit 1].id;
        String query = 'SELECT id,Accountid,Account.ShippingStreet,Account.ShippingCity,Account.ShippingState,Account.ShippingCountry,Account.ShippingPostalCode,'+
                        'MailingStreet,MailingCity,MailingState,MailingCountry,MailingPostalCode FROM Contact' +
                        ' WHERE RecordTypeId=:RecordTypeId';
        System.Debug('--Query--'+query);
        return Database.getQueryLocator(query);

    }

   global void execute(Database.BatchableContext BC, List<Contact> scope){
        List<Account> lstUpdatedAccounts = new List<Account>();
        List<Reparenting_Job_Log__c> lstLogs = new List<Reparenting_Job_Log__c>();
        Map<Id,Contact> mapConIdContact = new Map<Id,Contact>();
        Map<Id,Boolean> mapAccountIDUpdateReadyFlag = new Map<Id,Boolean>();
        //Iterate over the list to prepare a list of Account and Contact that needs to be updated
        for(Contact con:scope){
            //Assign Shipping Address on Account to MailingAddress on Contact
            	con.MailingStreet = String.isNotEmpty(con.Account.ShippingStreet)?con.Account.ShippingStreet:con.MailingStreet;                
                con.MailingCity = String.isNotEmpty(con.Account.ShippingCity)?con.Account.ShippingCity:con.MailingCity;
                con.MailingState = String.isNotEmpty(con.Account.ShippingState)?con.Account.ShippingState:con.MailingState;
                con.MailingPostalCode = String.isNotEmpty(con.Account.ShippingPostalCode)?con.Account.ShippingPostalCode:con.MailingPostalCode;
                con.MailingCountry = String.isNotEmpty(con.Account.ShippingCountry)?con.Account.ShippingCountry:con.MailingCountry;
        }
        
        //Update Contact records
        Database.saveResult[] lstContactSaveResult = Database.Update(scope,false);
        for(integer i=0;i<scope.size();i++){
            Database.saveResult sr = lstContactSaveResult[i];
            //Contact con = mapConIdContact.values()[i];
            if(sr.isSuccess()){
                //Create a map of account id and a boolean that indicates the ShippingAddress can now be blanked out
                //on Account as the Contact has successfully been updated
                System.Debug('Inside success-- printing scope[i].Accountid--'+scope[i].Accountid);
                mapAccountIDUpdateReadyFlag.put(scope[i].Accountid,true);
            }
            else{
                //Insert the a record into the job log table for tracking purpose
                Reparenting_Job_Log__c rjl = new Reparenting_Job_Log__c();
                rjl.Object_Name__c = 'Contact';
                rjl.Record_Id__c = String.valueOf(scope[i].id);
                rjl.Type__c = 'DMLError';
                rjl.Error_Message__c = '';                
                for(Database.Error err : sr.getErrors()) {
                    rjl.Error_Message__c = rjl.Error_Message__c+'==='+err.getStatusCode();
                }
                lstLogs.add(rjl);
            }
        }
        for(integer i=0;i<scope.size();i++){
            //if mapAccountIDUpdateReadyFlag doesn't contain one of the Accountids remove from Scope list.
            if(mapAccountIDUpdateReadyFlag.containskey(scope.get(i).Accountid)){
                Account acc = new Account();
                acc.id = scope.get(i).Accountid;
                acc.ShippingStreet = '';
                acc.ShippingCity = '';
                acc.ShippingState = '';
                acc.ShippingCountry = '';
                acc.ShippingPostalCode = '';
                lstUpdatedAccounts.add(acc);
            }
        }

        //Update Account Records
        Database.saveResult[] lstAccountSaveResult = Database.update(lstUpdatedAccounts,false);
        for(integer i=0;i<lstUpdatedAccounts.size();i++){
            Database.saveresult sr=lstAccountSaveResult[i];
            if(!sr.isSuccess()){
                //Insert a record into the job log table for tracking purpose
                Reparenting_Job_Log__c rjl = new Reparenting_Job_Log__c();
                rjl.Object_Name__c = 'Account';
                rjl.Record_Id__c = String.valueOf(lstUpdatedAccounts[i].id);
                rjl.Type__c = 'DMLError';
                rjl.Error_Message__c = '';                
                for(Database.Error err : sr.getErrors()) {
                    rjl.Error_Message__c = rjl.Error_Message__c+'==='+err.getStatusCode();
                }
                lstLogs.add(rjl);
            }
        }
       Database.SaveResult[] lstLogSaveResult = Database.insert(lstlogs,false);
	
    }

   global void finish(Database.BatchableContext BC){
        System.Debug('--DONE EXECUTING--');
   }
}