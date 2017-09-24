public with sharing class AccountController {

   /* @AuraEnabled
    public static List<Account> findAll(){
        return [Select id from Account];
    }*/

    // findPatientRecords() is defined to fetch the Patient data and pass the list to lightning component AccountListComponent
    @AuraEnabled
    public static List<DisplayAccountRecords> findPatientRecords() {
    
    List<DisplayAccountRecords> lstAccountRecords = new List<DisplayAccountRecords>();
        
        List<Account> accountList= [SELECT name,  Date_of_Birth__c, GenderLabel__c,Medicaid_CIN__c FROM Account order by LastModifiedDate desc];
        
        if(accountList != null && accountList.size() > 0){
            
            for(Account ac : accountList){
                DisplayAccountRecords accountRecord = 
                new DisplayAccountRecords(ac.name, string.valueof(ac.Date_of_Birth__c), ac.GenderLabel__c, ac.Medicaid_CIN__c);
                system.debug(accountRecord);
                lstAccountRecords.add(accountRecord);
            }
        }
        system.debug('lstAccountRecords >>>> ' + lstAccountRecords);
        return lstAccountRecords;
    }

    public class DisplayAccountRecords {
     
        @AuraEnabled public string name;
        @AuraEnabled public string dob;
        @AuraEnabled public string gender;
        @AuraEnabled public string cin;
        
        public DisplayAccountRecords(string name, string dob, string gender, string cin){
            this.name = name == null ? '' : name;
            this.dob = dob == null ? '' : dob;
            this.gender = gender == null ? '' : gender;
            this.cin = cin == null ? '' : cin;
        }
    }
}