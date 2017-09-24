/**************************************************************************************************************************************************
Name: X4cii_PatientsTriggerHandler
===================================================================================================================================================
Purpose: This is the utility class for vf pages
---------------------------------------------------------------------------------------------------------------------------------------------------
Classed Called  : 
---------------------------------------------------------------------------------------------------------------------------------------------------
Related vf page : X4Cii_Incentives, X4Cii_Labs                                             
===================================================================================================================================================
History:                                                        
---------------------------------------------------------------------------------------------------------------------------------------------------
VERSION AUTHOR              DATE       DETAIL                                            Request #
---------------------------------------------------------------------------------------------------------------------------------------------------
    1.0 Viswanath Malayathi  06/24/2017 Initial Development                       

**************************************************************************************************************************************************/
public class X4Cii_PARelatedListsCtrl {
    public Id patientId {get; set;}
    public List<X4Cii_Patient_Association__c> paList {get; set;}
    public Map<String, List<X4Cii_Patient_Association__c>> paMap;
    public List<X4Cii_Patient_Association__c> CD4List {get; set;}
    public List<X4Cii_Patient_Association__c> IncentiveList {get; set;}
    public List<X4Cii_Patient_Association__c> VLList {get; set;}
    
    public X4Cii_PARelatedListsCtrl(ApexPages.StandardController patientCtrl){
        patientId = patientCtrl.getId();
        CD4List = new List<X4Cii_Patient_Association__c>();
        IncentiveList = new List<X4Cii_Patient_Association__c>();
        VLList = new List<X4Cii_Patient_Association__c>();
        paList = [select Id, Name, X4Cii_Patient__c, X4Cii_Patient__r.Name, RecordType.Name, X4Cii_CD4_Count__c, X4Cii_CD4_Date__c, X4Cii_Date_Disbursed__c, X4Cii_Incentive_Disbursed__c, X4Cii_VL_Count__c, X4Cii_VL_Date__c from X4Cii_Patient_Association__c where X4Cii_Patient__c =: patientId];
        
        
        if(paList.size() > 0){
            paMap = new Map<String, List<X4Cii_Patient_Association__c>>();
            for(X4Cii_Patient_Association__c pa: paList){
                if(!paMap.containsKey(pa.RecordType.Name)){
                    paMap.put(pa.RecordType.Name, new List<X4Cii_Patient_Association__c>());
                }
                paMap.get(pa.RecordType.Name).add(pa);
            }
        
            if(paMap.size() > 0){
                for(String rcdType: paMap.keySet()){
                    if(rcdType == 'CD4'){
                        CD4List.addAll(paMap.get(rcdType));
                    }
                    
                    if(rcdType == 'Incentive'){
                        IncentiveList.addAll(paMap.get(rcdType));
                    }
                    if(rcdType == 'VL'){
                        VLList.addAll(paMap.get(rcdType));
                    }
                }
            }
        }  
    } 
}