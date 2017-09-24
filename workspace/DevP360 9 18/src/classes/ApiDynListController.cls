/**
	@Author      :	Cognizant Technology Solutions
	@name        :	ApiDynListController
	@CreateDate  :	07/10/2017 
	@Description :  Fetch Patient records to show in the pallets as per list name and where clause
	@Version     :	1.0
*/

public with sharing class ApiDynListController {
    /**
	*  Description of the purpose of the class's method. 
	*  @name    : getDataForComponent
	*  @param   : 1. listName  		 :	Captures the value for listName.
				  2. whereClauseArg  :	Captures the value for whereClauseArg.
				  3. resourceName	 :	Captures the value for resourceName.
				  4. empi	  		 :	Captures the value for Patient's empi.	
				  5. isPallet		 :	Captures the value for isPallet.
	*  @return  : DisplayPalletRecordsWrapper
	*  @purpose : Method to get Patient data from Dynamic List and Dynamic List Field object as as per list name & where clause
	*/
    @AuraEnabled
    public static DisplayPalletRecords getDataForComponent (String listName, String whereClauseArg ,
                                                            String resourceName , String empi, String isPallet)
    {
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
             if(UtilityData.obsResourceName.equals(resourceName)){
                apiResourceData.FromDate__c =  formatDateSlash(formatDate(Date.parse(refdate).addYears(-1)));
                apiResourceData.ToDate__c   =  formatDateSlash(formatDate(Date.parse(refdate)));
             }
             apiResourceData.EMPI__c     =  empi;
             apiResourceData.Resource__c =  resourceName;
             insert apiResourceData;
        }
        fromDate    = String.valueOf(apiResourceData.FromDate__c);
        toDate      = String.valueOf(apiResourceData.ToDate__c);
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
            
            for (Dynamic_List_Field__c dlf : dl.Dynamic_List_Fields__r)
            {
                if (isPallet == 'pallet' || isPallet == 'div')
                {
                    if(dlf.ShowInPallet__c)
                    {
                        lstFieldAPIName.add(dlf.fieldAPIName__c);
                        lstColumns.add(dlf.Name);
                        mapNameToDynamicField.put(dlf.Name,dlf);
                    }
                }
                	else
                    {
                		lstFieldAPIName.add(dlf.fieldAPIName__c);
                    	lstColumns.add(dlf.Name);
                    	mapNameToDynamicField.put(dlf.Name,dlf);    
                	}
            }
        }
        string strLimit = '';
        if (isPallet == 'pallet')
        {
            strLimit = ' LIMIT 3';
        }
        if (isPallet == 'div')
        {
            strLimit = ' LIMIT 1';
        }
        for(Dynamic_List_Field__c linkrefName : mapNameToDynamicField.values())
        {
            if(linkrefName.Link_Reference__c != null && linkrefName.Link_Reference__c != '')
                lstFieldAPIName.add(linkrefName.Link_Reference__c);
        }
        
        String strQuery = 'SELECT ' + string.join (lstFieldAPIName, ',') + ' FROM ' + objectName;
        String strCountQuery = '0';
        strCountQuery = 'SELECT count() FROM ' + objectName;
        if(string.isNotBlank(whereClauseArg) && string.isNotBlank(whereClause))
        {
            whereClause = string.format(whereClause, whereClauseArg.split('#'));
            whereClause = whereClause.replace('\"','\'');
            strQuery = strQuery +' WHERE ' + whereClause;
            strCountQuery = strCountQuery + ' where ' + whereClause;

        }
        if (string.isNotBlank(orderbyClause))
            strQuery = strQuery + ' ORDER BY ' + orderbyClause;
		if(isPallet == 'pallet' || isPallet == 'div')
            strQuery = strQuery + ' ' + strLimit ;                                                                
        if (string.isNotBlank(limitClause))
            strQuery = strQuery + ' LIMIT ' + limitClause ;
        Integer count;
        count  = database.countQuery(strCountQuery);    
        List<sObject> lstSObject = database.query(strQuery);
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
        if(apiResourceData.FromDate__c <= formatDateSlashApi(UtilityData.labelforDate))
            disabled = true;
        fromDate = fromDate == null ? fromDate : formatDateUI(fromDate);
        toDate = toDate == null ? toDate : formatDateUI(toDate);
        DisplayPalletRecords DisplayPalletRecordsVal = new DisplayPalletRecords(lst,lstColumns,disclaimer,fromDate,toDate,disabled,count);
        return DisplayPalletRecordsVal;
    }
    
    /**
    *  Description of the purpose of the Wrapper class.
    *  @name    : DisplayPalletRecords
    *  @purpose : Wrapper Class to pass the values.
    */
    public class DisplayPalletRecords {
        
        @AuraEnabled public List<Map<String,String>> data;
        @AuraEnabled public List<String> columns;
        @AuraEnabled public String disclaimer;
        @AuraEnabled public string fromDate;
        @AuraEnabled public string toDate;
        @AuraEnabled public Boolean disabled;
        @AuraEnabled public Integer count;
         
        public DisplayPalletRecords(List<Map<String,String>> data, List<String> columns, String disclaimer, String fromDate, String toDate, Boolean disabled, Integer count){
            this.data       = data;
            this.columns    = columns;
            this.disclaimer = disclaimer;
            this.fromDate   = fromDate      == null ? '' : fromDate;
            this.toDate     = toDate        == null ? '' : toDate;
            this.disabled   = disabled;
            this.count = count;
          }
    }
    
    /**
    *  Description of the purpose of the class.
    *  @name    :	formatDate
    *  @return	:	String
    *  @purpose :	Accepts Date & returns the string date in "dd-mm-yyyy" format..
    */
    public static String formatDate(Date d) {
        return  d.day() + '-' + d.month() + '-' + d.year();
    }
    
    /**
    *  Description of the purpose of the class.
    *  @name    :	formatDateUI
    *  @return	:	String
    *  @purpose :	Accepts Date in String format & returns string date by adding '/' in-between.
    */
    public static String formatDateUI(String d) {
        String[] stringDate = d.split('-');
        return  (integer.valueOf(stringDate[1]) + '/' + integer.valueOf(stringDate[2]) + '/' + integer.valueOf(stringDate[0]));
    }
    
    /**
    *  Description of the purpose of the class.
    *  @name    :	formatDateSlash
    *  @return	:	Date
    *  @purpose :	Accepts Date in String format & returns formatted date.
    */
    public static Date formatDateSlash(String d) {
        String[] stringDate = d.split('-');
        return  Date.newInstance(integer.valueOf(stringDate[2]) , integer.valueOf(stringDate[0]) , integer.valueOf(stringDate[1]));
    }
    
    /**
    *  Description of the purpose of the class.
    *  @name    :	formatDateSlashApi
    *  @return	:	Date
    *  @purpose :	Accepts Date in String format & returns formatted date.
    */
    public static Date formatDateSlashApi(String d) {
        String[] stringDate = d.split('-');
        return  Date.newInstance(integer.valueOf(stringDate[2]) , integer.valueOf(stringDate[1]) , integer.valueOf(stringDate[0]));
    }
    
    /**
    *  Description of the purpose of the class's method. 
    *  @name    :	getFHIRQueryResult
    *  @param   :	1.	resourceName	:	Captures the value for resourceName
				  	2.	empi			:	Captures the value for Patient empi
				  	3.	operation		:	Captures the value for operation selected refresh/button click
    *  @purpose :	Method to make API callout based on resource name,Patient's empi & operation Type.
    */
    @AuraEnabled
        public static String getFHIRQueryResult (String resourceName, String empi, String selectedId, String operation)
    {
        String sdate='';
        String edate='';
        String sDateToUpdate = '';
        String eDateToUpdate = '';
        String refdate;
        String res;
        refdate= UtilityGeneral.getLastETLRef(); 
        
        List<APIResourceData__c> lstResourceData = [SELECT FromDate__c , ToDate__c FROM APIResourceData__c WHERE Resource__c =: resourceName AND EMPI__c =: empi ORDER BY createddate desc LIMIT 1];
        System.debug('lstResourceData::'+lstResourceData+''+resourceName);
        APIResourceData__c apiResourceData = lstResourceData.isEmpty() ? new APIResourceData__c() : lstResourceData[0]; 
        if(lstResourceData.size() == 0){
             apiResourceData.FromDate__c =  formatDateSlash(formatDate(Date.parse(refdate).addYears(-1)));
             apiResourceData.ToDate__c   =  formatDateSlash(formatDate(Date.parse(refdate)));
             apiResourceData.EMPI__c     =  empi;
             apiResourceData.Resource__c =  resourceName;
        }
        
         if(operation == 'buttonClick')
         {
            sdate = formatDateSlash(formatDate(apiResourceData.FromDate__c.addmonths(UtilityData.labelgetNxtMonth))) <= formatDateSlash(UtilityData.labelforDate) ? UtilityData.labelforDate : formatDate(apiResourceData.FromDate__c.addmonths(UtilityData.labelgetNxtMonth));
			edate = formatDate(apiResourceData.FromDate__c);
            apiResourceData.FromDate__c = formatDateSlashApi(sdate);
        }
        else{
            if(apiResourceData.ToDate__c != null)
                sdate = formatDate(apiResourceData.ToDate__c);
            edate = formatDate(Date.today());
            apiResourceData.ToDate__c  = formatDateSlashApi(edate);
        }
        if(!UtilityData.obsResourceName.equals(resourceName)){
            sdate = '';
            eDate = '';
            apiResourceData.ToDate__c  = null;
            apiResourceData.FromDate__c = null;
        }
        
        res = FHIRQuery.forceGetResourcesByPatient(resourceName, empi, selectedId, sdate, edate);
        FHIRQueryResults fqResults = (FHIRQueryResults)JSON.deserializeStrict(res , FHIRQueryResults.class);
        String errorMessage = '';
        System.debug('res'+res);
        System.debug('sda'+UtilityData.obsResourceName);
       fqResults.operationSuccess = 'ERROR';
        if(fqResults.operationSuccess == 'ERROR'){
            Integer index = -1;
            String indexVal = '';
            Boolean addMsg = false;
            if(fqResults.errors.size() > 1)
                index = 0;                
            for(FHIRQueryResults.Error errList: fqResults.errors)
            {
               errList.type = UtilityData.labelErrorDMLRows;
               if(index == 0) {
                   index++;
                   indexVal = index + '.';
               }
               if(errList.type == UtilityData.labelErrorDMLRows)
               {
                   errorMessage = '<p/>' + indexVal + 'Currently showing Lab Result up to ' + errList.message + ' <button class=\'linkbutton\' onClick=\'{!c.refresh}\' id="' + errList.message + '">Click Here</button> to view more';
                   apiResourceData.FromDate__c = formatDateSlash(errList.message) <= formatDateSlash(UtilityData.labelforDate) ? formatDateSlashApi(UtilityData.labelforDate) : formatDateSlashApi(errList.message); 
                   upsert apiResourceData;
               }        
               else
               {
                   addMsg = true;
                   errorMessage = '<p/>' + indexVal + 'Error message – ' + errList.message + '; Type –' + errList.type + '; Status-' + errList.status + '; Service-' + errList.service ;
               }
            }
            if(addMsg)
                errorMessage = '<p/>Error occurred. Please reach out to an admin with below details: ' + errorMessage;
                errorMessage = errorMessage + '<p/><b>NOTE</b> – You are currently seeing the records cached in Patient 360 now.';
            }
        if(fqResults.operationSuccess == 'OK')
        {
            if(!UtilityData.obsResourceName.equals(resourceName)){
                apiResourceData.ToDate__c  = null;
                apiResourceData.FromDate__c = null;
            }
            upsert apiResourceData;
        }
        return errorMessage;
    }  
}