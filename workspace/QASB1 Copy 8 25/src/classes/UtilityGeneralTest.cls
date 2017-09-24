@isTest (SeeAllData = false)
public class UtilityGeneralTest {
    static testMethod void validateupdateUserSession(){        
        String currentPage,fname,lname, cin,dob,gender;
        List<User_Session__c> lstUserSession=[SELECT Id, Current_Page__c, First_Name__c, Last_Name__c, CIN__c, Gender__c, DOB__c FROM User_Session__c WHERE User__c =: UserInfo.getUserId()];
        integer userSessionCnt1 = 0;
        integer userSessionCnt2 = 0;
        Account act =UtilityTestData.createAccount('Prodigy Sharma', Date.newInstance(1995,12,25), '12BCS1213', 'abc',
                                                   '121212121', 'MSHS-EPIC');
        HealthCloudGA__EhrEncounter__c ehrEnc=new HealthCloudGA__EhrEncounter__c(HealthCloudGA__SourceSystem__c='MSHS-EPIC',
                                                                                 HealthCloudGA__Account__c=act.Id,
                                                                                 HealthCloudGA__PeriodStart__c=Date.newInstance(2016,02,10));
        insert ehrEnc;
        if(lstUserSession != null){
            userSessionCnt1 = lstUserSession.size();
        }
        
        test.startTest();
                
        UtilityGeneral.updateUserSession('Patient Search Result', 'fname', 'lname', 'cin', '10/10/2000', 'F',ehrEnc.Id);
        lstUserSession=[SELECT Id, Current_Page__c, First_Name__c, Last_Name__c, CIN__c, Gender__c, DOB__c FROM User_Session__c WHERE User__c =: UserInfo.getUserId()];
        
        if(lstUserSession != null){
            userSessionCnt2 = lstUserSession.size();
            System.assertEquals(userSessionCnt2, userSessionCnt1+1);
        }       
        
        UtilityGeneral.updateUserSession('Clinical Summary', 'fname1', 'lname2', 'cin2', '', '','');
        
        lstUserSession=[SELECT Id, Current_Page__c, First_Name__c, Last_Name__c, CIN__c, Gender__c, DOB__c FROM User_Session__c WHERE User__c =: UserInfo.getUserId()];
        
        if(lstUserSession != null){
            userSessionCnt2 = lstUserSession.size();
            
            System.debug('userSessionCnt2: ' + userSessionCnt2);
            System.assertEquals( userSessionCnt2, userSessionCnt1+1);
        
            if(userSessionCnt2 > 0){
                System.assertEquals( lstUserSession[0].Current_Page__c, 'Clinical Summary');
                System.assertEquals( lstUserSession[0].First_Name__c, 'fname1');
                System.assertEquals( lstUserSession[0].Last_Name__c, 'lname2');
                System.assertEquals( lstUserSession[0].CIN__c, 'cin2');
            }
        }
        test.stopTest();
    }
    
    static testMethod void validatelogHIPAAAudit(){        
        Account act= UtilityTestData.createAccount('Shradha', Date.newInstance(2016,02,10), '1221212', 'empi', 'A232323', 'Health1-00D630000009MZ4');
		
        HIPAAAuditLogin__c hipaaaObject=new HIPAAAuditLogin__c(name='Clinical Summary');
        insert hipaaaObject;
        
        test.startTest();
        UtilityGeneral.logHIPAAAudit(act.Id, hipaaaObject.Name);
        test.stopTest();
        
        List<HIPAA_Audit_Log__c> lstHIPAAAudit = [Select Account__c, User__c, HealthCare_Data_Component__c from HIPAA_Audit_Log__c order by lastModifiedDate desc];
        
        if(!lstHIPAAAudit.isEmpty()){
            
        	System.assertEquals(act.Id, lstHIPAAAudit[0].Account__c);
        	System.assertEquals(hipaaaObject.Name, lstHIPAAAudit[0].HealthCare_Data_Component__c);
            System.assertEquals(UserInfo.getUserId(), lstHIPAAAudit[0].User__c);
            
        }
       
    }
    
    static testMethod void validatecheckPatientConsentForCurrentUser(){
        Account act =UtilityTestData.createAccount('Shradha', Date.newInstance(2016,02,10), '21217212', 'abc', '121212121', 'EPIC');
        Contact c=new Contact(FirstName='abc',LastName='xyz',AccountId =act.id);
        insert c;
        test.startTest();
        Boolean patientId=UtilityGeneral.checkPatientConsentForCurrentUser(act.Id,act.EMPI__c);
        test.stopTest();
        System.assertEquals(null, patientId);
    }
    
    static testMethod void validatefetchPatients(){
		String strRecordTypeId = [Select Id From RecordType Where SobjectType = 'Account' and Name = 'Individual'].Id;             
		List<Account> lstaccs = new List<Account>();
        Account ac;
        ac = new Account(RecordTypeId = strRecordTypeId, Name='James', First_Name__c='James', Last_Name__c = 'Franklin', 
                         Middle_Name__c = 'Rhodes', GenderLabel__c = 'M',Phone='999999999',HealthCloudGA__SourceSystem__c='MSHS-EPIC',
                         Pcp__c='abc',EMPI__c='123456',
                         Date_of_Birth__c = Date.newInstance(1975,12,10), Medicaid_CIN__c = '468927');
        insert ac;
        lstaccs.add(ac);
        Contact con=new Contact(LastName='a',Accountid=ac.Id,MailingStreet='Viman Nagar',MailingPostalCode='411047');
        insert con;
        HealthCloudGA__EhrEncounter__c ehrEnc=new HealthCloudGA__EhrEncounter__c(HealthCloudGA__SourceSystem__c='MSHS-EPIC'
                                                                                 ,HealthCloudGA__Account__c=ac.Id,
                                                                                 HealthCloudGA__PeriodStart__c=
                                                                                 Date.newInstance(2016,02,10));
    	insert ehrEnc;
        Set<String> setEMPI = new Set<String>();
        setEMPI.add(ac.EMPI__c);
        test.startTest();
       	Map<String,List<Contact>> mapContacts=UtilityGeneral.fetchPatients(setEMPI);
        System.debug('ReturnVal'+mapContacts);
        system.assertEquals(false,mapContacts.isEmpty());
        test.stopTest();
     }
    
    static testMethod void validategetLastETLRef(){
        String refdate;
        ETL_Refresh_Date__c dataRefreshObj = ETL_Refresh_Date__c.getValues(UtilityData.labelLastRefreshDate);
        if(dataRefreshObj != null && dataRefreshObj.Refresh_Datetime__c != null)
        refdate=String.valueof(dataRefreshObj.Refresh_Datetime__c.format('dd/MM/yyyy'));
        test.startTest();
        System.assertEquals(refdate,UtilityGeneral.getLastETLRef());
        System.debug('RefDate'+refDate);
        test.stopTest();
    }
    
}