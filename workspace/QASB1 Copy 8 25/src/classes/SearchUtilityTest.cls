@isTest
public class SearchUtilityTest {
    static testMethod void validategetSearchResult(){
     
        /*Account portalAccount1 = new Account(
            Name = 'TestAccount'
        );
        Database.insert(portalAccount1);*/
        
        String strRecordTypeId = [Select Id From RecordType Where SobjectType = 'Account' and Name = 'Individual'].Id;             
        Account portalAccount1;
        portalAccount1 = new Account(RecordTypeId = strRecordTypeId,EMPI__c='abc1',Name='abc', Medicaid_CIN__c = '468927',Phone='123883483',pcp__c='');
        insert portalAccount1;
        
        string  acParam1 = '\"' + portalAccount1.Id + '\"';
        string strwhereclause1   = 'Patient__r.EMPI__c = "{0}" and Type__c = "Procedure"';
        System.debug('strwhereclause1 '+ portalAccount1.Id);        
        EHR_Procedure__c  pm1 = new EHR_Procedure__c(Patient__c = portalAccount1.Id, Code_Label__c ='MeasureName', Type__c ='Procedure');
        insert pm1;
        
        Dynamic_List__c dynlst;        
        dynlst = new Dynamic_List__c(Name ='Procedures', Limit__c =' ',objectAPIName__c ='EHR_Procedure__c', WhereClause__c = strwhereclause1, Order_By__c = 'Onset_Date__c DESC',SOSL_whereClause__c=' ',searchIndex__c = 1); 
        insert dynlst;
        
        Dynamic_List_Field__c  dynlstfld;
        Dynamic_List_Field__c  dynlstfld1;
        dynlstfld = new Dynamic_List_Field__c(Name ='Name',fieldAPIName__c = 'Code_Label__c' ,isLink__c = true, Link_Reference__c = 'Patient__c',Detail_Page__c='Encounter Summary', DynamicList__c = dynlst.id);
        insert dynlstfld;
        
        dynlstfld1 = new Dynamic_List_Field__c(Name ='Source',FieldType__c='Date',fieldAPIName__c = 'Source_Name__c' ,isLink__c = false, DynamicList__c = dynlst.id);
        insert dynlstfld1;
        
        Id [] fixedSearchResults= new Id[1];
        fixedSearchResults[0] = pm1.Id; 
        Test.setFixedSearchResults(fixedSearchResults);
        
        test.startTest();
        String globalSearch = SearchUtility.getSearchResult(portalAccount1.Id, 'MeasureName', dynlst.Name,portalAccount1.EMPI__c);
        String globalSearch1 = SearchUtility.getSearchResult(portalAccount1.Id, 'MeasureName', '',portalAccount1.EMPI__c);
        System.assertEquals(globalSearch.contains('MeasureName'),true);  
        test.stopTest();
    }
   
    static testMethod void validateupdateUserSession(){
       Account act =UtilityTestData.createAccount('Prodigy Sharma', Date.newInstance(1995,12,25), '12BCS1213', 'abc',
                                                   '121212121', 'MSHS-EPIC');
        HealthCloudGA__EhrEncounter__c ehrEnc=new HealthCloudGA__EhrEncounter__c(HealthCloudGA__SourceSystem__c='MSHS-EPIC',
                                                                                 HealthCloudGA__Account__c=act.Id,
                                                                                 HealthCloudGA__PeriodStart__c=Date.newInstance(2016,02,10));
        insert ehrEnc;
        test.startTest();                
        SearchUtility.updateUserSession('Patient Search Result', 'fname', 'lname', 'cin', '10/10/2000', 'F',ehrEnc.Id);
        List<User_Session__c> lstUserSession=[SELECT Id, Current_Page__c, First_Name__c, Last_Name__c, CIN__c, Gender__c, DOB__c FROM User_Session__c order by LastModifiedDate desc];
        System.assertEquals( lstUserSession[0].Current_Page__c, 'Patient Search Result');
        test.stopTest();
    }
    
    static testMethod void validatehighlightSearchText(){
        String hoverData = 'DEPARTMENT OF ORTHOPEDICS – ADULT PATIENT Chief Complaint: postop visit History of Present'+ 
            'Illness: Maria R. Morel is a 60 y.o. female who is being seen today for her 3 weeks follow up'+  
            's/p right femur fe';
        String hoverData1=' ';
        String searchTerm = 'fe';
        test.startTest();
        String result = SearchUtility.highlightSearchText(hoverData, searchTerm);
        String result1 = SearchUtility.highlightSearchText(hoverData1, searchTerm);
        System.assertEquals(result.contains(searchTerm),true);
        System.assertEquals(result1.contains(searchTerm),false);
        test.stopTest();
    }
        static testMethod void validatelogHIPAAAudit(){        
        Account act= UtilityTestData.createAccount('Bhavik', Date.newInstance(1992,02,28), '1221212', 'empi', 'A232323', 'Health1-00D630000009MZ4');
        
        HIPAAAuditLogin__c hipaaaObject=new HIPAAAuditLogin__c(name='Clinical Summary');
        insert hipaaaObject;
        
        test.startTest();
        SearchUtility.logHIPAAAudit(act.Id, hipaaaObject.Name);
        test.stopTest();
        
        List<HIPAA_Audit_Log__c> lstHIPAAAudit = [Select Account__c, User__c, HealthCare_Data_Component__c from HIPAA_Audit_Log__c order by lastModifiedDate desc];
        
        if(!lstHIPAAAudit.isEmpty()){
            
            System.assertEquals(act.Id, lstHIPAAAudit[0].Account__c);
            System.assertEquals(UserInfo.getUserId(), lstHIPAAAudit[0].User__c);
            
        }
       
    }
    
    
    
}