/*
Description: 1. to test the field name and their data type to show in list  
Created By : Cognizant Technology Solutions
Create Date: 02/02/2017
*/

public with sharing class clinicalSummaryController {
    public String rLimit{get;set;}
    
    public class sObjectWrapper
    {
        @AuraEnabled
        public List<String> lstFieldApi { get;set; }
        
        @AuraEnabled
        public List<SObject> lstSobject { get;set; }
        
        public sObjectWrapper(List<String> lstFieldApi, List<SObject> lstSobject)
        {
            this.lstFieldApi = lstFieldApi;
            this.lstSobject = lstSobject;
        }
    }
    
    public clinicalSummaryController(){
        
        List<Patient_360_App_Setting__mdt> recLimitList = [select recValue__c from Patient_360_App_Setting__mdt where developername = 'clinical_summary_limit'];
        if(recLimitList.size() > 0)
            rLimit = recLimitList[0].recValue__c;
            
    }
    
    @AuraEnabled
    public static sObjectWrapper dynfetchRecords(String strQuery,String whereQuery, List<String> lstFielddatatype, String patientId , String recordLimit)
    {
        Integer recLimit = Integer.valueOf(recordLimit);
        List<SObject> lstSobject = new List<SObject>();
        List<String> lstFieldAPIs = new List<String>();
        Integer count = 0;
        
        if(recLimit > 0) 
            strQuery = strQuery + whereQuery + ' LIMIT :recLimit ';
        else
            strQuery = strQuery  + whereQuery ;
        
        lstSobject = database.query(strQuery);
        
      
        String strFields = strQuery.substringBetween('SELECT','FROM');
         for(String strField : strFields.split(',')){
            lstFieldAPIs.add(strField.trim() + '##' + lstFielddatatype[count]);
            count++;
        }
        count = 0;
        
        return new sObjectWrapper(lstFieldAPIs, lstSobject);
    }
}