/**
	@Author      :	Cognizant Technology Solutions
	@name        :	UtilityGeneral
	@CreateDate  :	24/02/2017 
	@Description :  To 
	@Version     :	1.0
*/
global without sharing class UtilityGeneral {
    /**
	*  Description of the purpose of the class's method. 
	*  @name	:	updateUserSession
	*  @param   :	1.	currentPage	:	Captures the value for Patient currentPage
				  	2.	lastName	:	Captures the value for Patient fname
				  	3.	gender		:	Captures the value for Patient lname
				  	4.	cinNo	 	:	Captures the value for Patient cin	
				  	5.	dob	     	:	Captures the value for Patient dob
					6.	gender	    :	Captures the value for Patient gender
					7.	encounterId	:	Captures the value for Patient encounterId
	*  @purpose :	Method to get logged in user session Id.
	*/
    @AuraEnabled
    public static void updateUserSession(String currentPage, String fname, String lname, String cin, String dob, String gender,String encounterId){
        List<User_Session__c> lstuserSession = [SELECT Id FROM User_Session__c WHERE user__c =: UserInfo.getUserId()];
        if(lstuserSession.size() > 0){
            lstuserSession[0].Current_Page__c = currentPage;
            lstuserSession[0].Encounter_Id__c= encounterId;
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
    
    /**
	*  Description of the purpose of the class's method. 
	*  @name    :	logAccess
	*  @param   :	1. empi				:	Captures the value for EMPI of the Patient.
				  	2. hc_DataComponent	:	Captures the value of Data domain currently accessed by the logged in user.
	*  @purpose : 	When User access the patients data then log of the patient detail is created at that time,using this class.  
	*/
    @AuraEnabled
    public static void logHIPAAAudit(String empi ,String hc_DataComponent){
        HIPAAAuditLogin__c hipaaauidLogObj=HIPAAAuditLogin__c.getInstance(hc_DataComponent);
        if(hipaaauidLogObj!=null && empi != null )
        {
            HIPAAAuditLogController.logAccess(empi, hc_DataComponent);
        }
    }
    
    /**
	*  Description of the purpose of the class's method. 
	*  @name    :	checkPatientConsentForCurrentUser
	*  @param   :	1.	accountId	:	Captures the value for Patient Id
					2.	empi		:	Captures the value for empi
	*  @return	:	boolean
	*  @purpose :	Method to check patient has access to organization data.
	*/
    @AuraEnabled
    public static boolean checkPatientConsentForCurrentUser(Id Accid, String Empi){
        PatientSearchController.checkPatientsConsentForCurrentUser(Accid);
        return PatientSearchController.mapAccountidConsentFlag.get(Empi);
    }
    
    /**
	*  Description of the purpose of the class's method. 
	*  @name    :	fetchPatients
	*  @param   :	1.	empi	:	Captures the value for Set of empi.
	*  @return	:	mapEMPIToContact
	*  @purpose :	Method to fetch the patient which has most recent encounter and other patients.
	*/
    public static map<String, List<Contact>> fetchPatients(Set<String> setEMPI){
        Map<String, List<Contact>> mapEMPIToContact = new  map<String, List<Contact>>();
        
        Set<String> setContactId = new Set<String>(); 
        Map<String, String> mapEMPIToSourceSystem = new map<String, String>();
        
        for (HealthCloudGA__EhrEncounter__c encounter : [SELECT HealthCloudGA__SourceSystem__c, HealthCloudGA__Account__r.EMPI__c
                                                         FROM HealthCloudGA__EhrEncounter__c 
                                                         WHERE HealthCloudGA__Account__r.EMPI__c  IN: setEMPI
                                                         ORDER BY HealthCloudGA__Account__r.EMPI__c,HealthCloudGA__PeriodStart__c desc]){
                                                         if (!mapEMPIToSourceSystem.containsKey(encounter.HealthCloudGA__Account__r.EMPI__c))
                                                            mapEMPIToSourceSystem.put(encounter.HealthCloudGA__Account__r.EMPI__c, encounter.HealthCloudGA__SourceSystem__c);
														 
        }
        String ContactQuery ='SELECT Id, MailingStreet, MailingPostalCode, AccountId,Account.Phone,Account.PCP__c,Account.Source_Name__c,Account.EMPI__c,Account.Middle_Name__c,' 
                            + 'Account.Last_Name__c,Account.First_Name__c, Account.HealthCloudGA__SourceSystem__c,Account.Date_of_Birth__c, Account.GenderLabel__c, Account.Medicaid_CIN__c FROM Contact'
							 +' WHERE Account.EMPI__c IN :setEMPI ORDER BY Account.EMPI__c,Account.lastModifiedDate desc';                  
        
        List<Contact> lstRelatedCnt = Database.query(ContactQuery);
        for(Contact con : lstRelatedCnt){
            if (!mapEMPIToContact.containsKey(con.Account.EMPI__c) ){
                if(con.Account.HealthCloudGA__SourceSystem__c != null && con.Account.HealthCloudGA__SourceSystem__c.equals(mapEMPIToSourceSystem.get(con.Account.EMPI__c))){
                    List<Contact> lstEMPICon = new List<Contact>();
                    lstEMPICon.add(con);
                    mapEMPIToContact.put(con.Account.EMPI__c, lstEMPICon); 
                    setContactId.add(con.Id);
                }
            }
        }
        for (Contact contact : lstRelatedCnt){
            if (!mapEMPIToContact.containsKey(contact.Account.EMPI__c))
                mapEMPIToContact.put(contact.Account.EMPI__c, new List<Contact>()); 
    
            if (!setContactId.contains(contact.Id))
                mapEMPIToContact.get(contact.Account.EMPI__c).add(contact); 
        }
        return mapEMPIToContact;
    }
    
    
    /**
	*  Description of the purpose of the class's method. 
	*  @name    :	getLastETLRef
	*  @return	:	String
	*  @purpose :	Method to fetch Last ETL Refresh Date.
	*/
    public static String getLastETLRef()
    {
        String refdate;
        ETL_Refresh_Date__c dataRefreshObj = ETL_Refresh_Date__c.getValues(UtilityData.labelLastRefreshDate);
        if(dataRefreshObj != null && dataRefreshObj.Refresh_Datetime__c != null)
        refdate=String.valueof(dataRefreshObj.Refresh_Datetime__c.format('dd/MM/yyyy'));
        return refdate;
        
    }
    
    /**
	*  Description of the purpose of the class's method. 
	*  @name	:	getSourceVal
	*  @param	:	1.medical		:	Captures the records
					2.parentTag		:	Captures the value for parentTag in json
					3.childTagOne	:	Captures the value for childTagOne in json
					4.childTagTwo	:	Captures the value for childTagTwo in json
					5.codeOffset	:	Captures the index value
	*  @purpose :	To get the values from json string.
	*/
    public static String getSourceVal(String diag,String parentTag,String childTagOne,String childTagTwo,Integer codeOffset)
    {
        if(!String.isEmpty(parentTag))
        {
            codeoffset=diag.indexOf(parentTag,codeOffset);
            codeoffset+=parentTag.length();
        }
        if(!String.isEmpty(childTagOne))
        {
            codeoffset=diag.indexOf(childTagOne,codeOffset);
            codeoffset+=childTagOne.length();
         }
        codeOffset=diag.indexOf(childTagTwo, codeOffset);
        codeoffset+=childTagTwo.length();
        return getValue(diag, codeOffset);
    }
    
    /**
	*  Description of the purpose of the class's method. 
	*  @name	:	getValue
	*  @param	:	1.str		:	Captures the value for fields that are parsed
					2.offset	:	Captures the value index
	*  @purpose :	To get the substring values between given offset range.
	*/
    public static String getValue(String str, Integer offset) {
        String diagSystem;
        Integer i = str.indexOf('"', offset);
        if (i < 0) {
            diagSystem = 'not found...';
        } 
        else {
            offset = i + 1;
            i = str.indexOf('"', offset);
            diagSystem = str.substring(offset, i);
        }
        return diagSystem;
    }
  
}