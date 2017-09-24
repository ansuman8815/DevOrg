@isTest
public class TestDataFactory {
    //This method is only to create Patient Account records.
    public static List<Account> createAccount(integer num){
        List<Account> lstAccounts = new List<Account>();
        Id individualRecId = [select Id,DeveloperName from RecordType where SobjectType='Account' and DeveloperName='IndustriesIndividual' limit 1].id;
        //Instantiate account list
        for(integer i=0;i<num;i++){
            Account acc = new Account();
            acc.EMPI__C = i+num+'';
            acc.First_name__c = 'Fname'+i;
            acc.Last_name__c = 'Lname'+i;
            acc.name = 'Fname'+i+' '+'Lname'+i;
            acc.BillingStreet = 'Street'+i;
            acc.BillingState = 'State'+i;
            acc.BillingPostalCode = '1111'+i;
            acc.BillingCity = 'New York';
            acc.BillingCountry = 'United States';
            acc.RecordTypeid = individualRecId;
            lstAccounts.add(acc);
        }
        //Insert account list
        insert lstAccounts;
        //return account list 
        return lstAccounts;
    }
    
    public static List<HealthCloudGA__EhrObservation__c> ceateLabResults(integer numOfAccounts, integer numOfLabs){
        List<Account> lstAccounts = new List<Account>();
        List<HealthCloudGA__EhrObservation__c> lstLabResults = new List<HealthCloudGA__EhrObservation__c>();
        //Instantiate account list
        for(integer i=0;i<numOfAccounts;i++){
            Account acc = new Account();
            acc.EMPI__C = i+numOfAccounts+'';
            acc.First_name__c = 'Fname'+i;
            acc.Last_name__c = 'Lname'+i;
            lstAccounts.add(acc);
        }
        //Insert account list
        insert lstAccounts;
        //Instantiante Lab Result list
        for(integer i=0;i<numOfAccounts;i++){
            for(integer j=0;j<numOfLabs;j++){
                HealthCloudGA__EhrObservation__c labRes = new HealthCloudGA__EhrObservation__c();
                labRes.HealthCloudGA__NameLabel__c = 'TestLabel'+j;
                labRes.HealthCloudGA__NameCode__c = 'TestCode'+j;
                labRes.HealthCloudGA__ValuePeriodStartDate__c = Date.Today().addMonths(0-numOfLabs);
                labRes.HealthCloudGA__Comments__c = 'TestComment'+j;
                labRes.HealthCloudGA__ValueQuantityUnit__c = 'TestValueQuantity'+j;
                labRes.HealthCloudGA__ReferenceRangeHighValue__c = 'TestHighValue'+j;
                labRes.HealthCloudGA__ReferenceRangeLowValue__c = 'TestLowValue'+j;
                labRes.Type__c = 'Lab Result';
                labRes.HealthCloudGA__SourceSystem__c = 'MSHS-EPIC';
                labRes.HealthCloudGA__Account__c = lstAccounts[i].id;
                lstLabResults.add(labRes);
            }
        }
        //insert lab result list
        insert lstLabResults;
        //return lab result list
        return lstLabResults;

    }
    
