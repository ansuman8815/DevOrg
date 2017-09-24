/**
    @Author      :   Cognizant Technology Solutions
    @name        :   PatientSummaryController
    @CreateDate  :   24/02/2017
    @Description :   1.Fetch Patient banner Data on the basis of Patient ID
                     2. Fetch Patient details/demographic Data on the basis of Patient ID
    @Version     :   1.0
*/

global without sharing class PatientSummaryController {
    /**
    *  Description of the purpose of the class's method. 
    *  @name    : PatientBannerData
    *  @purpose : Wrapper Class to pass the values to Patient Banner.
    */
    global class PatientBannerData {        
        @AuraEnabled public string name;
        @AuraEnabled public string dob;
        @AuraEnabled public string gender;
        @AuraEnabled public string cin;
        @AuraEnabled public string pcp;
        @AuraEnabled public string phone; 
        @AuraEnabled public string dataRefreshDate;
        @AuraEnabled public string lastEncDate;
        @AuraEnabled public string lastEncLocation;
        
        global PatientBannerData(string name, string dob, string gender, string cin, string pcp, string phone, string dataRefreshDate, string lastEncDate, string lastEncLocation){
            this.name = name == null ? '' : name;
            this.dob = dob == null ? '' : dob;
            this.gender = gender == null ? '' : gender;
            this.cin = cin == null ? '' : cin;
            this.pcp = pcp == null ? '' : pcp;
            this.phone = phone == null ? '' : phone;
            this.dataRefreshDate = dataRefreshDate == null ? '' : dataRefreshDate;
            this.lastEncDate = lastEncDate == null ? '' : lastEncDate;
            this.lastEncLocation = lastEncLocation == null ? '' : lastEncLocation;
        }
    }
    /**
    *  Description of the purpose of the class's method. 
    *  @name    : getPatientBannerData
    *  @return  : PatientBannerData[Returns the wrapper Class]
    *  @purpose :Method to fetch Patient Banner Data on the basis of Patient Id .
    */
    @AuraEnabled public static PatientBannerData getPatientBannerData (string patientId){
        
        List<Account> lstAcc = [SELECT HealthCloudGA__SourceSystem__c,first_name__c, middle_name__c, last_name__c, Date_of_Birth__c, GenderLabel__c, Medicaid_CIN__c, PCP__c, Phone, LastModifiedDate,Work_Phone__c FROM Account WHERE id = : patientid];
        List<HealthCloudGA__EhrEncounter__c> lstEncounter = [SELECT HealthCloudGA__PeriodStart__c, 
                                                             Encounter_Location_Formula__c, 
                                                             HealthCloudGA__Location1Description__c,
                                                             HealthCloudGA__SourceSystem__c FROM HealthCloudGA__EhrEncounter__c 
                                                             WHERE HealthCloudGA__Account__c = : patientid 
                                                             order by HealthCloudGA__PeriodStart__c  desc Limit 1];
        
        string name;
        string dob;
        string gender; 
        string cin;
        string pcp; 
        string phone;
        string dataRefreshDate;
        string lastEncDate;
        string lastEncLocation;
        
        if (!lstAcc.isEmpty()){
            string mdlname ;
            if (lstAcc[0].middle_name__c == null){
                mdlname = '';
            }
            else{
                mdlname = lstAcc[0].middle_name__c;
            }
            
            name = lstAcc[0].first_name__c + ' ' + mdlname + ' ' + lstAcc[0].last_name__c;
            if (lstAcc[0].Date_of_Birth__c != null) {
                Date dt = lstAcc[0].Date_of_Birth__c;
                dob = string.valueOf(datetime.newInstance(dt.year(), dt.month(), dt.day()).format('MMMMM dd, yyyy'));
                Integer days = lstAcc[0].Date_of_Birth__c.daysBetween(Date.Today());
                Integer age = Integer.valueOf(days/365);
                Integer months = lstAcc[0].Date_of_Birth__c.monthsBetween(Date.Today()); 
                Integer monthage = Integer.valueOf(math.mod(months,12));
                dob = dob + ' (' + string.valueOf(age) + ' years' + ')';
            }
            gender = lstAcc[0].GenderLabel__c;
            if (gender == 'M'){
                gender = 'Male';}
            else if (gender == 'F') {
                gender = 'Female';
            }
            
            cin = lstAcc[0].Medicaid_CIN__c;
            ETL_Refresh_Date__c dataRefreshObj = ETL_Refresh_Date__c.getValues(UtilityData.labelLastRefreshDate);
            if(dataRefreshObj != null && dataRefreshObj.Refresh_Datetime__c != null)
                dataRefreshDate = string.valueof(dataRefreshObj.Refresh_Datetime__c.format('MM/dd/yyyy')); 
            
            phone=lstAcc[0].Phone;
            pcp = lstAcc[0].PCP__c;
        }
        
        if (!lstEncounter.isEmpty()){
            if(lstEncounter[0].HealthCloudGA__PeriodStart__c != null){
                lastEncDate = string.valueof(lstEncounter[0].HealthCloudGA__PeriodStart__c.format('MM/dd/yyyy'));
            }
            lastEncLocation = lstEncounter[0].Encounter_Location_Formula__c;       
        }
       
        PatientBannerData patientData = new PatientBannerData (name, dob, gender, cin, pcp, phone, dataRefreshDate, lastEncDate, lastEncLocation);
        
        return patientData;
    } 
    
    /**
    *  Description of the purpose of the class's method. 
    *  @name    : PatientData
    *  @purpose : Wrapper Class to pass the values to Patient Banner. .
    */
    global class PatientData {        
        @AuraEnabled public string name;
        @AuraEnabled public string dob;
        @AuraEnabled public string gender;
        @AuraEnabled public string cin;
        @AuraEnabled public string pcp;
        @AuraEnabled public string mobilephone;
        @AuraEnabled public string dataRefreshDate;
        @AuraEnabled public string lastEncDate;
        @AuraEnabled public string lastEncLocation;
        
        @AuraEnabled public string mailingStreet;
        @AuraEnabled public string mailingCity;
        @AuraEnabled public string mailingState;
        @AuraEnabled public string mailingPostalCode;
        @AuraEnabled public string county;
        
        @AuraEnabled public string empi;
        @AuraEnabled public string phone;
        @AuraEnabled public string workPhone;
        @AuraEnabled public string primaryLanguage;
        @AuraEnabled public string secondaryLanguage;
        @AuraEnabled public string dod;
        @AuraEnabled public string raceLabel;
        @AuraEnabled public string ethnicity;
        global PatientData(){}
    }
     /**
    *  Description of the purpose of the class's method. 
    *  @name    : getPatientName
    *  @return  : String 
    *  @purpose : Method to fetch Patient Name on the basis of Patient Id .
    */
    @AuraEnabled public static String getPatientName (String patientId){
        
        List<Account> lstAcc = [Select first_name__c, middle_name__c, last_name__c from Account where id = : patientid];
        String name;        
        if (!lstAcc.isEmpty()){
            string mdlname ;
            if (lstAcc[0].middle_name__c == null){ mdlname = ''; }
            else{  mdlname = lstAcc[0].middle_name__c;  }
            name = lstAcc[0].first_name__c + ' ' + mdlname + ' ' + lstAcc[0].last_name__c;
        }
        return name;
    } 
    /**
    *  Description of the purpose of the class's method. 
    *  @name    : getPatientData
    *  @return  : PatientData returns wrapper class 
    *  @purpose : Method to fetch Patient Data on the basis of Patient Id.
    */
    @AuraEnabled
    public static PatientData getPatientData (String patientId){
        PatientData patientData = new PatientData(); 
        string dob = '';
        string dod = '';
        System.debug('patientId'+patientId);
        List<Contact> lstCon = [Select County__c,MailingStreet,MailingCity,MailingState, MailingPostalCode,Account.Source_Name__c,Account.EMPI__c,Account.first_name__c, 
                                Account.last_name__c, Account.Date_of_Birth__c,Account.Date_of_Death__c,
                                Account.GenderLabel__c, Account.Medicaid_CIN__c,Account.PCP__c,Account.Race_Label__c,
                                Account.Phone,Account.Work_Phone__c,Account.Mobile_Phone__c, 
                                Account.LastModifiedDate,Account.Ethnicity_Label__c,Account.Primary_Language__c,Account.Secondary_Language__c 
                                from Contact where AccountId =:patientId];   
        
        //string name;
        
        if (!lstCon.isEmpty()){
            //name = lstCon[0].Account.first_name__c + ' ' + lstAcc[0].Account.last_name__c;
            if (lstCon[0].Account.Date_of_Birth__c != null) {
                Date dt = lstCon[0].Account.Date_of_Birth__c;
                dob = string.valueOf(datetime.newInstance(dt.year(), dt.month(), dt.day()).format('MM/dd/yyyy'));
            }
            //gender = lstCon[0].Account.GenderLabel__c  == 'M' : 'Male' ? lstCon[0].Account.GenderLabel__c == 'F' : 'Female' ? lstCon[0].Account.GenderLabel__c;
            
            if (lstCon[0].Account.Date_of_Death__c != null) {
                Date dt = lstCon[0].Account.Date_Of_Death__c;
                dod = string.valueOf(datetime.newInstance(dt.year(), dt.month(), dt.day()).format('MM/dd/yyyy'));
            }
            //Assign Wrapper values
            
            patientData.cin 				= lstCon[0].Account.Medicaid_CIN__c;
            patientData.dob 				= dob;
            patientData.mailingStreet 		= lstCon[0].MailingStreet;
            patientData.mailingCity 		= lstCon[0].MailingCity;
            patientData.mailingState 		= lstCon[0].MailingState;
            patientData.mailingPostalCode 	= lstCon[0].MailingPostalCode;
            patientData.county 				= lstCon[0].County__c;
            patientData.phone 				= lstCon[0].Account.Phone;
            patientData.workPhone 			= lstCon[0].Account.Work_Phone__c;
            patientData.mobilephone 		= lstCon[0].Account.Mobile_Phone__c;
            patientData.primaryLanguage 	= lstCon[0].Account.Primary_Language__c;
            patientData.secondaryLanguage 	= lstCon[0].Account.Secondary_Language__c;
            patientData.pcp 				= lstCon[0].Account.PCP__c; 
            patientData.dod 				= dod;
            patientData.raceLabel 			= lstCon[0].Account.Race_Label__c;
            patientData.ethnicity 			= lstCon[0].Account.Ethnicity_Label__c;
            patientData.name				= getPatientName(patientId);
        }
        return patientData;
    } 
   
    /**
    *  Description of the purpose of the class's method. 
    *  @name    : getPatientDob
    *  @return  : String
    *  @purpose : Method to fetch Patient DOB on the basis of Patient Id.
    */
    @AuraEnabled public static String getPatientDob (String patientId){
        
        List<Account> lstAcc = [Select Date_of_Birth__c from Account where id = : patientId];
        System.debug('To print patient dob' +lstAcc);
        String dob;        
        if (lstAcc.size() > 0 && lstAcc[0].Date_of_Birth__c != null) {
            Date dt = lstAcc[0].Date_of_Birth__c;
            dob = string.valueOf(datetime.newInstance(dt.year(), dt.month(), dt.day()).format('MM/dd/yy'));
            System.debug('Date of birth:'+dob);
        }
        return dob;
    } 
    /**
    *  Description of the purpose of the class's method. 
    *  @name    : getSourceValue
    *  @return  : List<HealthCloudGA__EhrPatient__c>
    *  @purpose : To get Source Value in dropdown for Demographics tab.
    */
    
    @AuraEnabled
    public static List<Contact> getSourceValue(String patientId,String empi){
        List<Contact> lstSourceSystem = new List<Contact>();
        Set<String> setSourceSystem = new Set<String>();
        System.debug('Patient id :: '+ patientId);
        Map<String, List<Contact>> mapEMPIToAccount = UtilityGeneral.fetchPatients(new set<string>{empi});
        system.debug('mapvalues:'+mapEMPIToAccount);
        if(mapEMPIToAccount.containsKey(empi)){
             List<Contact> lstCon = mapEMPIToAccount.get(empi);

            for(Contact con : lstCon){
                system.debug('inside Contact loop'+con.Account.HealthCloudGA__SourceSystem__c + ':' + con.AccountId);
                if(!setSourceSystem.contains(con.Account.HealthCloudGA__SourceSystem__c)){
                    setSourceSystem.add(con.Account.HealthCloudGA__SourceSystem__c);
                    lstSourceSystem.add(con);
                }
            }
        }
        System.debug('SourceVal'+lstSourceSystem);
        return lstSourceSystem;
    }
    
}