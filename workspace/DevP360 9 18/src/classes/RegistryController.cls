/**
	@Author      :	Cognizant Technology Solutions
	@name        :	RegistryController
	@CreateDate  :  03/03/2017
	@Description :  Fetch the registry names for patient registries section 
	@Version     :  1.0
*/
public  class RegistryController {
    /**
	*  Description of the purpose of the class's method. 
	*  @name	:	getRegistry
	*  @return  :	mapIdToName
	*  @purpose :	To fetch the registry names for patient registries.
	*/
    @AuraEnabled
    public static map<string, string> getRegistry(){
        map<string, string> mapIdToName = new map<string, string>(); 
        for(HealthCloudGA__Program__c p : [Select id,Name from HealthCloudGA__Program__c]){
            mapIdToName.put(p.Id, p.Name);
        }
        return mapIdToName;
    }
    
    /**
	*  Description of the purpose of the class's method. 
	*  @name	:	getDataForRegistry
	*  @param   : 	1. programId	:	Captures the value for programId based on drop down selection in lightning component
	*  @return  :	mapIdToName
	*  @purpose :	To fetch the patient registries data for different patients.
	*/
    @AuraEnabled
    public static String getDataForRegistry(string programId){
        String name;
        String mname='';
        Integer recordCount = 0;
        string refreshDate;
        List<DisplayRegistry> registryRecord = new List<DisplayRegistry>();
        List<HealthCloudGA__Program__c> recordCountList = [Select Patient_Count__c, lastmodifieddate from HealthCloudGA__Program__c where id =: programId];
        
        ETL_Refresh_Date__c dataRefreshObj = ETL_Refresh_Date__c.getValues(UtilityData.labelLastRefreshDate);
        if(dataRefreshObj != null && dataRefreshObj.Refresh_Datetime__c != null)
        	refreshDate = String.valueof(dataRefreshObj.Refresh_Datetime__c.format('MM/dd/yyyy'));
        
        if(recordCountList.size() > 0){
            recordCount = Integer.valueOf(recordCountList[0].Patient_Count__c);    
        }
        for(HealthCloudGA__ProgramPatientAffiliation__c progAffiliation : [SELECT HealthCloudGA__Account__c , HealthCloudGA__Account__r.EMPI__c, HealthCloudGA__Account__r.Name,
                                                                          HealthCloudGA__Account__r.First_Name__c,HealthCloudGA__Account__r.Last_Name__c,
                                                                          HealthCloudGA__Account__r.Middle_Name__c, DOB__c, Gender_Label__c, CIN__c 
                                                                          FROM HealthCloudGA__ProgramPatientAffiliation__c 
                                                                          WHERE HealthCloudGA__Program__c = :programId AND HealthCloudGA__Account__c != null 
                                                                          AND HealthCloudGA__Account__r.Id != null AND HealthCloudGA__Account__r.EMPI__c != '' 
                                                                          ORDER BY HealthCloudGA__Account__r.Last_Name__c,
                                                                          HealthCloudGA__Account__r.First_Name__c asc LIMIT 10000]){
                                                                          	if(progAffiliation.HealthCloudGA__Account__r.Middle_Name__c!=null) 
                                                                            mname = progAffiliation.HealthCloudGA__Account__r.Middle_Name__c;
                                                                            mname = '';
                                                                            name = '<button id="patientName" name=' + progAffiliation.HealthCloudGA__Account__c + ' value= '+ progAffiliation.HealthCloudGA__Account__r.EMPI__c +' onclick=\'{!c.navigateToDetail}\' class=\'anchorClass\'>' + progAffiliation.HealthCloudGA__Account__r.Last_Name__c+', '+progAffiliation.HealthCloudGA__Account__r.First_Name__c+' '+ mname + '</button>'; 
                                                                            DisplayRegistry registryRecordVal = 
                                                                            new DisplayRegistry(name , string.valueof(progAffiliation.DOB__c), 
                                                                            progAffiliation.Gender_Label__c, progAffiliation.CIN__c);
                                                                            registryRecord.add(registryRecordVal);
                                                                           }
        DisplayRegistryWrapper registryWrapper = new DisplayRegistryWrapper(registryRecord , recordCount , refreshDate);
        return JSON.serialize(registryWrapper);
    }
    
    /**
	*  Description of the purpose of the wrapper class. 
	*  @name    :	DisplayRegistry
	*  @purpose :	Wrapper Class to pass the values.
	*/
    public class DisplayRegistry {
        @AuraEnabled public string name;
        @AuraEnabled public string dob;
        @AuraEnabled public string gender;
        @AuraEnabled public string cin;
        
        public DisplayRegistry(string name, string dob, string gender, string cin){
            this.name = name == null ? '' : name;
            this.dob = dob == null ? '' : string.valueof(datetime.newInstance(Date.valueOf(dob).year(), Date.valueOf(dob).month(),Date.valueOf(dob).day()).format('MM/dd/YYYY'));
            this.gender = gender == null ? '' : gender;
            this.cin = cin == null ? '' : cin;
        }
    }
    
     /**
	*  Description of the purpose of the wrapper class. 
	*  @name    :	DisplayRegistryWrapper
	*  @purpose :	Wrapper Class to pass the values.
	*/
    public class DisplayRegistryWrapper {
        @AuraEnabled public List<DisplayRegistry> data;
        @AuraEnabled public Integer count;
        @AuraEnabled public string refreshDate;
        
        public DisplayRegistryWrapper(List<DisplayRegistry> data , Integer count, string refreshDate){
            this.data = data;
            this.count = count;
            this.refreshDate = refreshDate == null ? '' : refreshDate;
        }
    }
    
    /**
	*  Description of the purpose of the class's method. 
	*  @name	:	getReleaseNoteId
	*  @return  :	String i.e return the document id 
	*  @purpose :	To fetch documentId  to display P360 Release note on Ui.
	*/
    @AuraEnabled
    public static String getReleaseNoteId(){
        String label = System.Label.P360CommunityReleaseNoteDocumentName; 
        String docId=null,url=null,DocumentId=null,urlId=null;
        List <Document> doc=[SELECT Id, Name FROM Document where Name=:label limit 1];
        if (doc != null && doc.size()>0)
        {
            docId = doc[0].Id;
            url = System.Label.P360CommunityDocURL; 
            DocumentId=docId.substring(0, 15);
        }
        
        return DocumentId;
    }
    
    /**
    *  Description of the purpose of the class's method. 
    *  @name    :	updateUserSession
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
    public static void updateUserSession(String currentPage, String fname, String lname,String cin,
                                         String dob, String gender,String encounterId){
        UtilityGeneral.updateUserSession(currentPage, fname, lname, cin, dob, gender,encounterId);
    }
}