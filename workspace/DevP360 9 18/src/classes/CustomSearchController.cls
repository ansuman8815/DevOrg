public without sharing class CustomSearchController {
	
    
    
    @AuraEnabled
    public static List<sObject> searchRecord(String searchField,String queryFast, String Configuration )
    {
        // ConfigurationWrapper config = (ConfigurationWrapper)JSON.deserialize(Configuration, CustomSearchController.ConfigurationWrapper.Class);
        //return Database.query('select id,name,createdDate from Account where name like \'%'+searchField+'%\'');
        //String searchquery='FIND\'*'+searchField+'*\'IN ALL FIELDS RETURNING Account(id,name,CreatedDate),Contact(id,Lastname,CreatedDate),opportunity(id,name,CreatedDate)'; 
		//StaticDataWrapper dd = (StaticDataWrapper)JSON.deserialize(doIntSetup(), CustomSearchController.StaticDataWrapper.Class);
        String searchquery='FIND\'*'+searchField+'*\'IN ALL FIELDS RETURNING '+ queryFast; 
        List<Sobject> l =new List<Sobject>();
		if(queryFast !=null && queryFast !='' && queryFast.trim() !='' )
		{
			List<List<SObject>> searchList =search.query(searchquery);
				for(List<Sobject> d : searchList)
				l.addAll(d);
			
		}
		return l;
    }

    @AuraEnabled
    public static String doIntSetup(String Configuration)
    {
        //system.debug('Configuration>>>>'+Configuration);
        ConfigurationWrapper config = (ConfigurationWrapper)JSON.deserialize(Configuration, CustomSearchController.ConfigurationWrapper.Class);
        //system.debug('Configuration>>>>'+config);
        Map<String,String> returnMap = new Map<String,String>();
        Map<String, Schema.SObjectType> gd = Schema.getGlobalDescribe();   
        /*Set<String> exemation = new Set<string>();
        exemation.add('knowledge__kav');
        exemation.add('kav'); 
         */
        String KAVObject = '__kav';
        String query = ''; 
        Set<String> metadataObjectSet;
        for(String sObj : gd.keySet())
        {
            Schema.DescribeSObjectResult r =  gd.get(sObj).getDescribe();
            if(!r.isSearchable()) continue;
            string objName =r.getName();
            
            if((config.inUserContext && !r.isAccessible() )|| objName.endsWithIgnoreCase(KAVObject)  )
               continue;
            
            Boolean isSkip = false;
            
            if(!config.OpenSearchMetaData ){
                metadataObjectSet = metadataObjectSet ==null?getMetaObjectSet():metadataObjectSet;
               	if(metadataObjectSet.contains(objName))
                	continue;
            }
            
            if(!config.OpenObjectSchema){
                	metadataObjectSet = metadataObjectSet ==null?getMetaObjectSet():metadataObjectSet;
               		if(!metadataObjectSet.contains(objName))
                		continue;         
            }
                
            
            if(r.getKeyPrefix() !=null && r.getKeyPrefix() !='')
          	returnMap.put(r.getKeyPrefix(),r.getLabel().toLowercase());
            
            Map<String, Schema.SObjectField> FsMap = r.fields.getMap();
            
            String CreateDate = '';
            String uniquefieldName = '';
            
            if(FsMap.containsKey('createDate') || FsMap.containsKey('CreateDate'))
             	CreateDate = ',CreateDate';   
            
            
            if(FsMap.containsKey('Name') || FsMap.containsKey('name'))
             	uniquefieldName = 'Name';   
            else if(FsMap.containsKey('LastName') || FsMap.containsKey('lastname'))
            	uniquefieldName = 'LastName';
            else if(FsMap.containsKey('Title') || FsMap.containsKey('title'))
            	uniquefieldName = 'Title';
           else if(FsMap.containsKey('Subject') || FsMap.containsKey('subject'))
            	uniquefieldName = 'Subject';
            else if(FsMap.containsKey('DataCategoryName') || FsMap.containsKey('datacategoryname'))
            	uniquefieldName = 'DataCategoryName';
            if(uniquefieldName !=''){
            	query +=query!=''?','+r.getName()+'(id,':r.getName()+'(id,';
                query +=uniquefieldName+CreateDate+')';
            }
        }
        
        string rm ='';
        if(returnMap != null)
        rm = JSON.serialize(returnMap);
        return JSON.serialize(new StaticDataWrapper(rm,query));
    }
    
    @AuraEnabled    
    public static String getPrefixMap(String Configuration){
        return doIntSetup(Configuration);
    }
    
    public class ConfigurationWrapper{
        public Boolean inUserContext;
        public Boolean OpenSearchMetaData; 
        public Boolean OpenObjectSchema;
        public ConfigurationWrapper(Boolean inUserContext,Boolean OpenSearchMetaData,Boolean OpenObjectSchema){
            this.inUserContext = inUserContext;
            this.OpenSearchMetaData = OpenSearchMetaData;
            this.OpenObjectSchema = OpenObjectSchema;
        }
    }
    
    public class StaticDataWrapper{
        @AuraEnabled
        public String keyPrefixMap;
        @AuraEnabled
        public String fastQuery;
        public StaticDataWrapper(String keyPrefixMap,String fastQuery){
            this.keyPrefixMap = keyPrefixMap;
            this.fastQuery = fastQuery;
        }
    }
    
    public static  Set<String> getMetaObjectSet()
    {
        Set<String> d = new Set<String>();
        d.add('PermissionSet');
        d.add('CollaborationGroup');
        d.add('Group');
        d.add('ApexPage');
        d.add('Profile');
        d.add('ApexClass');
        d.add('ApexTrigger');
        d.add('ApexComponent');
        d.add('StaticResource');
        d.add('ProcessDefinition');
        d.add('UserRole');
        d.add('AssignmentRule');
        return d;
    }
}