    public static void createSourceSystemFHIRObservation(){
        //Instantiate Source System list
        List<Source_System__c> lst = new List<Source_System__c>();
        
        Source_System__c src = new Source_System__c();
        src.name__c = 'Mount Sinai FHIR Observations';
        src.FHIR_URL__c = 'https://apiconnect.mountsinai.org/fhir/stu3/api/Observation/?category=laboratory&masterpatientid=';
        src.Response_Type__c = 'JSON';
        src.Accept_Type__c = 'application/json';
        src.Active__c = True ;
        src.FHIR_Resource_Name__c = 'Observation';
        src.Response_Parser_Class__c = 'MuleObsParser';
        src.Endpoint_Generator_Class__c = 'MulesoftFHIRUtil';
        src.Use_HTTP_Basic_Auth__c = True;
        src.Use_Client_ID_and_Secret__c = True;
        src.HTTP_Auth_UserName__c = 'sfdc_p360';
        src.HTTP_Auth_Password__c = 'xsw@23EDC';
        src.URL_Client_ID__c = '2bef8c42d2b54815b0b4254a86cc3701';
        src.URL_Client_Secret__c = '4479ee88Ce6740deBcd39B034ACd48f2';
        src.External_Id__c='HealthCloudGA__SourceSystemId__c';
        insert src;
    }
     public static void createSourceSystemFHIREncDiagnosis(){
        //Instantiate Source System list
        List<Source_System__c> lst = new List<Source_System__c>();
        
        Source_System__c src = new Source_System__c();
        src.name__c = 'Mount Sinai FHIR Encounter Diagnosis';
        src.FHIR_URL__c = 'https://apiconnect.mountsinai.org/fhir/stu3/api/Condition?category=encounter-diagnosis&masterpatientid=';
        src.Response_Type__c = 'JSON';
        src.Accept_Type__c = 'application/json';
        src.Active__c = True ;
        src.FHIR_Resource_Name__c = 'Encounter Diagnoses';
        src.Response_Parser_Class__c = 'MuleEncDiagParser';
        src.Endpoint_Generator_Class__c = 'MulesoftFHIRUtil';
        src.Use_HTTP_Basic_Auth__c = True;
        src.Use_Client_ID_and_Secret__c = True;
        src.HTTP_Auth_UserName__c = 'sfdc_p360';
        src.HTTP_Auth_Password__c = 'xsw@23EDC';
        src.URL_Client_ID__c = '2bef8c42d2b54815b0b4254a86cc3701';
        src.URL_Client_Secret__c = '4479ee88Ce6740deBcd39B034ACd48f2';
        src.External_Id__c='HealthCloudGA__SourceSystemId__c';
        insert src;
    }
    public static void createSourceSystemMedicalHistory(){
        //Instantiate Source System list
        List<Source_System__c> lst = new List<Source_System__c>();
        
        Source_System__c src = new Source_System__c();
        src.name__c = 'Mount Sinai FHIR Medical History';
        src.FHIR_URL__c = 'https://apiconnect.mountsinai.org/fhir/stu3/api/Condition/MedicalHistory?masterpatientid=';
        src.Response_Type__c = 'JSON';
        src.Accept_Type__c = 'application/json';
        src.Active__c = True ;
        src.FHIR_Resource_Name__c = 'Medical History';
        src.Response_Parser_Class__c = 'MuleMedicalHistoryParser';
        src.Endpoint_Generator_Class__c = 'MulesoftFHIRUtil';
        src.Use_HTTP_Basic_Auth__c = True;
        src.Use_Client_ID_and_Secret__c = True;
        src.HTTP_Auth_UserName__c = 'sfdc_p360';
        src.HTTP_Auth_Password__c = 'xsw@23EDC';
        src.URL_Client_ID__c = '2bef8c42d2b54815b0b4254a86cc3701';
        src.URL_Client_Secret__c = '4479ee88Ce6740deBcd39B034ACd48f2';
        src.External_Id__c='HealthCloudGA__SourceSystemId__c';
        insert src;
    }
    
    public static void createSourceSystemProblemList(){
        //Instantiate Source System list
        List<Source_System__c> lst = new List<Source_System__c>();
        
        Source_System__c src = new Source_System__c();
        src.name__c = 'Mount Sinai FHIR Problem List';
        src.FHIR_URL__c = 'https://apiconnect-dev.mountsinai.org/fhir/stu3/api/Condition?category=problem-list-item&masterpatientid=';
        src.Response_Type__c = 'JSON';
        src.Accept_Type__c = 'application/json';
        src.Active__c = True ;
        src.FHIR_Resource_Name__c = 'Problem List';
        src.Response_Parser_Class__c = 'MuleProblemListParser';
        src.Endpoint_Generator_Class__c = 'MulesoftFHIRUtil';
        src.Use_HTTP_Basic_Auth__c = True;
        src.Use_Client_ID_and_Secret__c = True;
        src.HTTP_Auth_UserName__c = 'sfdc_p360';
        src.HTTP_Auth_Password__c = 'xsw@23EDC';
        src.URL_Client_ID__c = '2bef8c42d2b54815b0b4254a86cc3701';
        src.URL_Client_Secret__c = '4479ee88Ce6740deBcd39B034ACd48f2';
        src.External_Id__c='HealthCloudGA__SourceSystemId__c';
        insert src;
    }
    public static void createDynamicListandFields(){
        
        
    }
}