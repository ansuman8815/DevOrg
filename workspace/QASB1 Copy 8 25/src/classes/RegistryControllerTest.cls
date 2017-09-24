/*
Description: 1. Test class to validate the method to fetch the all registry names for patient registries section
Created By : Cognizant Technology Solutions
Create Date: 03/03/2017
*/
@isTest
public class RegistryControllerTest {
    
    static testMethod void validategetRegistry() {
        test.startTest();
        HealthCloudGA__Program__c p1 = new HealthCloudGA__Program__c(Name = 'Registry1', HealthCloudGA__StartDate__c = Date.newInstance(2016,02,10));
        insert p1;
        system.assertEquals('Registry1', p1.name);
        system.assertEquals('2016-02-10',String.valueof(p1.HealthCloudGA__StartDate__c));
        
        HealthCloudGA__Program__c p2 = new HealthCloudGA__Program__c(Name = 'Registry2' , HealthCloudGA__StartDate__c = Date.newInstance(2016,08,15));
        insert p2;
        system.assertEquals('Registry2', p2.name);
        system.assertEquals('2016-08-15',String.valueof(p2.HealthCloudGA__StartDate__c));
        
        HealthCloudGA__Program__c p3 = new HealthCloudGA__Program__c(Name = 'Registry3',  HealthCloudGA__StartDate__c = Date.newInstance(2017,02,24));
        insert p3;
        system.assertEquals('Registry3', p3.name);
        system.assertEquals('2017-02-24',String.valueof(p3.HealthCloudGA__StartDate__c));
        
        map<string, string> mapIdToName = new map<string, string>();
        mapIdToName = RegistryController.getRegistry();
        system.assertEquals(3, mapIdToName.size());
        
       
        Account act=new Account(Name='SS',First_Name__c='Shradha',Last_Name__c='Y',Middle_Name__c='K',Date_of_Birth__c=Date.newInstance(2016,08,15),GenderLabel__c ='F',Medicaid_CIN__c ='122121' ,EMPI__c='12121212');
        insert act;
        System.debug('Account Id'+act.Id);
        HealthCloudGA__ProgramPatientAffiliation__c progAffiliation=new HealthCloudGA__ProgramPatientAffiliation__c();
        progAffiliation.HealthCloudGA__Account__c=act.Id;
        progAffiliation.HealthCloudGA__Program__c=p3.Id;
        insert progAffiliation;
        
        List<HealthCloudGA__ProgramPatientAffiliation__c> progPatAffObj= [Select Id, HealthCloudGA__Program__c from HealthCloudGA__ProgramPatientAffiliation__c where HealthCloudGA__Account__c=:act.Id];
       
           String healthCloudGaProgram=RegistryController.getDataForRegistry(p3.Id);
        System.debug('Value' +healthCloudGaProgram);
    	System.assertEquals(healthCloudGaProgram.contains(act.EMPI__c),true);
     
        test.stopTest();
        
    }
    
    static testMethod void validategetReleaseNoteId() {
        List<Folder> lstFolder = [select id from folder where name = 'Shared Documents'];
        if(lstFolder.size()>0){
            Document doc = new Document();
            doc.Body = Blob.valueOf('/services/data/v39.0/sobjects/Document/01563000000E3mkAAC/Body');
            doc.ContentType = 'application/pdf';
            doc.DeveloperName = 'Shradha';
            doc.IsPublic = true;
            doc.Name = 'Patient360AnnouncementsPage'; 
            doc.FolderId = lstFolder[0].id;
            insert doc;
            String docId = doc.Id;
            String  strDocId=string.valueof(doc.Id).substring(0, 15);
            test.startTest(); 
            string url = RegistryController.getReleaseNoteId();
            test.stopTest();
            System.assertEquals(url.contains(strDocId), true);
            
        }
    }
    
    static testMethod void validateupdateUserSession(){
         Account act =UtilityTestData.createAccount('Prodigy Sharma', Date.newInstance(1995,12,25), '12BCS1213', 'abc',
                                                   '121212121', 'MSHS-EPIC');
        HealthCloudGA__EhrEncounter__c ehrEnc=new HealthCloudGA__EhrEncounter__c(HealthCloudGA__SourceSystem__c='MSHS-EPIC',
                                                                                 HealthCloudGA__Account__c=act.Id,
                                                                                 HealthCloudGA__PeriodStart__c=Date.newInstance(2016,02,10));
        insert ehrEnc;
        test.startTest();
        RegistryController.updateUserSession('Patient Search Result', 'fname', 'lname', 'cin', '10/10/2000', 'F',ehrEnc.Id);
        List<User_Session__c> lstUserSession=[SELECT Id, Current_Page__c, First_Name__c, Last_Name__c, CIN__c, Gender__c, DOB__c FROM User_Session__c order by LastModifiedDate desc];
		System.assertEquals( lstUserSession[0].Current_Page__c, 'Patient Search Result');
		test.stopTest();
    }
   /* static testMethod void validategetDataForPopulation() {
       
        HealthCloudGA__Program__c p1 = new HealthCloudGA__Program__c(Name = 'Registry1', HealthCloudGA__StartDate__c = Date.newInstance(2016,02,10));
        insert p1;
        Account act=new Account(Name='SS',First_Name__c='Shradha',Last_Name__c='Y',Middle_Name__c='K',Date_of_Birth__c=Date.newInstance(2016,08,15),GenderLabel__c ='F',Medicaid_CIN__c ='122121');
        insert act;
        System.debug('Account Id'+act.Id);
        HealthCloudGA__ProgramPatientAffiliation__c progAffiliation=new HealthCloudGA__ProgramPatientAffiliation__c();
        progAffiliation.HealthCloudGA__Account__c=act.Id;
        progAffiliation.HealthCloudGA__Program__c=p1.Id;
      
        insert progAffiliation;
        
        List<HealthCloudGA__ProgramPatientAffiliation__c> lstprogPatAffObj= [Select Id, HealthCloudGA__Program__c from HealthCloudGA__ProgramPatientAffiliation__c where HealthCloudGA__Account__c=:act.Id and Program_Name__c!='DOH ATTRIBUTION'];
         test.startTest();
        List<RegistryController.DisplayPopRegistry> lstobjreg=RegistryController.getDataForPopulation(act.Id);
        test.stopTest();
        System.assertEquals(lstobjreg[0].name, 'Registry1');
       
        
    } */
    
}