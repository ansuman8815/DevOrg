/*
Description: 1. Fetch Patient records to show in the pallets as per list name and where clause
Created By : Cognizant Technology Solutions
Create Date: 02/03/2017
*/
public with sharing class ApiDynListController {
    @AuraEnabled
    // Method to get Patient data from Dynamic List and Dynamic List Field object as as per list name and where clause
    public static DisplayPalletRecords getDataForComponent (String listName, String whereClauseArg , String resourceName , String empi){
        System.debug('Helllo');
        List<string> lstFieldAPIName = new List<string>();
        List<string> lstColumns = new List<string>();
        List<map<string, string>> lst = new List<map<string, string>>();
        Map<String,Dynamic_List_Field__c> mapNameToDynamicField = new Map<String,Dynamic_List_Field__c>();
        String refdate = '';
        String objectName;
        String whereClause;
        String orderbyClause;
        String limitClause;
        String disclaimer = '';
        String fromDate = '';
        String toDate = '';
        
        refdate = UtilityGeneral.getLastETLRef(); 
        List<APIResourceData__c> lstResourceData = [SELECT FromDate__c , ToDate__c FROM APIResourceData__c WHERE Resource__c =: resourceName AND EMPI__c =: empi ORDER BY createddate desc LIMIT 1];
        APIResourceData__c apiResourceData = lstResourceData.isEmpty() ? new APIResourceData__c() : lstResourceData[0]; 
        if(lstResourceData.size() == 0){
             apiResourceData.FromDate__c =  formatDateSlash(formatDate(Date.parse(refdate).addYears(-1)));
             apiResourceData.ToDate__c   =  formatDateSlash(formatDate(Date.parse(refdate)));
             apiResourceData.EMPI__c     =  empi;
             apiResourceData.Resource__c =  resourceName;
             insert apiResourceData;
        }
        
        /*fromDate    = formatDate(apiResourceData.FromDate__c);
        toDate      = formatDate(apiResourceData.ToDate__c);*/
        
        fromDate    = String.valueOf(apiResourceData.FromDate__c);
        toDate      = String.valueOf(apiResourceData.ToDate__c);
        
        system.debug('fromDate : '+fromDate);    
        system.debug('toDate : '+toDate);    
        for (Dynamic_List__c dl : [Select Id, objectAPIName__c, WhereClause__c, Disclaimer__c , Order_By__c, Limit__c, 
                                    (select Id, Name, fieldAPIName__c, FieldType__c, ShowInPallet__c, isLink__c, Link_Reference__c, Operation__c 
                                    from Dynamic_List_Fields__r WHERE onlySOSLSearch__c != true order by index__c) 
                                    from Dynamic_List__c where Name =:listName])
        {            
            whereClause = dl.WhereClause__c;
            objectName = dl.objectAPIName__c;
            orderbyClause = dl.Order_By__c;
            limitClause = dl.Limit__c;
            disclaimer = dl.Disclaimer__c;
            
            for (Dynamic_List_Field__c dlf : dl.Dynamic_List_Fields__r){
                lstFieldAPIName.add(dlf.fieldAPIName__c);
                lstColumns.add(dlf.Name);
                mapNameToDynamicField.put(dlf.Name,dlf);
            }
        }
        
        for(Dynamic_List_Field__c linkrefName : mapNameToDynamicField.values()){
            if(linkrefName.Link_Reference__c != null && linkrefName.Link_Reference__c != '')
                lstFieldAPIName.add(linkrefName.Link_Reference__c);
        }
        
        String strQuery = 'SELECT ' + string.join (lstFieldAPIName, ',') + ' FROM ' + objectName;
        
        if(string.isNotBlank(whereClauseArg) && string.isNotBlank(whereClause)){
            whereClause = string.format(whereClause, whereClauseArg.split('#'));
            //whereClause = string.format(whereClause,whereClauseArg);
            whereClause = whereClause.replace('\"','\'');
            strQuery = strQuery +' where ' + whereClause;
        }
        if (string.isNotBlank(orderbyClause))
            strQuery = strQuery + ' order by ' + orderbyClause;
        if (string.isNotBlank(limitClause))
            strQuery = strQuery + ' limit ' + limitClause ;
        
        List<sObject> lstSObject = database.query(strQuery);
        System.debug('ssss '+ strQuery);
        Map <String, Schema.SObjectField> fieldMap = Schema.getGlobalDescribe().get(objectName).getDescribe().fields.getMap();
       
        Map <String, Schema.SObjectField> fieldParentMap;       
        for (sObject sObj : lstSObject){
            map<string, string> mapFieldToValue = new map<string, string>();
            
            for (string fieldName:mapNameToDynamicField.keySet()){
                string data = '';  
                Dynamic_List_Field__c thisDf = mapNameToDynamicField.get(fieldName);
                List<string> lstFieldAPI = new List<string>();
                List<string> lstFieldType =  new List<string>();
                if(string.isNotBlank(thisDf.fieldAPIName__c))
                    lstFieldAPI = thisDf.fieldAPIName__c.split(',');

                if(string.isNotBlank(thisDf.fieldType__c))
                    lstFieldType = thisDf.fieldType__c.split(',');
                
                for (integer i=0; i< lstFieldAPI.size(); i++)
                {                   
                    string strdata;
                    if (lstFieldAPI [i].contains('__r')&& lstFieldAPI [i].contains('.')){
                        List<string> lstParentAndField = lstFieldAPI [i].split('\\.');
                        strdata =  string.valueOf(sObj.getSobject(lstParentAndField[0]).get(lstParentAndField[1]));
                    }
                    else{
                        strdata = string.valueOf(sObj.get(lstFieldAPI [i]));
                    }
                    
                    if (string.isNotBlank(strdata) && lstFieldType.size() > i && lstFieldType[i] == 'Date'){
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
                    }
                    //New code added on 8/1 to fix the datetiem issue with the Result Date & Time column
                    if(string.isNotBlank(strdata) && lstFieldType.size() > i && lstFieldType[i] == 'Datetime'){
                        Datetime dateVal = datetime.valueOfGmt(strdata);
                        strdata = dateVal.format('MM/dd/yyyy hh:mm a',UserInfo.getTimeZone().toString());
                    }
                    strdata = strdata == null ? '' : strdata;
                    data = data + strdata;
                }
                data = data == null ? '':data;
                if(thisDf.isLink__c == true){
                    string api = thisDf.Link_Reference__c;
                    string strId = string.valueOf(sObj.get(api));
                    data = '<button id="'+ strId + '" title= "'+ data + '" name= e.c:ClinicalNotesDetailEvent onclick=\'{!c.ViewMore}\' class=\'linkbutton\'>' + data + '</button>'; 
                }
                mapFieldToValue.put(thisDf.Name, data);
            }
            lst.add(mapFieldToValue);
        }
        Boolean disabled = false;
        system.debug('fromDate :: ' + fromDate);
        system.debug('UtilityData.labelforDate :: ' + UtilityData.labelforDate);
        
        system.debug('fromDate api:: ' + apiResourceData.FromDate__c);
        system.debug('UtilityData.labelforDate format :: ' + formatDateSlash(UtilityData.labelforDate));
        
        if(apiResourceData.FromDate__c <= formatDateSlashApi(UtilityData.labelforDate))
            disabled = true;
        DisplayPalletRecords DisplayPalletRecordsVal = new DisplayPalletRecords(lst,lstColumns,disclaimer,formatDateUI(fromDate),formatDateUI(toDate),disabled);
        return DisplayPalletRecordsVal;
    }
    
    public class DisplayPalletRecords {
        
        @AuraEnabled public List<Map<String,String>> data;
        @AuraEnabled public List<String> columns;
        @AuraEnabled public String disclaimer;
        @AuraEnabled public string fromDate;
        @AuraEnabled public string toDate;
        @AuraEnabled public Boolean disabled;
        
         
        public DisplayPalletRecords(List<Map<String,String>> data, List<String> columns, String disclaimer, String fromDate, String toDate, Boolean disabled){
            this.data       = data;
            this.columns    = columns;
            this.disclaimer = disclaimer;
            this.fromDate   = fromDate      == null ? '' : fromDate;
            this.toDate     = toDate        == null ? '' : toDate;
            this.disabled   = disabled;
          }
    }
    
    public static String formatDate(Date d) {
        return  d.day() + '-' + d.month() + '-' + d.year();
    }
    
    public static String formatDateUI(String d) {
        String[] stringDate = d.split('-');
        system.debug('formatDateUI :: ' + stringDate);
        return  (integer.valueOf(stringDate[1]) + '/' + integer.valueOf(stringDate[2]) + '/' + integer.valueOf(stringDate[0]));
    }
    
    public static Date formatDateSlash(String d) {
        String[] stringDate = d.split('-');
        system.debug(stringDate);
        return  Date.newInstance(integer.valueOf(stringDate[2]) , integer.valueOf(stringDate[0]) , integer.valueOf(stringDate[1]));
    }
    
    public static Date formatDateSlashApi(String d) {
        String[] stringDate = d.split('-');
        system.debug(stringDate);
        return  Date.newInstance(integer.valueOf(stringDate[2]) , integer.valueOf(stringDate[1]) , integer.valueOf(stringDate[0]));
    }
    
    @AuraEnabled
        public static String getFHIRQueryResult (String resourceName, String empi, String operation)
    {
        String sdate='';
        String edate='';
        String sDateToUpdate = '';
        String eDateToUpdate = '';
        String refdate;
        String res;
        refdate= UtilityGeneral.getLastETLRef(); 
         
        List<APIResourceData__c> lstResourceData = [SELECT FromDate__c , ToDate__c FROM APIResourceData__c WHERE Resource__c =: resourceName AND EMPI__c =: empi ORDER BY createddate desc LIMIT 1];
        
        APIResourceData__c apiResourceData = lstResourceData.isEmpty() ? new APIResourceData__c() : lstResourceData[0]; 
        if(lstResourceData.size() == 0){
             apiResourceData.FromDate__c =  formatDateSlash(formatDate(Date.parse(refdate).addYears(-1)));
             apiResourceData.ToDate__c   =  formatDateSlash(formatDate(Date.parse(refdate)));
             apiResourceData.EMPI__c     =  empi;
             apiResourceData.Resource__c =  resourceName;
             //insert apiResourceData;
        }
        
        System.debug('From Date : '+ apiResourceData.FromDate__c);
        System.debug('To Date :'+ apiResourceData.ToDate__c);
        
        if(operation == 'buttonClick'){
            sdate = formatDateSlash(formatDate(apiResourceData.FromDate__c.addmonths(UtilityData.labelgetNxtMonth))) <= formatDateSlash(UtilityData.labelforDate) ? UtilityData.labelforDate : formatDate(apiResourceData.FromDate__c.addmonths(UtilityData.labelgetNxtMonth));
			System.debug('Start Date from api: '+apiResourceData.FromDate__c.addmonths(UtilityData.labelgetNxtMonth));
            System.debug('Start Date formatdate: '+formatDate(apiResourceData.FromDate__c.addmonths(UtilityData.labelgetNxtMonth)));
            System.debug('Start Date sdate : '+sdate);
            edate = formatDate(apiResourceData.FromDate__c);
            apiResourceData.FromDate__c = formatDateSlashApi(sdate);
        }
        else{
            sdate = formatDate(apiResourceData.ToDate__c);
            edate = formatDate(Date.today());
            apiResourceData.ToDate__c  = formatDateSlashApi(edate);
        }
        
        System.debug('Start Date : '+sdate);
        System.debug('End Date :'+edate);
        
        //res = FHIRQuery.getResourcesByPatient(resourceName, empi, sdate, edate);
        res = FHIRQuery.forceGetResourcesByPatient(resourceName, empi, sdate, edate);
        FHIRQueryResults fqResults = (FHIRQueryResults)JSON.deserializeStrict(res , FHIRQueryResults.class);
        
        System.debug('fqResults :: ' + fqResults);
        String errorMessage = '';
        if(fqResults.operationSuccess == 'ERROR'){
            Integer index = -1;
            String indexVal = '';
            Boolean addMsg = false;
            if(fqResults.errors.size() > 1)
                index = 0;                
            for(FHIRQueryResults.Error errList: fqResults.errors)
            {
               System.debug('errList :: ' + errList.type);
               if(index == 0) {
                   index++;
                   indexVal = index + '.';
               }
               //errList.type = UtilityData.labelErrorDMLRows;
               //errList.message = '01/01/2010';
               if(errList.type == UtilityData.labelErrorDMLRows)
               {
                   errorMessage = '<p/>' + indexVal + 'Currently showing Lab Result up to ' + errList.message + ' <button class=\'linkbutton\' onClick=\'{!c.refresh}\' id="' + errList.message + '">Click Here</button> to view more';
                   apiResourceData.FromDate__c = formatDateSlash(errList.message) <= formatDateSlash(UtilityData.labelforDate) ? formatDateSlashApi(UtilityData.labelforDate) : formatDateSlashApi(errList.message); 
                   upsert apiResourceData;
               }        
               else{
                   addMsg = true;
                   errorMessage = '<p/>' + indexVal + 'Error message – ' + errList.message + '; Type –' + errList.type + '; Status-' + errList.status + '; Service-' + errList.service ;
               }
            }
            system.debug('errorMessage :: ' + errorMessage);
            if(addMsg)
                errorMessage = '<p/>Error occurred. Please reach out to an admin with below details: ' + errorMessage;
                errorMessage = errorMessage + '<p/><b>NOTE</b> – You are currently seeing the records cached in Patient 360 now.';
            }
        if(fqResults.operationSuccess == 'OK'){
            //Update resource data
            upsert apiResourceData;
        }
        return errorMessage;
    }
    
}