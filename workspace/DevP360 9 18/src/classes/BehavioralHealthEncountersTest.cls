@isTest 
public class BehavioralHealthEncountersTest {
  static testMethod void validategetEncounters() {
        test.startTest();
     
     Dx_Master__c dxMaster = new Dx_Master__c(Code__c='abc');
      insert dxMaster;
      BehavioralHealthEncounters.getEncounters();
      // Retrieve the  Dx_Master__c
       dxMaster = [SELECT Code__c FROM Dx_Master__c WHERE Id =:dxMaster.Id];
       System.debug('Code__c after trigger fired: ' + dxMaster.Code__c);
      System.assertEquals('abc', dxMaster.Code__c);
        test.stopTest();
  }
}