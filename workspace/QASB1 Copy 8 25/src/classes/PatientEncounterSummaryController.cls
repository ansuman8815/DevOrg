/*
Description: 1. Methods to fetch Patient encounter summary data 
Created By : Cognizant Technology Solutions
Create Date: 06/03/2017
*/
global with sharing class PatientEncounterSummaryController {
    global class PatientEncBannerData {        
        @AuraEnabled public string encStartDate;
        @AuraEnabled public string encEndDate;
        @AuraEnabled public string partnername;
        @AuraEnabled public string placeOfService;
        @AuraEnabled public string primaryEncDiagnosis;
        @AuraEnabled public string encStatus; 
        @AuraEnabled public string encType;
        @AuraEnabled public string admitSource;
        @AuraEnabled public string dischargeDisposition;
        @AuraEnabled public string height;
        @AuraEnabled public string weight;
        @AuraEnabled public string bmi;
        @AuraEnabled public string bp;
        @AuraEnabled public string heightUnit;
        @AuraEnabled public string weightUnit;
        @AuraEnabled public string department;
        @AuraEnabled public string speciality;
        
        global PatientEncBannerData(string encStartDate, string encEndDate, string partnername, string placeOfService, string primaryEncDiagnosis, string encStatus, string encType, string admitSource,
                                    string dischargeDisposition, string height, string weight, string heightUnit, string weightUnit, string bmi, string bp, string department,string speciality){
            this.encStartDate = encStartDate == null ? '' : encStartDate;
            this.encEndDate = encEndDate == null ? '' : encEndDate;
            this.partnername = partnername == null ? '' : partnername;
            this.placeOfService = placeOfService == null ? '' : placeOfService;
            this.primaryEncDiagnosis = primaryEncDiagnosis == null ? '' : primaryEncDiagnosis;
            this.encStatus = encStatus == null ? '' : encStatus;
            this.encType = encType == null ? '' : encType;
            this.admitSource = admitSource == null ? '' : admitSource;
            this.dischargeDisposition = dischargeDisposition == null ? '' : dischargeDisposition;
            this.height = height == null ? '' : height;
            this.weight = weight == null ? '' : weight;
            this.heightUnit = heightUnit == null ? '' : heightUnit;
            this.weightUnit = weightUnit == null ? '' : weightUnit;
            this.bmi = bmi == null ? '' : bmi;
            this.bp = bp == null ? '' : bp;
            this.department = department == null ? '' :department;
            this.speciality  = speciality == null ? '' :speciality;
        }
    }
    
    // Method to fetch Encounter Banner data on the basis of encounter Id
    @AuraEnabled public static PatientEncBannerData getEncBannerData (string encId){
        
        List<HealthCloudGA__EhrEncounter__c > lstEncounter = [SELECT HealthCloudGA__PeriodStart__c, HealthCloudGA__PeriodEnd__c, Source_Name__c, 
                                                        HealthCloudGA__Location1Description__c, HealthCloudGA__Status__c, HealthCloudGA__TypeCode__c, 
                                                        HealthCloudGA__HospitalizeAdmitSourceCode__c, HealthCloudGA__HospitalizeDischargeDispostionLabel__c , Primary_Diagnosis__c ,Visit_Department__c,Speciality_Unit__c  
                                                        FROM HealthCloudGA__EhrEncounter__c where id =: encId];
        List<HealthCloudGA__EhrObservation__c> lstHeight = [SELECT HealthCloudGA__ValueQuantity__c FROM HealthCloudGA__EhrObservation__c where Encounter__c =:encId and HealthCloudGA__NameCode__c = 'HEIGHT' LIMIT 1];
        List<HealthCloudGA__EhrObservation__c> lstWeight = [SELECT HealthCloudGA__ValueQuantity__c FROM HealthCloudGA__EhrObservation__c where Encounter__c =:encId and HealthCloudGA__NameCode__c = 'WEIGHT' LIMIT 1];
        List<HealthCloudGA__EhrObservation__c> lstHeightUnit = [SELECT HealthCloudGA__ValueQuantityUnit__c FROM HealthCloudGA__EhrObservation__c where Encounter__c =:encId and HealthCloudGA__NameCode__c = 'HEIGHT' LIMIT 1];
        List<HealthCloudGA__EhrObservation__c> lstWeightUnit = [SELECT HealthCloudGA__ValueQuantityUnit__c FROM HealthCloudGA__EhrObservation__c where Encounter__c =:encId and HealthCloudGA__NameCode__c = 'WEIGHT' LIMIT 1];
        List<HealthCloudGA__EhrObservation__c> lstBMI = [SELECT HealthCloudGA__ValueQuantity__c FROM HealthCloudGA__EhrObservation__c where Encounter__c =:encId and HealthCloudGA__NameCode__c = 'BMI' LIMIT 1];
            List<HealthCloudGA__EhrObservation__c> lstBPA = [SELECT HealthCloudGA__ValueQuantity__c FROM HealthCloudGA__EhrObservation__c where Encounter__c =:encId and HealthCloudGA__NameCode__c = 'SBP' LIMIT 1];
        List<HealthCloudGA__EhrObservation__c> lstBPB = [SELECT HealthCloudGA__ValueQuantity__c FROM HealthCloudGA__EhrObservation__c where Encounter__c =:encId and HealthCloudGA__NameCode__c = 'DBP' LIMIT 1];
                
        String encStartDate;
        String encEndDate;
        String sourceSystem;
        String loc1Desc;
        String primaryDx;
        String status;
        String typeCode;
        String admitSource;
        String dispositionLabel;
        String height;
        String weight;
        String heightUnit;
        String weightUnit;
        String BMI;
        String BPA;
        String BPB;
        String BP;
        String department;
        String speciality;
                
        if (lstEncounter != null && lstEncounter.size()>0){
            if(lstEncounter[0].HealthCloudGA__PeriodStart__c != null)
                encStartDate = string.valueof(lstEncounter[0].HealthCloudGA__PeriodStart__c.format('MM/dd/yyyy'));
            if(lstEncounter[0].HealthCloudGA__PeriodEnd__c != null)
                encEndDate = string.valueof(lstEncounter[0].HealthCloudGA__PeriodEnd__c.format('MM/dd/yyyy'));
            sourceSystem = lstEncounter[0].Source_Name__c;
            loc1Desc = lstEncounter[0].HealthCloudGA__Location1Description__c;
            primaryDx = lstEncounter[0].Primary_Diagnosis__c;
            status = lstEncounter[0].HealthCloudGA__Status__c;
            typeCode = lstEncounter[0].HealthCloudGA__TypeCode__c;
            admitSource = lstEncounter[0].HealthCloudGA__HospitalizeAdmitSourceCode__c;
            dispositionLabel = lstEncounter[0].HealthCloudGA__HospitalizeDischargeDispostionLabel__c;
            department =lstEncounter[0].Visit_Department__c;
            speciality=lstEncounter[0].Speciality_Unit__c;
            if(lstHeight != null && lstHeight.size() > 0 && lstHeight[0].HealthCloudGA__ValueQuantity__c != null){
                height = lstHeight[0].HealthCloudGA__ValueQuantity__c;
            }
            if(lstweight != null && lstweight.size() > 0 && lstweight[0].HealthCloudGA__ValueQuantity__c != null){
                weight = lstweight[0].HealthCloudGA__ValueQuantity__c;
            }
            
            if(lstHeightUnit != null && lstHeightUnit.size() > 0 && lstHeightUnit[0].HealthCloudGA__ValueQuantityUnit__c != null){
                heightUnit = '('+lstHeightUnit[0].HealthCloudGA__ValueQuantityUnit__c+')';
            }
            if(lstWeightUnit != null && lstWeightUnit.size() > 0 && lstWeightUnit[0].HealthCloudGA__ValueQuantityUnit__c != null){
                weightUnit = '('+lstWeightUnit[0].HealthCloudGA__ValueQuantityUnit__c+')';
            }
           
            if(lstBMI != null && lstBMI.size() > 0 && lstBMI[0].HealthCloudGA__ValueQuantity__c != null){
                BMI = lstBMI[0].HealthCloudGA__ValueQuantity__c;
            }
            if(lstBPA != null && lstBPA.size() > 0 && lstBPA[0].HealthCloudGA__ValueQuantity__c != null){
                BPA = lstBPA[0].HealthCloudGA__ValueQuantity__c;
            }
            if(lstBPB != null && lstBPB.size() > 0 && lstBPB[0].HealthCloudGA__ValueQuantity__c != null){
                BPB = lstBPB[0].HealthCloudGA__ValueQuantity__c;
            }           
            if(BPA == null)
                BPA = '';
            if(BPB == null)
                BPB = '';
           
            //BP = BPA + '/' + BPB;
            if(BPA != '' || BPB !='')
            	BP = BPA + '/' + BPB;
            else 
                BP = '';
           
        }
        
        PatientEncBannerData patientData = new PatientEncBannerData (encStartDate , encEndDate, sourceSystem, loc1Desc, primaryDx , status, typeCode, admitSource, dispositionLabel, height, weight, heightUnit, weightUnit, BMI, BP ,department,speciality);
        
        return patientData;
    }
    @AuraEnabled 
    public static List<HealthCloudGA__EhrPractitioner__c> getproviderValues (String encounterPracId)
    {
        List<HealthCloudGA__EhrPractitioner__c> lstPractitioner= [SELECT  NPI__c,HealthCloudGA__SpecialtySystem__c 
                                                            FROM HealthCloudGA__EhrPractitioner__c WHERE 
                                                            Id =:encounterPracId];
        return lstPractitioner;
    }
    
   
}