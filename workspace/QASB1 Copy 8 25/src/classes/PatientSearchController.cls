/*
Description: 1. Search Patient Data on the basis of First Name and Last Name
             2. Returns the Patient Data as per search parameters
Created By : Cognizant Technology Solutions
Create Date: 22/02/2017
*/

global  without sharing class PatientSearchController {
    public static map<String,Boolean> mapAccountidConsentFlag = new map<String,Boolean>();
    
    // Method to fetch Patient's data on the basis of First Name, Last Name or CIN
    @AuraEnabled 
    public static List<DisplayPatientRecords> getSearchPatientData(String firstName , String lastName , String gender,
                                                                   String cinNo, String dob) {
            
        String fn = '';
        String ln = '';
        String cin = '';
        String gd;
        System.debug(dob);  
        if(firstName != null && firstName != '')
            fn = firstName.trim() + '%';
        if(lastName != null && lastName != '')
            ln = lastName.trim() + '%';
        if(gender != null && gender.length() > 1)
            gd = gender.substring(0,1) + '%';
        else
            gd = gender + '%';
        if(cinNo != null && cinNo != '')
            cin =  cinNo.trim();
        date dateOfBirth;
        
        String sWhereclause = '';
        String finalQuery = 'Select AccountId , Account.EMPI__c from Contact';
        
        if (firstName != null && firstName != '')
            sWhereclause = ' WHERE Account.First_Name__c LIKE : fn ';
        if (lastName != null && lastName != ''){
            if(sWhereclause != null && sWhereclause != '')
                sWhereclause = sWhereclause + ' AND Account.Last_Name__c like : ln ';
            else
                sWhereclause = ' WHERE Account.Last_Name__c like : ln ';
        }
                                                                       
        if (cinNo != null && cinNo != ''){
            if(sWhereclause != null && sWhereclause != '')
                sWhereclause = sWhereclause + ' AND Account.Medicaid_CIN__c like : cin ';
            else
                sWhereclause = ' WHERE Account.Medicaid_CIN__c like : cin ';
        }
        
        if (gender != null && gender != ''){
            if(sWhereclause != null && sWhereclause != '')
                sWhereclause = sWhereclause + ' AND Account.GenderLabel__c like : gd ';
            else
                sWhereclause = ' WHERE Account.GenderLabel__c like : gd ';
        }
        System.debug('dob: ' + dob);
        if (dob != null && dob != ''){
            System.debug('dateOfBirth: ');
            dateOfBirth = date.parse(dob);
            
            if(sWhereclause != null && sWhereclause != '')
            {
                sWhereclause = sWhereclause + ' AND Account.Date_of_Birth__c = : dateOfBirth ';
                System.debug('Inside the if Swhere: '+sWhereclause);
            }
                
            else
            {
                sWhereclause = ' WHERE Account.Date_of_Birth__c = : dateOfBirth ';
                System.debug('Inside the else Swhere: '+sWhereclause);
            }
                
        }
        System.debug('Final query  before appending the sWhereclause '+finalQuery);
        finalQuery = finalQuery + sWhereclause +'AND Account.isHiddenFromP360UI__c=False AND Account.EMPI__c!=null' +' ORDER BY Account.EMPI__c ';
                                                                   
        List<DisplayPatientRecords> lstWrapper = new List<DisplayPatientRecords>();
        List<Contact> contactList = Database.query(finalQuery);
        Set<String> setEMPI = new Set<String>();
        for(Contact con : contactList){
            //if(con.Account.EMPI__c!=null)
            setEMPI.add(con.Account.EMPI__c);
        }
        
        Map<String, List<Contact>> mapEMPIToContact = UtilityGeneral.fetchPatients(setEMPI);
        System.debug('mapEMPIToAccount in pat search:: ' + mapEMPIToContact); 
        checkPatientConsentForCurrentUser(mapEMPIToContact);  
        
        for (String empId : setEMPI){
            List<Contact> lstParentContact = new List<Contact>();
            List<Contact> lstContacts = new List<Contact>();
            if(mapEMPIToContact.containsKey(empId))
                lstContacts = mapEMPIToContact.get(empId);  
            List<Contact> lstChildContacts= new List<Contact>();
            Boolean isFirst = true; 
            String name = '';
            
            for (Contact contactData : lstContacts){
                System.debug('Inside the Ehr Patient Loop');
                if(isFirst){
                    String middleName = String.isNotBlank(contactData.Account.Middle_Name__c) ? contactData.Account.Middle_Name__c : ' ';
                    String displayname = contactData.Account.Last_Name__c+', '+ contactData.Account.First_Name__c + ' ' + middleName;
                    name = '<button id="patientName" name=' + contactData.AccountId +':'+mapAccountidConsentFlag.get(contactData.Account.EMPI__c)
                            + ' value=' + contactData.Account.EMPI__c +
                            ' onclick=\'{!c.navigateToDetail}\' class=\'anchorClass\'>' + displayname + '</button>'; 
                    lstParentContact.add(contactData); 
                    isFirst = false;
                }
                else {
                    lstChildContacts.add(contactData); 
                }
            }
            if(!lstParentContact.isEmpty() && lstParentContact[0].Account != null){
                DisplayPatientRecords displayPatientRecordsWrapper = new DisplayPatientRecords(name, string.valueof(lstParentContact[0].Account.Date_of_Birth__c), 
                                                                                lstParentContact[0].Account.GenderLabel__c, lstParentContact[0].Account.Medicaid_CIN__c, 
                                                                                lstParentContact[0].AccountId, lstParentContact[0].Account.Phone, 
                                                                                lstParentContact[0].MailingStreet, lstParentContact[0].MailingPostalCode, 
                                                                                lstParentContact[0].Account.HealthCloudGA__SourceSystem__c, lstChildContacts);
                lstWrapper.add(displayPatientRecordsWrapper);
            }
            System.debug('lstChildAccounts'+lstChildContacts);  
        }
        system.debug('lstWrapper :: ' + lstWrapper);                                                             
        return lstWrapper;  
    }
  
    global class DisplayPatientRecords {
     
        @AuraEnabled public string name;
        @AuraEnabled public string dob;
        @AuraEnabled public string gender;
        @AuraEnabled public string cin;
        @AuraEnabled public string id;
        @AuraEnabled public string homephone;
        @AuraEnabled public string streetaddress;
        @AuraEnabled public string mailingpostalcode;
        @AuraEnabled public List<Contact> lstChildAccounts;
        @AuraEnabled public string sourceSystem;
        global DisplayPatientRecords(string name, string dob, string gender, string cin, string id, string homephone, 
                                     string streetaddress,
                                     string mailingpostalcode, string sourceSystem, 
                                     List<Contact> lstChildAccounts){
            this.name = name == null ? '' : name;
            this.dob = dob == null ? '' : string.valueof(datetime.newInstance(Date.valueOf(dob).year(), 
                                                                              Date.valueOf(dob).month(),
                                                                              Date.valueOf(dob).day()).format('MM/dd/YYYY'));
            this.gender = gender == null ? '' : gender;
            this.cin = cin == null ? '' : cin;
            this.id = id == null ? '' : id;
            this.homephone = HomePhone == null ? '' : HomePhone;
            this.streetaddress = streetaddress == null ? '' : streetaddress;
            this.mailingpostalcode = mailingpostalcode == null ? '' : mailingpostalcode;
            this.sourceSystem = sourceSystem == null ? '' : sourceSystem;
            this.lstChildAccounts = lstChildAccounts;
        }
    }
    
    @AuraEnabled
    // Method to fetch the count of Patient records on the basis of search parameters
    public static Integer getSearchAccountDataCount(String firstName , String lastName , 
                                                    String gender, 
                                                    String cinNo, string dob)    
    {
        Integer count= 0;
        String fn = '';
        String ln = '';
        String cin = '';
        String gd;
        if(firstName != null && firstName != '')
            fn = firstName.trim() + '%';
        if(lastName != null && lastName != '')
            ln = lastName.trim() + '%';
        if(gender != null && gender.length() > 1)
            gd = gender.substring(0,1) + '%';
        else
            gd = gender + '%';
        if(cinNo != null && cinNo != '')
            cin =  cinNo.trim();
        date dateOfBirth;
        
        String sWhereclause = '';
        String finalQuery = ' SELECT Count(Id) FROM Account ';
        
        if (firstName != null && firstName != '')
            sWhereclause = ' WHERE First_Name__c LIKE : fn ';
        if (lastName != null && lastName != ''){
            if(sWhereclause != null && sWhereclause != '')
                sWhereclause = sWhereclause + ' AND Last_Name__c like : ln ';
            else
                sWhereclause = ' WHERE Last_Name__c like : ln ';
        }
        if (cinNo != null && cinNo != ''){
            if(sWhereclause != null && sWhereclause != '')
                sWhereclause = sWhereclause + ' AND Medicaid_CIN__c like : cin ';
            else
                sWhereclause = ' WHERE Medicaid_CIN__c like : cin ';
        }
        
        if (gender != null && gender != ''){
            if(sWhereclause != null && sWhereclause != '')
                sWhereclause = sWhereclause + ' AND GenderLabel__c like : gd ';
            else
                sWhereclause = ' WHERE GenderLabel__c like : gd ';
        }
        if (dob != null && dob != ''){
            dateOfBirth = date.parse(dob);
            if(sWhereclause != null && sWhereclause != '')
                sWhereclause = sWhereclause + ' AND Date_of_Birth__c = : dateOfBirth '; 
            else
                sWhereclause = ' WHERE Date_of_Birth__c = : dateOfBirth ';
        }
      
        finalQuery = finalQuery + sWhereclause +'and isHiddenFromP360UI__c=False';
        List<AggregateResult> accountList = Database.query(finalQuery);
        count = (Integer)accountList[0].get('expr0');
        return count;
    }
    
     @AuraEnabled
    // Method to get logged in user session Id
    public static void updateUserSession(String currentPage, String fname, String lname, String cin, 
                                         String dob, String gender,String encounterId){
        system.debug('Inside pat search updateUserSession');
        UtilityGeneral.updateUserSession(currentPage, fname, lname, cin, dob, gender,encounterId);
    }
   
    public static void checkPatientsConsentForCurrentUser(Id accountId){
        ID UserId = UserInfo.getUserId();
        //Query the Patient Facility Consent table for Facilities at which the User is credentialed at using 'lstFacilities'
        List<Patient_Consent_Facility__c> lstPCF = [SELECT Account__r.EMPI__c,Facility__c FROM Patient_Consent_Facility__c WHERE Account__c = :accountId and 
                                                    consent_status__c = 'Yes' AND Facility__c IN  (SELECT Facility__c FROM User_Credential_Facility__c WHERE User__c=:UserId)];

        //Iterate through the above list to generate the map of Accountids and patient consent
        for(Patient_Consent_Facility__c pcf:lstPCF){
            if(!mapAccountidConsentFlag.containsKey(pcf.Account__r.EMPI__c))
               mapAccountidConsentFlag.put(pcf.Account__r.EMPI__c,true);
        }
    }
    
    public static void checkPatientConsentForCurrentUser(Map<String, List<Contact>> mapEMPIToContact){
        ID UserId = UserInfo.getUserId();
        Set<Id> setAccountIds = new Set<Id>();
        for(String empI : mapEMPIToContact.keyset())
        {
            List<Contact> lstContact = mapEMPIToContact.get(empI);
            if(!lstContact.isEmpty() && lstContact[0].AccountId != null)
                setAccountIds.add(lstContact[0].AccountId);
        }
        
        //Query the Patient Facility Consent table for Facilities at which the User is credentialed at using 'lstFacilities'
        List<Patient_Consent_Facility__c> lstPCF = [SELECT Account__r.EMPI__c FROM Patient_Consent_Facility__c WHERE Account__c IN :setAccountIds and 
                                                    consent_status__c = 'Yes' AND Facility__c IN  (SELECT Facility__c FROM User_Credential_Facility__c WHERE User__c=:UserId)];

        //Iterate through the above list to generate the map of Accountids and patient consent
        for(Patient_Consent_Facility__c pcf:lstPCF){
            if(!mapAccountidConsentFlag.containsKey(pcf.Account__r.EMPI__c))
               mapAccountidConsentFlag.put(pcf.Account__r.EMPI__c,true);
        }
    }
  
 }