global without sharing class UtilityGeneral {
    
    @AuraEnabled
    // Method to get logged in user session Id
    public static void updateUserSession(String currentPage, String fname, String lname, String cin, String dob, String gender,String encounterId){
        system.debug(' Inside insertUserSession@@@@@@@@@@@@@@@ ' + UserInfo.getSessionId());
        List<User_Session__c> lstuserSession = [SELECT Id FROM User_Session__c WHERE user__c =: UserInfo.getUserId()];
        if(lstuserSession.size() > 0){
            lstuserSession[0].Current_Page__c = currentPage;
            lstuserSession[0].Encounter_Id__c= encounterId;
            System.debug('currentPagexx: ' + currentPage);
            System.debug('cin: ' + cin);
            System.debug('fname: ' + fname);
            System.debug('lname: ' + lname);
            System.debug('dob: ' + dob);
            System.debug('gender: ' + gender);
            if(fname !='' || lname !='' || cin !='' || dob !='' || gender !=''){
                if(lstuserSession[0].First_Name__c != fname)
                    lstuserSession[0].First_Name__c = fname;
                if(lstuserSession[0].Last_Name__c != lname)
                    lstuserSession[0].Last_Name__c = lname;
                if(lstuserSession[0].CIN__c != cin)
                    lstuserSession[0].CIN__c = cin;
                if(lstuserSession[0].DOB__c != dob)
                    lstuserSession[0].DOB__c = dob;
                if(lstuserSession[0].Gender__c != gender)
                    lstuserSession[0].Gender__c = gender;
            }
            update lstuserSession;
        }
        else{
            User_Session__c updateuserSes = new User_Session__c();
            updateuserSes.user__c = UserInfo.getUserId();
            updateuserSes.Current_Page__c = currentPage;
            updateuserSes.Encounter_Id__c=encounterId;
            updateuserSes.First_Name__c = fname;
            updateuserSes.Last_Name__c = lname;
            updateuserSes.CIN__c = cin;
            updateuserSes.DOB__c = dob;
            updateuserSes.Gender__c = gender;
            insert updateuserSes;
        }
    }
    
    @AuraEnabled
    public static void logHIPAAAudit(String empi ,String hc_DataComponent){
        System.debug('Inside LogHIPAAAudit ' +empi);
        System.debug('Tab name' +hc_DataComponent);
        HIPAAAuditLogin__c hipaaauidLogObj=HIPAAAuditLogin__c.getInstance(hc_DataComponent);
        if(hipaaauidLogObj!=null && empi != null )
        {
            HIPAAAuditLogController.logAccess(empi, hc_DataComponent);
        }
    }
    
    @AuraEnabled
    public static boolean checkPatientConsentForCurrentUser(Id Accid, String Empi){
        PatientSearchController.checkPatientsConsentForCurrentUser(Accid);
        return PatientSearchController.mapAccountidConsentFlag.get(Empi);
    }
    
    public static map<String, List<Contact>> fetchPatients(Set<String> setEMPI){
        //A map of account Id and its most recent (based on source system of most recent enounter) EHR patient
        Map<String, List<Contact>> mapEMPIToContact = new  map<String, List<Contact>>();
        
        Set<String> setContactId = new Set<String>(); 
        //construct map of account Id and corresponding source system from recent encounter
        Map<String, String> mapEMPIToSourceSystem = new map<String, String>();
        
        for (HealthCloudGA__EhrEncounter__c encounter : [SELECT HealthCloudGA__SourceSystem__c, HealthCloudGA__Account__r.EMPI__c
                                                         FROM HealthCloudGA__EhrEncounter__c 
                                                         WHERE HealthCloudGA__Account__r.EMPI__c  IN: setEMPI
                                                         ORDER BY HealthCloudGA__Account__r.EMPI__c,HealthCloudGA__PeriodStart__c desc]){
                                                         //add to the map only if that account is not already there in map so that the map would always have most recent encounter
                                                         if (!mapEMPIToSourceSystem.containsKey(encounter.HealthCloudGA__Account__r.EMPI__c))
                                                            mapEMPIToSourceSystem.put(encounter.HealthCloudGA__Account__r.EMPI__c, encounter.HealthCloudGA__SourceSystem__c);
														 
        }
        system.debug('mapEMPIToSourceSystem :: ' + mapEMPIToSourceSystem);
        String ContactQuery ='SELECT Id, MailingStreet, MailingPostalCode, AccountId,Account.Phone,Account.PCP__c,Account.Source_Name__c,Account.EMPI__c,Account.Middle_Name__c,' 
                            + 'Account.Last_Name__c,Account.First_Name__c, Account.HealthCloudGA__SourceSystem__c,Account.Date_of_Birth__c, Account.GenderLabel__c, Account.Medicaid_CIN__c FROM Contact'
							 +' WHERE Account.EMPI__c IN :setEMPI ORDER BY Account.EMPI__c,Account.lastModifiedDate desc';                  
        
        List<Contact> lstRelatedCnt = Database.query(ContactQuery);
        System.debug('lstRelatedCnt::'+lstRelatedCnt);
        for(Contact con : lstRelatedCnt){
            //check if the account is already added to the map 
            if (!mapEMPIToContact.containsKey(con.Account.EMPI__c) ){
                System.debug('Empi'+con.Account.EMPI__c);
                if(con.Account.HealthCloudGA__SourceSystem__c != null && con.Account.HealthCloudGA__SourceSystem__c.equals(mapEMPIToSourceSystem.get(con.Account.EMPI__c))){
                    List<Contact> lstEMPICon = new List<Contact>();
                    lstEMPICon.add(con);
                    mapEMPIToContact.put(con.Account.EMPI__c, lstEMPICon); 
                    
                    setContactId.add(con.Id);
                }
            }
        }
        System.debug('mapEMPIToContact1 :: ' + mapEMPIToContact);
        for (Contact contact : lstRelatedCnt){
            System.debug('Empi.......'+contact.Account.EMPI__c);
            if (!mapEMPIToContact.containsKey(contact.Account.EMPI__c))
                mapEMPIToContact.put(contact.Account.EMPI__c, new List<Contact>()); 
    
            if (!setContactId.contains(contact.Id))
                mapEMPIToContact.get(contact.Account.EMPI__c).add(contact); 
        }
		System.debug('mapEMPIToContact :: ' + mapEMPIToContact); 
        return mapEMPIToContact;
    }
    
    
    public static String getLastETLRef()
    {
        String refdate;
        ETL_Refresh_Date__c dataRefreshObj = ETL_Refresh_Date__c.getValues(UtilityData.labelLastRefreshDate);
        if(dataRefreshObj != null && dataRefreshObj.Refresh_Datetime__c != null)
        refdate=String.valueof(dataRefreshObj.Refresh_Datetime__c.format('dd/MM/yyyy'));
        return refdate;
    }
  
}