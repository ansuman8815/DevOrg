/*
Description: 1. Fetch Patient Population Metric Data on the basis of Patient ID
Created By : Cognizant Technology Solutions
Create Date: 16/03/2017
*/
global with sharing class PopulationController {
       global class PatientPopulationData {        
        @AuraEnabled public string MesYrStartDate;
        @AuraEnabled public string MesYrEndDate;
        @AuraEnabled public string DataRefDate;   
        
        global PatientPopulationData(string MesYrStartDate, string MesYrEndDate, string DataRefDate){
            this.MesYrStartDate = MesYrStartDate == null ? '' : MesYrStartDate;
            this.MesYrEndDate = MesYrEndDate == null ? '' : MesYrEndDate;
            this.DataRefDate = DataRefDate == null ? '' : DataRefDate;
          }
    }
    
    // Method to fetch Patient Banner Data on the basis of Patient Id 
    @AuraEnabled public static PatientPopulationData getPatientPopulationData (string patientId){
       
        List<Performance_Metric__c> lstPop = [Select Measurement_Year_Start_Date__c, Measurement_Year_End_Date__c, Data_Refresh_Date__c  from Performance_Metric__c where Account__c = : patientid limit 1];
        
             
        string MesYrStartDate;
        string MesYrEndDate;
        string DataRefDate; 
       
        
        if (lstPop != null && lstPop.size()>0){
            if (lstPop[0].Measurement_Year_Start_Date__c != null) {
               Date dt = lstPop[0].Measurement_Year_Start_Date__c ; 
               MesYrStartDate = string.valueof(datetime.newInstance(dt.year(), dt.month(), dt.day()).format('MM/dd/yyyy')); 
             }
            
            if (lstPop[0].Measurement_Year_End_Date__c != null) {
                Date dt = lstPop[0].Measurement_Year_End_Date__c ; 
               MesYrEndDate = string.valueof(datetime.newInstance(dt.year(), dt.month(), dt.day()).format('MM/dd/yyyy')); 
             }
            
            if (lstPop[0].Data_Refresh_Date__c != null) {
                Date dt = lstPop[0].Data_Refresh_Date__c ;  
               DataRefDate = string.valueof(datetime.newInstance(dt.year(), dt.month(), dt.day()).format('MM/dd/yyyy')); 
             }
                  
        }
        
                
        PatientPopulationData populationMetricData = new PatientPopulationData (MesYrStartDate, MesYrEndDate, DataRefDate);
        return populationMetricData;
    } 
    

   
}