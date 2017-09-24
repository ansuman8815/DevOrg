/**
   @Author      :   Payal Mittal
   @name        :   SearchUtility
   @CreateDate  :   05/06/2017
   @Description :
                    1. Global Search implementation by passing the search param from the component
                    2. User session record updation for Global Search
   @Version     :   1.0
  */
public without sharing class testSearchUtility {
    
    /**
    *  Description of the purpose of the class's method. 
    *  @name    :   getSearchResult
    *  @param   :
                    1. patientId    :   Captures the value for Patient Id
                    2. searchTerm   :   Captures the value for Search String, which needs to be searched
                    3. listName     :   Captures the value of Data Domain
    *  @return  :   mapSearchResult[Map is returned as a String after serialization]
    *  @purpose :   Method used to fetch records matching with the text entered in the search box.
                    It behaves like a global search for patient's data available in P360 Community UI.
    */
    @AuraEnabled
    public static String getSearchResult(String patientId , String searchTerm , String listName){
        /** VARIABLE DECLARATION
         1. mapIndexOfDynamicList   :   Map to define dyanmic list with indexing
         2. mapSearchResult         :   Result map with key as 'Dynamic List Name' and value as 'List of Records'
         3. mapFldApitoDLF          :   Map of Field Api name and dynamic list record , against dynamic list name
         4. lstFieldApi             :   List of Field api's to be queried
         5. lstDataDomainQuery      :   List of SOSL sub queries
         6. lstDynamicList          :   List of Dynamic List Records
        */
        
        List<String> lstOfDynamicList = new List<String>();
        Map<String , List<Object>> mapSearchResult = new Map<String , List<Object>>();
        Map<String , Map<String , Dynamic_List_Field__c>> mapFldApitoDLF = new Map<String , Map<String , Dynamic_List_Field__c>>();
        List<String> lstFieldApi = new List<String>();
        List<String> lstDataDomainQuery = new List<String>();
        List<String> lstArg = new List<String>();
        List<Dynamic_List__c> lstDynamicList = new List<Dynamic_List__c>();
        Integer index = 0;
        String profileName = ProfileMenuController.getLoggedInUserProfile();
        lstArg.add(patientId);
        String baseString = 'FIND \'' + searchTerm  + '\' IN ALL FIELDS  RETURNING ';
        /**Fetch dynamic list records according to list name.
         * List Name = '' , when search needs to be done for all domains
         * List Name = "Value passed from Client Side", when search is for specific data domain i.e. View All link in UI
        **/
        if(String.isNotBlank(listName))
            lstDynamicList = [SELECT Id, Name, objectAPIName__c, WhereClause__c, SOSL_whereClause__c, Order_By__c, searchIndex__c, 
                            (SELECT Id, Name, fieldAPIName__c, FieldType__c, isLink__c, Link_Reference__c, Detail_Page__c FROM Dynamic_List_Fields__r ORDER BY index__c) 
                        FROM Dynamic_List__c WHERE searchIndex__c != null AND Name =: listName ORDER BY searchIndex__c asc];
        else
        {
            if(profileName == Label.P360CommunityBasicAccess){
                lstDynamicList = [SELECT Id, Name, objectAPIName__c, WhereClause__c, SOSL_whereClause__c, Order_By__c, searchIndex__c, 
                                (SELECT Id, Name, fieldAPIName__c, FieldType__c, isLink__c, Link_Reference__c, Detail_Page__c FROM Dynamic_List_Fields__r ORDER BY index__c) 
                                FROM Dynamic_List__c WHERE searchIndex__c != null and Profile__c =: profileName ORDER BY searchIndex__c asc];
            }
            else{
                lstDynamicList = [SELECT Id, Name, objectAPIName__c, WhereClause__c, SOSL_whereClause__c, Order_By__c, searchIndex__c, 
                                (SELECT Id, Name, fieldAPIName__c, FieldType__c, isLink__c, Link_Reference__c, Detail_Page__c FROM Dynamic_List_Fields__r ORDER BY index__c) 
                                FROM Dynamic_List__c WHERE searchIndex__c != null ORDER BY searchIndex__c asc];
            }
        }     
        //This loop populates the map to be processed and also build the SOSL query dynamically
        for (Dynamic_List__c dl : lstDynamicList)
        {
            lstOfDynamicList.add(dl.Name);
            lstFieldApi         = new List<String>();
            String detailPage   = '';
            String whereClause  = '';
            for (Dynamic_List_Field__c dlf : dl.Dynamic_List_Fields__r){
                lstFieldApi.add(dlf.fieldAPIName__c);
                if(dlf.isLink__c)
                {
                    lstFieldApi.add(dlf.Link_Reference__c);
                    //detailPage : Used to maintain value of the navigation , when clicked on hyperlink 
                    detailPage = dlf.Detail_Page__c == null ? '' : dlf.Detail_Page__c;
                }
                
                if(!mapFldApitoDLF.containsKey(dl.Name))
                    mapFldApitoDLF.put(dl.Name , new Map<String , Dynamic_List_Field__c>());
                mapFldApitoDLF.get(dl.Name).put(dlf.fieldAPIName__c , dlf);
            }
            whereClause = String.isNotBlank(dl.SOSL_whereClause__c) == true ? string.format(dl.SOSL_whereClause__c, lstArg) : string.format(dl.WhereClause__c, lstArg);
            whereClause = whereClause.replace('\"','\'');
            
            if(String.isNotBlank(listName))
                lstDataDomainQuery.add(dl.objectAPIName__c + '(' + string.join (lstFieldApi, ',') + ' WHERE ' + whereClause + ' )');
            else
                lstDataDomainQuery.add(dl.objectAPIName__c + '(' + string.join (lstFieldApi, ',') + ' WHERE ' + whereClause + ' LIMIT 10 )');
        }
        
        //Looping across list of subQuery to process SOSL one by one, as we have same objects with different where clauses for multiple Data Domains
        for(String subQuery : lstDataDomainQuery){
            String searchString = '';
            searchString = baseString + subQuery;
            System.debug('searchString'+searchString);
            List<List<sObject>> searchList = search.query(searchString);
            System.debug('searchList'+searchList);
            index++;
            //Loop through records fetched by SOSL Query
            mapSearchResult = getDataDomainResult(index, searchList , lstOfDynamicList, mapFldApitoDLF, mapSearchResult);
        }
        return Json.serialize(mapSearchResult);
    }
    
    /**
    *  Description of the purpose of the class's method. 
    *  @name    :   getDataDomainResult
    *  @param   :
                    1. index                    :   Captures the index for Dynamic List
                    2. searchList               :   Result retrieved from SOSL as List<List<sObject>>
                    3. mapIndexOfDynamicList    :   Map to define dyanmic list with indexing
                    4. mapSearchResult          :   Result map with key as 'Dynamic List Name' and value as 'List of Records'
                    5. mapFldApitoDLF           :   Map of Field Api name and dynamic list record , against dynamic list name
    *  @return  : mapSearchResult
    *  @purpose : Method to process records for each Data Domain, and is called from getSearchResult
    */
    public static Map<String , List<Object>> getDataDomainResult(Integer index , List<List<sObject>> searchList , List<String> lstOfDynamicList , 
                                             Map<String , Map<String , Dynamic_List_Field__c>> mapFldApitoDLF, Map<String , List<Object>> mapSearchResult){
        for(List<sObject> lstSObj : searchList){
            String dlName = lstOfDynamicList[index-1];
            List<Map<String , String>> lstResultRecord = new List<Map<String , String>>();
            
            //Loop through each record
            for(sObject SObj : lstSObj){
                Map<String , String> mapFieldToValue = new Map<String , String>();
                         
                if(mapFldApitoDLF.containsKey(dlName))
                {
                    Map<String , Dynamic_List_Field__c> mapCurFldApiToDLF = mapFldApitoDLF.get(dlName);
                    
                    for (string api: mapCurFldApiToDLF.keySet()){
                        String displayVal = '';
                        String linkrefApi = '';
                        String linkrefRedirectPage = '';
                        
                        Dynamic_List_Field__c dlf = mapCurFldApiToDLF.get(api);
                        if(dlf.isLink__c)
                        {
                            linkrefApi  = dlf.Link_Reference__c;                         
                            linkrefRedirectPage = dlf.Detail_Page__c == null ? dlName : dlf.Detail_Page__c;
                        }
                        
                        if(SObj.getPopulatedFieldsAsMap().containsKey(api)){
                            string strData = String.valueOf(SObj.getPopulatedFieldsAsMap().get(api));
                            if ('Date'.equals(dlf.FieldType__c)){
                                try{
                                    Datetime dateVal = datetime.valueOfGmt(strdata); 
                                    strdata = dateVal.format('MM/dd/yyyy');
                                }
                                Catch(Exception e){
                                    try{
                                        strdata = string.valueof(datetime.newInstance(Date.valueOf(strdata).year(), Date.valueOf(strdata).month(),Date.valueOf(strdata).day()).format('MM/dd/YYYY'));
                                    }
                                    Catch(Exception ex){
                                        strdata = strdata;
                                    }
                                }
                                System.debug('dlname: ' + dlName + 'strdata:: ' + strdata);
                            }
                            if(linkrefApi != '')
                                displayVal = '<button name= "' + linkrefRedirectPage + '" value = "' + dlName + '" id="'+ String.valueOf(SObj.getPopulatedFieldsAsMap().get(linkrefApi)) + '" title= "'+ strData + '" class=\'linkbutton\'>' + strData + '</button>';
                            else
                                displayVal = strData;
                        }
                        //Populate the map with field display name and value
                        mapFieldToValue.put(mapCurFldApiToDLF.get(api).Name , displayVal);
                    }
                }
                //Add all records to the list
                lstResultRecord.add(mapFieldToValue);
            }
            if(!lstResultRecord.isEmpty())
                mapSearchResult.put(dlName , lstResultRecord);
        }
        return mapSearchResult;
    }
    
    /**
    *  Description of the purpose of the class's method. 
    *  @name    :   updateUserSession
    *  @param   :
                    1. currentPage  :   Captures the value for Current page which is currently accessed by the logged in user
                    2. fname        :   Captures the value of first name sent from UI
                    3. lname        :   Captures the value of last name sent from UI
                    4. cin          :   Captures the value of cin sent from UI
                    5. dob          :   Captures the value of date of birth sent from UI
                    6. gender       :   Captures the value of gender sent from UI
    *  @return  : void
    *  @purpose : Method to get logged in user session Id
    */
     @AuraEnabled
    public static void updateUserSession(String currentPage, String fname, String lname, String cin, String dob, String gender){
        UtilityGeneral.updateUserSession(currentPage, fname, lname, cin, dob, gender);
    }
    
    /**
    *  Description of the purpose of the class's method. 
    *  @name    :   logHIPAAAudit
    *  @param   :
                    1. acctId           :   Captures the value of patient Id
                    2. hc_DataComponent :   Captures the value of Data domain currently accessed by the logged in user
    *  @return  : void
    *  @purpose : Method to log audit details
    */
    @AuraEnabled
    public static void logHIPAAAudit(String acctId ,String hc_DataComponent){
        HIPAAAuditLogin__c hipaaauidLogObj=HIPAAAuditLogin__c.getInstance(hc_DataComponent);
        if(hipaaauidLogObj!=null && acctId != null )
        {
            HIPAAAuditLogController.logAccess(acctId, hc_DataComponent);
        }
    }
}