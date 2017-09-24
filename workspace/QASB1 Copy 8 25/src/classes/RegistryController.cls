/*
Description: 1. Fetch the registry names for patient registries section
Created By : Cognizant Technology Solutions
Create Date: 03/03/2017
*/
public  class RegistryController {
    // To fetch the registry names for patient registries
    @AuraEnabled
    public static map<string, string> getRegistry(){
        map<string, string> mapIdToName = new map<string, string>(); 
        for(HealthCloudGA__Program__c p : [Select id,Name from HealthCloudGA__Program__c]){
            mapIdToName.put(p.Id, p.Name);
        }
        return mapIdToName;
    }
    
     @AuraEnabled
    public static String getDataForRegistry(string programId){
        system.debug('programId :: ' + programId);
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
        system.debug('recordCount :: ' + recordCount);
        for(HealthCloudGA__ProgramPatientAffiliation__c progAffiliation : [SELECT HealthCloudGA__Account__c , HealthCloudGA__Account__r.EMPI__c, HealthCloudGA__Account__r.Name,HealthCloudGA__Account__r.First_Name__c,HealthCloudGA__Account__r.Last_Name__c,HealthCloudGA__Account__r.Middle_Name__c, DOB__c, Gender_Label__c, CIN__c 
                                                                            FROM HealthCloudGA__ProgramPatientAffiliation__c WHERE HealthCloudGA__Program__c = :programId AND HealthCloudGA__Account__c != null 
                                                                            AND HealthCloudGA__Account__r.Id != null AND HealthCloudGA__Account__r.EMPI__c != '' ORDER BY HealthCloudGA__Account__r.Last_Name__c,
                                                                            HealthCloudGA__Account__r.First_Name__c asc LIMIT 10000]){
            if(progAffiliation.HealthCloudGA__Account__r.Middle_Name__c!=null) 
                mname = progAffiliation.HealthCloudGA__Account__r.Middle_Name__c;
            mname = '';
            //name =  '<a href="patientdetail?patientid=' + progAffiliation.HealthCloudGA__Account__c + '">' + progAffiliation.HealthCloudGA__Account__r.Last_Name__c+', '+progAffiliation.HealthCloudGA__Account__r.First_Name__c+' '+ mname + '</a>';
            name = '<button id="patientName" name=' + progAffiliation.HealthCloudGA__Account__c + ' value= '+ progAffiliation.HealthCloudGA__Account__r.EMPI__c +' onclick=\'{!c.navigateToDetail}\' class=\'anchorClass\'>' + progAffiliation.HealthCloudGA__Account__r.Last_Name__c+', '+progAffiliation.HealthCloudGA__Account__r.First_Name__c+' '+ mname + '</button>'; 
            DisplayRegistry registryRecordVal = 
                new DisplayRegistry(name , string.valueof(progAffiliation.DOB__c), 
                progAffiliation.Gender_Label__c, progAffiliation.CIN__c);
            registryRecord.add(registryRecordVal);
        }
        system.debug('registryRecord :: ' + registryRecord);
        DisplayRegistryWrapper registryWrapper = new DisplayRegistryWrapper(registryRecord , recordCount , refreshDate);
        system.debug('recordCount :: ' + recordCount);
        return JSON.serialize(registryWrapper);
    }
    
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
    @AuraEnabled
    public static String getReleaseNoteId(){
        String label = System.Label.P360CommunityReleaseNoteDocumentName; 
        String docId=null,url=null,DocumentId=null,urlId=null;
        System.debug('Custom Label'+label);
        List <Document> doc=[SELECT Id, Name FROM Document where Name=:label limit 1];
        if (doc != null && doc.size()>0)
        {
            docId = doc[0].Id;
            url = System.Label.P360CommunityDocURL; 
            DocumentId=docId.substring(0, 15);
            System.debug('Document Id '+ DocumentId);     
        }
       
        return DocumentId;
    } 
    
     @AuraEnabled
    // Method to get logged in user session Id
    public static void updateUserSession(String currentPage, String fname, String lname, String cin, String dob, String gender,String encounterId){
    	system.debug('Inside pat seasrch updateUserSession');
        UtilityGeneral.updateUserSession(currentPage, fname, lname, cin, dob, gender,encounterId);
    }
    /*
     @AuraEnabled
    public static List<DisplayPopRegistry> getDataForPopulation(String patientId){
        List<DisplayPopRegistry> DisplayPopRegistryWrapper = new List<DisplayPopRegistry>();
        for(HealthCloudGA__ProgramPatientAffiliation__c progAffiliation : [SELECT Program_Name__c , Program_Description__c, LastModifiedDate
                                                                            FROM HealthCloudGA__ProgramPatientAffiliation__c 
                                                                            WHERE HealthCloudGA__Account__c =: patientId and Program_Name__c!='DOH ATTRIBUTION'
                                                                            ORDER BY Program_Name__c ASC
                                                                            LIMIT 10000])
        {
            DisplayPopRegistry displayPopRegistryval = 
                new DisplayPopRegistry(progAffiliation.Program_Name__c , progAffiliation.Program_Description__c , string.valueof(progAffiliation.LastModifiedDate));
            DisplayPopRegistryWrapper.add(displayPopRegistryval);
        }
        return DisplayPopRegistryWrapper;
    }
    
    public class DisplayPopRegistry {
        @AuraEnabled public string name;
        @AuraEnabled public string refreshdate;
        @AuraEnabled public string description;
        
        public DisplayPopRegistry(string name, string refreshdate, string description){
            this.name = name == null ? '' : name;
            this.refreshdate = refreshdate == null ? '' : string.valueof(refreshdate);
            this.description = description == null ? '' : description;
        }
    }*/
}