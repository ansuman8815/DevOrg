/**
	@Author      :	Cognizant Technology Solutions
	@name        :	ProfileMenuController
	@CreateDate  :  16/03/2017
	@Description :  Fetch Patient Population Metric Data on the basis of Patient ID
	@Version     :  1.0
*/
global with sharing class PopulationController {
       /**
    	*  Description of the purpose of the wrapper class. 
    	*  @name    : PatientPopulationData
    	*  @purpose : Wrapper Class to pass the values.
       */
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
    
    /**
	*  Description of the purpose of the class's method. 
	*  @name    :	getPatientPopulationData
	*  @param   :	1.patientId	:	Captures the value for Patient Id
	*  @return  : 	PatientPopulationData
	*  @purpose :	Method to fetch Patient Banner Data on the basis of Patient Id.
	*/
    @AuraEnabled
    public static PatientPopulationData getPatientPopulationData (string patientId){
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