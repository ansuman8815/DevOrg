Public class X4Cii_PatientAssociationTriggerHandler
{
    public static void patientUpdate(List<X4Cii_Patient_Association__c> pLstPA)
    {
        set<Id> patientSet = new set<Id>();
        Map<Id, Map<String, List<X4Cii_Patient_Association__c>>> PAMap;
        for(X4Cii_Patient_Association__c vPA: pLstPA) 
        {
            patientSet.add(vPA.X4Cii_Patient__c);
        }
        
        List<X4Cii_Patient_Association__c> patAsocList = [select Id, RecordType.Name, X4Cii_Patient__c, X4Cii_Date_Disbursed__c, X4Cii_Incentive_Disbursed__c, X4Cii_CD4_Date__c, X4Cii_CD4_Count__c,
                                                            X4Cii_VL_Count__c, X4Cii_VL_Date__c, X4Cii_PADate__c from X4Cii_Patient_Association__c where X4Cii_Patient__c IN: patientSet order by X4Cii_PADate__c DESC];
        
        if(!patAsocList.isEmpty()){
            PAMap = new Map<Id, Map<String, List<X4Cii_Patient_Association__c>>>();
            for(X4Cii_Patient_Association__c pa: patAsocList){
                if(!PAMap.containsKey(pa.X4Cii_Patient__c)){
                    PAMap.put(pa.X4Cii_Patient__c, new Map<String, List<X4Cii_Patient_Association__c>>());
                }
                
                if(pa.RecordType.Name == 'Incentive'){
                    if(!PAMap.get(pa.X4Cii_Patient__c).containsKey('Incentive')){
                        PAMap.get(pa.X4Cii_Patient__c).put('Incentive', new List<X4Cii_Patient_Association__c>());
                    }
                    PAMap.get(pa.X4Cii_Patient__c).get('Incentive').add(pa);
                }
                
                if(pa.RecordType.Name == 'CD4'){
                    if(!PAMap.get(pa.X4Cii_Patient__c).containsKey('CD4')){
                        PAMap.get(pa.X4Cii_Patient__c).put('CD4', new List<X4Cii_Patient_Association__c>());
                    }
                    PAMap.get(pa.X4Cii_Patient__c).get('CD4').add(pa);
                }
                
                if(pa.RecordType.Name == 'VL'){
                    if(!PAMap.get(pa.X4Cii_Patient__c).containsKey('VL')){
                        PAMap.get(pa.X4Cii_Patient__c).put('VL', new List<X4Cii_Patient_Association__c>());
                    }
                    PAMap.get(pa.X4Cii_Patient__c).get('VL').add(pa);
                }
            }
        }
        
        List<X4Cii_Patient__c> vLstP = [Select Id, X4Cii_Incentive_Disbursed__c, X4Cii_VL_Count_200__c, X4Cii_CD4_200__c,X4Cii_Latest_CD4_Count__c,X4Cii_Latest_CD4_Date__c,X4Cii_Latest_Date_Disbursed__c,X4Cii_Latest_VL_Count__c,X4Cii_Latest_VL_Date__c from X4Cii_Patient__c where Id In: PAMap.keySet()];
        
        for(X4Cii_Patient__c vP: vLstP)
        {
            if(PAMap.containsKey(vP.Id)){
               if(PAMap.get(vP.Id).containsKey('Incentive'))
               {
                   if(PAMap.get(vP.Id).get('Incentive').size() > 0)
                   {
                    vP.X4Cii_Incentive_Disbursed__c = (PAMap.get(vP.Id).get('Incentive').get(0).X4Cii_Incentive_Disbursed__c == 'Yes' ? 'Yes': 'No');
                    vP.X4Cii_Latest_Date_Disbursed__c = PAMap.get(vP.Id).get('Incentive').get(0).X4Cii_Date_Disbursed__c;
                   
                   }
               }
               
               if(PAMap.get(vP.Id).containsKey('VL'))
               {
                   if(PAMap.get(vP.Id).get('VL').size() > 0)
                   {                    
                    vP.X4Cii_VL_Count_200__c = (PAMap.get(vP.Id).get('VL').get(0).X4Cii_VL_Count__c <= 200 ? 'Yes': 'No');
                    vP.X4Cii_Latest_VL_Count__c = PAMap.get(vP.Id).get('VL').get(0).X4Cii_VL_Count__c;
                    vP.X4Cii_Latest_VL_Date__c = PAMap.get(vP.Id).get('VL').get(0).X4Cii_VL_Date__c;
                   }
               }
               
               if(PAMap.get(vP.Id).containsKey('CD4'))
               {
                   if(PAMap.get(vP.Id).get('CD4').size() > 0)
                   {                    
                    vP.X4Cii_CD4_200__c = (PAMap.get(vP.Id).get('CD4').get(0).X4Cii_CD4_Count__c >= 200 ? 'Yes': 'No');
                    vP.X4Cii_Latest_CD4_Count__c = PAMap.get(vP.Id).get('CD4').get(0).X4Cii_CD4_Count__c;
                    vP.X4Cii_Latest_CD4_Date__c = PAMap.get(vP.Id).get('CD4').get(0).X4Cii_CD4_Date__c;                    
                   }
               }
            }
        }

        if(!vLstP.isEmpty())
        {
            update vLstp;
        }   
    }
    
}