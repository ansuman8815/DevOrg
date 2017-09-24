global class AccountExploder implements Database.Batchable<sObject> {

    global Database.QueryLocator start (Database.BatchableContext BC) {
        String query = 'SELECT Account__c, EMPI__c, MRN__c, SourceSystem__c, SourceSystemId__c FROM AcctExplosion__c';
        return Database.getQueryLocator(query);
    }
    
    global void execute(Database.BatchableContext BC, List<AcctExplosion__c> patients) {
        
        List<Account> newAccts = new List<Account>();
        List<NewAccts__c> newAcctsLog = new List<NewAccts__c>();
        
        for (AcctExplosion__c acct : patients) {
        	List<HealthCloudGA__EhrPatient__c> ehrPats = [SELECT Id, HealthCloudGA__Account__c, HealthCloudGA__SourceSystemId__c, HealthCloudGA__MedicalRecordNumber__c, Race__c, Ethnicity__c, HealthCloudGA__Address1Line1__c, HealthCloudGA__Address1City__c, HealthCloudGA__Address1PostalCode__c, HealthCloudGA__Address1State__c, Date_Of_Death__c, HealthCloudGA__Telecom1Value__c, HealthCloudGA__Telecom1Use__c, HealthCloudGA__Telecom2Value__c, HealthCloudGA__Telecom2Use__c, HealthCloudGA__Telecom3Value__c, HealthCloudGA__Telecom3Use__c, HealthCloudGA__Communication1Label__c, HealthCloudGA__Communication2Label__c, PCP__c, HealthCloudGA__SourceSystem__c FROM HealthCloudGA__EhrPatient__c WHERE HealthCloudGA__Account__c = :acct.Account__c];
			List<Account> origAccts = [SELECT Id, Name, RecordTypeId, HealthCloudGA__IndividualType__c, IsHiddenfromP360UI__c, Medicaid_CIN__c, EMPI__c, Date_of_Birth__c, Middle_Name__c, Last_Name__c, GenderLabel__c, ShippingAddress, ShippingCountry, IsAttributed__c, HealthCloudGA__SourceSystemId__c, HealthCloudGA__MedicalRecordNumber__c, First_Name__c, Race_Label__c, Ethnicity_Label__c, ShippingStreet, ShippingCity, ShippingPostalCode, ShippingState, Date_Of_Death__c, Phone, Mobile_Phone__c, Work_Phone__c, Primary_Language__c, Secondary_Language__c, PCP__c, HealthCloudGA__SourceSystem__c FROM Account WHERE Id = :acct.Account__c];
            for (HealthCloudGA__EhrPatient__c ehrPat : ehrPats) {
                
                // Start by retrieving the original Account object and cloning it for each
                //  copy of EhrPatient__c (except for the one matching the existing Source System):
                if (origAccts.size() > 0) {
                    
                    // Check to make sure there are no accounts with the SourceSystemId we're trying to add:
                    Boolean okToAdd = true;
                    for (Account existingAcct : origAccts) {
                        if (ehrPat.HealthCloudGA__SourceSystemId__c.compareTo(existingAcct.HealthCloudGA__SourceSystemId__c) == 0) {
                            // found it.  Don't add the new account.
                            okToAdd = false;
                        }
                    }

                    if (okToAdd) {
                        // if we got here, then we have an EhrPatient record whose Source System Id
                        //   doesn't match that of the original account, so we need to create a 
                        //   new Account.  Start with a clone, and then overwrite each of the
                        //   fields with data from the EhrPatient record that may be different.
                       
                		Account newAcct = origAccts[0].clone(false, false, false, false);
                        newAcct.RecordTypeId = origAccts[0].RecordTypeId;
                		newAcct.HealthCloudGA__SourceSystemId__c = ehrPat.HealthCloudGA__SourceSystemId__c;
                        newAcct.HealthCloudGA__SourceSystem__c = ehrPat.HealthCloudGA__SourceSystem__c;
                		newAcct.HealthCloudGA__MedicalRecordNumber__c = ehrPat.HealthCloudGA__MedicalRecordNumber__c;
                        newAcct.Race_Label__c = ehrPat.Race__c;
                        newAcct.Ethnicity_Label__c = ehrPat.Ethnicity__c;
                        newAcct.Date_of_Death__c = ehrPat.Date_of_Death__c;
                        newAcct.PCP__c = ehrPat.PCP__c;
                        newAcct.Primary_Language__c = ehrPat.HealthCloudGA__Communication1Label__c;
                        newAcct.Secondary_Language__c = ehrPat.HealthCloudGA__Communication2Label__c;
                        newAcct.ShippingStreet = ehrPat.HealthCloudGA__Address1Line1__c;
                        newAcct.ShippingCity = ehrPat.HealthCloudGA__Address1City__c;
                        newAcct.ShippingState = ehrPat.HealthCloudGA__Address1State__c;
                        newAcct.ShippingPostalCode = ehrPat.HealthCloudGA__Address1PostalCode__c;
                        newAcct.Phone = ehrPat.HealthCloudGA__Telecom1Value__c;
                        newAcct.Mobile_Phone__c = ehrPat.HealthCloudGA__Telecom2Value__c;
                        newAcct.Work_Phone__c = ehrPat.HealthCloudGA__Telecom3Value__c;
                        
              			newAccts.add(newAcct);
                        
                        // Add to the origAccts list, too.  In EhrPatient, SourceSystemId
                        //  is not marked as unique, while in Account it is.  This led to
                        //  sometimes trying to create 2 Account records with the same
                        //  SourceSystemId.
                        origAccts.add(new Account(Name = newAcct.Name, HealthCloudGA__SourceSystemId__c = newAcct.HealthCloudGA__SourceSystemId__c));
                    }
                    
            	}
            }
        }
        insert newAccts;
        
        // Save a log of the new accts created, just in case:

        for (Account newAcct : newAccts) {
            NewAccts__c newAcctLog = new NewAccts__c(NewAcct__c = newAcct.Id);
            newAcctsLog.add(newAcctLog);
        }
        insert newAcctsLog;

        
    }
    
    global void finish(Database.BatchableContext BC) {
        
    }
    
}