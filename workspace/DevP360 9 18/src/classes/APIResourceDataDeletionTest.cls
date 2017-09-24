@isTest (SeeAllData=false)
public class APIResourceDataDeletionTest {
static testMethod void deletionTest(){   
        
       
    	List<APIResourceData__c> lstapi = new List<APIResourceData__c>();
        for(Integer i=0 ;i <3;i++){
            APIResourceData__c apiresourcedata = new APIResourceData__c(Resource__c='Medical History',EMPI__c='23233232');
            lstapi.add(apiresourcedata);
        }
        insert lstapi;
        Test.startTest();
        APIResourceDataDeletion deletionObj = new APIResourceDataDeletion();
        DataBase.executeBatch(deletionObj);
        List<APIResourceData__c> lstapidata = [SELECT Name FROM APIResourceData__c];
        System.AssertEquals(lstapi.size(),lstapidata.size());
        Test.stopTest();        
    }
}