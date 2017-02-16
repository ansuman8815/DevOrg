public with sharing class AccountController {

    @AuraEnabled
    public static List<Account> findAll(){
        return [Select id from Account];
    }

    // findPatientRecords() is defined to fetch the Patient data and pass the list to lightning component AccountListComponent
    @AuraEnabled
    public static List<DisplayAccountRecords> findPatientRecords() {
    
    List<DisplayAccountRecords> lstAccountRecords = 
        new List<DisplayAccountRecords>();
        
        List<Account> accountList= [SELECT id, name,  Date_of_Birth__c, GenderLabel__c,Medicaid_CIN__c FROM Account];
        
        if(accountList != null && accountList.size() > 0){
            
            for(Account ac : accountList){
                DisplayAccountRecords accountRecord = 
                new DisplayAccountRecords();
                
                accountRecord.accountId = ac.Id;
                accountRecord.name = ac.name;
                accountRecord.dob = ac.Date_of_Birth__c;
                accountRecord.gender = ac.GenderLabel__c;
                accountRecord.cin = ac.Medicaid_CIN__c;
                
                lstAccountRecords.add(accountRecord);
            }
        }
        return lstAccountRecords;
    }

    public class DisplayAccountRecords {
        
        @AuraEnabled public string accountId;
        @AuraEnabled public string name;
        @AuraEnabled public date dob;
        @AuraEnabled public string gender;
        @AuraEnabled public string cin;
        
        public DisplayAccountRecords(){
            accountId = '';
            name = '';
            Date myDate = Date.newInstance(1960, 2, 17);
            gender ='';
            cin ='';
        }
    }
}