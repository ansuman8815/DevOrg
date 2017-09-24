/**
	@Author      :	Cognizant Technology Solutions
	@name        :	DynamicListController
	@CreateDate  :  02/03/2017
	@Description :  Fetch Patient records to show in the pallets as per list name and where clause 
	@Version     :  1.0
*/
public without sharing class DynamicListController {
    /**
	*  Description of the purpose of the class's method. 
	*  @name	:	getDataForComponent
	*  @param   :	1. 	listName			:	Captures the value for listName 
					2. 	whereClauseArg		:	Captures the value for whereClauseArg
					3.	isPallet			:	Captures the value for isPallet 
	*  @return  :	DisplayPalletRecordsVal
	*  @purpose :	Method to get Patient data from Dynamic List and Dynamic List Field object as as per list name and where clause.
	*/
    @AuraEnabled
    public static DisplayPalletRecords getDataForComponent (String listName, String whereClauseArg, String isPallet){
        List<string> lstFieldAPIName = new List<string>();
        List<string> lstColumns = new List<string>();
        List<map<string, string>> lst = new List<map<string, string>>();
        
        Map<String,Dynamic_List_Field__c> mapNameToDynamicField = new Map<String,Dynamic_List_Field__c>();
        
        String objectName;
        String whereClause;
        String orderbyClause;
        String limitClause;
        String disclaimer = '';
       
        for (Dynamic_List__c dl : [Select Id, objectAPIName__c, WhereClause__c, Disclaimer__c , Order_By__c, Limit__c,  (select Id, Name, fieldAPIName__c, FieldType__c, ShowInPallet__c, isLink__c, Link_Reference__c, Operation__c from Dynamic_List_Fields__r WHERE onlySOSLSearch__c != true order by index__c) from Dynamic_List__c where Name =:listName])
        {            
            whereClause = dl.WhereClause__c;
            objectName = dl.objectAPIName__c;
            orderbyClause = dl.Order_By__c;
            limitClause = dl.Limit__c;
            disclaimer = dl.Disclaimer__c;
            for (Dynamic_List_Field__c dlf : dl.Dynamic_List_Fields__r){
                if (isPallet == 'pallet' || isPallet == 'div'){
                 
                    if(dlf.ShowInPallet__c){
                        lstFieldAPIName.add(dlf.fieldAPIName__c);
                        lstColumns.add(dlf.Name);
                        mapNameToDynamicField.put(dlf.Name,dlf);
                    }
                }
                else{
                  
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
        List<string> lstArg = new List<string>();
        if(whereClause != null & whereClauseArg != null)
        {
            for(string fill : whereClauseArg.split('#'))
            {
                lstArg.add(fill);
            }
            whereClause = string.format(whereClause, lstArg);
            whereClause = whereClause.replace('\"','\'');
            strQuery = strQuery +' where ' + whereClause;
            strCountQuery = strCountQuery + ' where ' + whereClause;
            if (orderbyClause != null && orderbyClause !='' )
            {
                strQuery = strQuery + ' order by ' + orderbyClause;
            }
            if(isPallet == 'pallet' || isPallet == 'div')
            {
                strQuery = strQuery + ' ' + strLimit ;
            }
            else {
                if (limitClause != null && limitClause !=''  )
                    strQuery = strQuery + ' limit ' + limitClause ;
            }
        }
       
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
                if(thisDf.fieldAPIName__c != null){
                    lstFieldAPI = thisDf.fieldAPIName__c.split(',');
                }
                if(thisDf.fieldType__c != null){
                    lstFieldType = thisDf.fieldType__c.split(',');
                }
                
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
                    
                    if (strdata != null && lstFieldType != null && lstFieldType.size() > i && lstFieldType[i] == 'Date'){
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
        
        DisplayPalletRecords DisplayPalletRecordsVal = new DisplayPalletRecords(lst , lstColumns, count, disclaimer);
        return DisplayPalletRecordsVal;
    }
    
    /**
	*  Description of the purpose of the wrapper class. 
	*  @name	:	DisplayPalletRecords
	*  @purpose :	Wrapper Class to pass the values.	
	*/
    public class DisplayPalletRecords {
        
        @AuraEnabled public List<Map<String,String>> data;
        @AuraEnabled public List<String> columns;
        @AuraEnabled public Integer count;
        @AuraEnabled public String disclaimer;
        
        public DisplayPalletRecords(List<Map<String,String>> data, List<String> columns, Integer count, String disclaimer){
            this.data = data;
            this.columns = columns;
            this.count = count;
            this.disclaimer = disclaimer;
        }
    }
    
      
    /**
	*  Description of the purpose of the class's method. 
	*  @name    :	getDropDownValue
	*  @param   :	1. 	pageName	:	Captures the value for pageName
	*  @return  : 	List of String values i.e Dynamic list Names.
	*  @purpose : 	Method to fetch Dropdown values for lightning components.
	*/
    @AuraEnabled 
    public static List<String> getDropDownValue (string pageName){
        List<String> lstDropDownVal = new List<String>();
        for (Dynamic_List__c dl : [Select name from Dynamic_List__c where pageName__c =: pageName]){
            lstDropDownVal.add(dl.name);
        }
        return lstDropDownVal;
    }
}