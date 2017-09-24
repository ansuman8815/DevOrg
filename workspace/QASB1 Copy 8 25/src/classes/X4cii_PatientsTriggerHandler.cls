/**************************************************************************************************************************************************
Name: X4cii_PatientsTriggerHandler
===================================================================================================================================================
Purpose: This is the utility class for assigning values to the records 
---------------------------------------------------------------------------------------------------------------------------------------------------
Classed Called  : 
---------------------------------------------------------------------------------------------------------------------------------------------------
Related Trigger :     X4Cii_PatientCURD                                             
===================================================================================================================================================
History:                                                        
---------------------------------------------------------------------------------------------------------------------------------------------------
VERSION AUTHOR              DATE       DETAIL                                            Request #
---------------------------------------------------------------------------------------------------------------------------------------------------
    1.0 Viswanath Malayathi  07/04/2017 Initial Development                       

**************************************************************************************************************************************************/
Public class X4cii_PatientsTriggerHandler
{
    public static void duplicatePAUpdate(List<X4Cii_Patient__c> vLstPANew, List<X4Cii_Patient__c> vLstPAOld)
    {
        List<X4Cii_Patient__c> vLstPA = new List<X4Cii_Patient__c>();
        
        for(Integer i=0; i<vLstPANew.size(); i++)
        {
            if(vLstPANew[i].Name != vLstPAOld[i].Name)
            {
                vLstPA.add(vLstPANew[i]);
            }
        }
        
        X4cii_PatientsTriggerHandler.duplicatePatients(vLstPA);
    }

    public static void duplicatePatients(List<X4Cii_Patient__c> pLstPA)
    {
         Set<string> strName = new Set<string>();
         for(X4Cii_Patient__c pa : pLstPA)
         {
           strName.add(pa.name);
         }

           List<X4Cii_Patient__c> duplicatepaList = [Select name From X4Cii_Patient__c where name = :strName];

           Set<string > duplicatepaIds = new Set<string >();

           for(X4Cii_Patient__c dup: duplicatepaList )
           {
             duplicatepaIds.add(dup.name);
           }

           for(X4Cii_Patient__c s : pLstPA)
           {
                if(s.name!=null)
                {
                   if(duplicatepaIds.contains(s.name))
                   {
                     s.addError('Patient’s Identifier already exists');
                   }
                
                }
           }
    }
    
    public static void nameValidation(List<X4Cii_Patient__c > vLstPANew, string trigEvent)
    {
        Map<Id, List<X4Cii_Patient__c>> userPatientMap = new Map<Id, List<X4Cii_Patient__c>>();
        Map<Id, User> userMap;
        for(X4Cii_Patient__c  vPA: vLstPANew)
        {
            string error = '';
            if(vPA.Name == '' || vPA.Name == null)
            {
                vPA.addError('Patient’s Identifier cant be  blank');
            }           
            else
            {   
                Id createdUserId = (vPA.CreatedBy.Id != null?vPA.CreatedBy.Id:userinfo.getuserid());
                if(!userPatientMap.containsKey(createdUserId)){
                    userPatientMap.put(createdUserId, new List<X4Cii_Patient__c>());
                }
                userPatientMap.get(createdUserId).add(vPA);
            }
        }
        system.debug('--User--'+userPatientMap);
        userMap = new Map<Id, User>([select Id, Name, Partner_Organization__c from User where Id IN: userPatientMap.keySet()]);
        system.debug('---userMap---'+userMap);
        for(X4Cii_Patient__c  vPA: vLstPANew){
            Id createdUserId = (vPA.CreatedBy.Id != null?vPA.CreatedBy.Id:userinfo.getuserid());
            system.debug('----'+userMap.get(createdUserId).Partner_Organization__c);
            system.debug('--vPA.Name--'+vPA.Name);
            if(vPA.Name.length() == 2){
                vPA.addError('Please add atleast one digit (other than \'0\') after first 2 characters.');
            }else{
                if(vPA.Name.startsWith(userMap.get(createdUserId).Partner_Organization__c.substring(0,2))){
                    String temp = vPA.Name;
                    system.debug('--number--'+temp);
                    if(!temp.substring(2).isNumeric()){
                        vPA.addError('Patient’s Identifier must be '+ userMap.get(createdUserId).Partner_Organization__c.substring(0,2) + ' followed by a number');
                    }else if(temp.substring(2).isNumeric()){
                        String temp1 = temp.substring(0,3);
                        String temp2 = temp.substring(3);
                        if(temp1.substring(0,3).endsWith('0')){
                            temp = temp1.replace('0','') + temp2;
                            vPA.Name = temp;
                        }
                    }
                    if(trigEvent == 'insert'){
                        vPA.X4Cii_Partners__c = userMap.get(createdUserId).Partner_Organization__c;
                    }
                }else{
                    vPA.addError('Patient’s Identifier must be '+ userMap.get(createdUserId).Partner_Organization__c.substring(0,2) + ' followed by a number');
                }
            }
        }
    }
    
}