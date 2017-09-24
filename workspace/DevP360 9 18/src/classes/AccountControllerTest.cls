@istest
public class AccountControllerTest {
    static testMethod void validatefindPatientRecords() {
                
        Account act=new Account(name='abc', GenderLabel__c='M', Medicaid_CIN__c='21217212',Date_of_Birth__c=Date.newInstance(2016,02,10));
        insert act;
        //List<Account> accountList= [SELECT name,  Date_of_Birth__c, GenderLabel__c,Medicaid_CIN__c FROM Account order by LastModifiedDate desc];        
        //act =[Select name,genderlabel__c,Medicaid_CIN__c,Date_of_Birth__c from Account WHERE Id =:act.Id];
        
        test.startTest();
       List<AccountController.DisplayAccountRecords> accountList = AccountController.findPatientRecords();
        if(accountList != null && accountList.size() > 0){
        System.assertEquals(accountList[0].name,'abc');
        System.assertEquals(accountList[0].dob,String.valueOf(Date.newInstance(2016,02,10)));
        System.assertEquals(accountList[0].cin,'21217212');
        System.assertEquals(accountList[0].gender,'M');
        }
        test.stopTest();
    }
}