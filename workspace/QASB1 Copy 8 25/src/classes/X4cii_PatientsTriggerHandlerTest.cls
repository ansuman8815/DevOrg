/**************************************************************************************************************************************************
Name: X4cii_PatientsTriggerHandlerTest
===================================================================================================================================================
   Summary : This class contain positive behavioral test methods and negative behavioral test methods for 'X4cii_PatientsTriggerHandler' class
------------------------------------------------------------------------------------------------------------------------
 Apex class(es) whose code is covered : nameValidation, duplicatePatients
========================================================================================================================
 Code Coverage History:                                                        
------------------------------------------------------------------------------------------------------------------------
 VERSION DEVELOPER          DATE       DETAIL                                  REQUEST #
------------------------------------------------------------------------------------------------------------------------
     1.0 Viswanath Malayathi  7/24/2017 Initial Development                                
***********************************************************************************************************************/
@isTest(seeAllData=true)
Public class X4cii_PatientsTriggerHandlerTest
{
    static testMethod void ptnameValidation() {
        User usr = [select Id, Name, Partner_Organization__c from User where Id =: userinfo.getUserId()];
        system.runAs(usr){
            string po = usr.Partner_Organization__c.substring(0,2);
            List<X4Cii_Patient__c> paList = new List<X4Cii_Patient__c>();
            Test.startTest();
            X4Cii_Patient__c pa = new X4Cii_Patient__c();
            pa.Name = po+'121212121212'; 
            paList.add(pa);

            X4Cii_Patient__c pa1 = new X4Cii_Patient__c();
            pa1.Name = po+'3434343434';
            paList.add(pa1);

            X4Cii_Patient__c pa2 = new X4Cii_Patient__c();
            pa2.Name = po+'012343434334';
            paList.add(pa2);
			
            insert paList;
            Test.stopTest();
        }
    }
    
    static testMethod void ptnameValidation2() {
        User usr = [select Id, Name, Partner_Organization__c from User where Id =: userinfo.getUserId()];
        system.runAs(usr){
            string po = usr.Partner_Organization__c.substring(0,2);
            List<X4Cii_Patient__c> paList = new List<X4Cii_Patient__c>();
            
            X4Cii_Patient__c pa = new X4Cii_Patient__c();
            pa.Name = 'A'+po+'121212121212';     
            paList.add(pa);

            X4Cii_Patient__c pa1 = new X4Cii_Patient__c();
            pa1.Name = po+'A3434343434';
            paList.add(pa1);
            
            Test.startTest(); 
            try{
                insert paList;  
            }catch(Exception e){
                
            }
            Test.stopTest(); 
        }
    }
    
    static testMethod void ptnameValidation3() {
        User usr = [select Id, Name, Partner_Organization__c from User where Id =: userinfo.getUserId()];
        system.runAs(usr){
            string po = usr.Partner_Organization__c.substring(0,2);
            
            Test.startTest(); 
            X4Cii_Patient__c pa = new X4Cii_Patient__c();
            pa.Name = po+'121212121212';     
            insert pa;
            
            try{
                X4Cii_Patient__c pa1 = new X4Cii_Patient__c();
                pa1.Name = po+'121212121212';
                insert pa1; 
            }catch(Exception e){
                
            }
            Test.stopTest(); 
        }
    }
    
    static testMethod void ptnameValidation4() {
        User usr = [select Id, Name, Partner_Organization__c from User where Id =: userinfo.getUserId()];
        system.runAs(usr){
            string po = usr.Partner_Organization__c.substring(0,2);
            List<X4Cii_Patient__c> paList = new List<X4Cii_Patient__c>();
            
            X4Cii_Patient__c pa = new X4Cii_Patient__c();
            pa.Name = po+'121212121212';     
            insert pa;
            
            Test.startTest(); 
            try{
                X4Cii_Patient__c pa1 = new X4Cii_Patient__c();
                pa1.Name = po+'241212121212';
                insert pa1; 
                
                pa1.Name = po+'121212121212';
                update pa1;
                
                X4Cii_Patient__c pa2 = new X4Cii_Patient__c();
                pa2.Name = po+'121212121212';
                insert pa2; 
            }catch(Exception e){
                
            }
            Test.stopTest(); 
        }
    }
}