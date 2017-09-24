global class MissingAccounts implements Database.Batchable<sObject> {

    global Database.QueryLocator start (Database.BatchableContext BC) {
        String query = 'SELECT PatientKey__c, Processed__c, NoEhrPatient__c, ExistingAcct__c FROM MissingAcct__c';
        return Database.getQueryLocator(query);
    }
    
    global void execute(Database.BatchableContext BC, List<MissingAcct__c> missingAccts) {
    
        // This is where we'll be inserting from:
        List<Account> newAccounts = new List<Account>();
        
        // This is the list of Patient Keys that have no corresponding Account:
        //List<MissingAcct__c> missingAccts = [SELECT PatientKey__c, Processed__c, NoEhrPatient__c, ExistingAcct__c FROM MissingAcct__c];
        
        for (MissingAcct__c missingAcct : missingAccts) {
            
            // Get the EhrPatient object corresponding to the Patient Key. Because SourceSystemId is 
            //  a unique field, there should be only one:
            List<HealthCloudGA__EhrPatient__c> patients = [SELECT HealthCloudGA__Account__c, HealthCloudGA__SourceSystem__c, HealthCloudGA__SourceSystemId__c FROM HealthCloudGA__EhrPatient__c WHERE HealthCloudGA__SourceSystemId__c = :missingAcct.PatientKey__c];
            
            if (patients.size() > 0) {
                // Get the list of Accounts corresponding to the Account__c field in the EhrPatient record.
                //   There should be only one.
            	List<Account> origAccts = [SELECT Id, Name, RecordTypeId, HealthCloudGA__IndividualType__c, IsHiddenfromP360UI__c, Medicaid_CIN__c, EMPI__c, Date_of_Birth__c, Middle_Name__c, Last_Name__c, GenderLabel__c, ShippingAddress, ShippingCountry, IsAttributed__c, HealthCloudGA__SourceSystemId__c, HealthCloudGA__MedicalRecordNumber__c, First_Name__c, Race_Label__c, Ethnicity_Label__c, ShippingStreet, ShippingCity, ShippingPostalCode, ShippingState, Date_Of_Death__c, Phone, Mobile_Phone__c, Work_Phone__c, Primary_Language__c, Secondary_Language__c, PCP__c, HealthCloudGA__SourceSystem__c FROM Account WHERE Id = :patients[0].HealthCloudGA__Account__c];
            	
                if (origAccts.size() > 0) {
                    // If the retrieved Account's SourceSystemId doesn't match what was in the
                    //   retrieved EhrPatient record, clone the Account and overwrite the clone's
                    //   SourceSystem and SourceSystemId fields:
                    if (origAccts[0].HealthCloudGA__SourceSystemId__c.compareTo(patients[0].HealthCloudGA__SourceSystemId__c) <> 0) {
                		Account newAcct = origAccts[0].clone();
                    	newAcct.HealthCloudGA__SourceSystem__c = patients[0].HealthCloudGA__SourceSystem__c;
                    	newAcct.HealthCloudGA__SourceSystemId__c = patients[0].HealthCloudGA__SourceSystemId__c;
                    	newAccounts.add(newAcct);
                    }
                    else {
                        missingAcct.ExistingAcct__c = true;
                    }
            	}
            }
            else {
                missingAcct.NoEhrPatient__c = true;
            }
            
            missingAcct.Processed__c = true;
        }
        
        // Insert the new accounts:
        insert newAccounts;
        // Update the list of missing accounts:
        update missingAccts;
        
    }
    
    global void finish(Database.BatchableContext BC) { 
    }
    
}