({
	doInit : function(component, event, helper) {
        var arrayRecords;
        var finalArrayRecords;
		var varSobject = component.get("v.objSobject");
        var api = component.get("v.fieldapi");
        var apiName = api.split('##')[0];
        var locallang = $A.get("$Locale.language");
        var localtimezone = $A.get("$Locale.timezone");
        
        
         if(api.split('##')[1] == 'Date')
        {
        	arrayRecords = varSobject[apiName.split('.')[0]];
            if(arrayRecords != undefined)
            	// finalArrayRecords = new Date(arrayRecords.toLocaleString('en-US', { timeZone: 'America/New_York' }));
              
            finalArrayRecords  = new Date();
            var d = new Date(arrayRecords);
            
            if( d != 'Invalid Date')
            {
                
           		 finalArrayRecords = d.toLocaleString(locallang);
                 var x = finalArrayRecords.substr(0, finalArrayRecords.length-6) + ' ' + finalArrayRecords.substr(finalArrayRecords.length-2, finalArrayRecords.length); ;
                 finalArrayRecords = x;
            }
           
          
              
        }
        else{
        	finalArrayRecords = varSobject[apiName.split('.')[0]];
        }
        if(finalArrayRecords != undefined)
            component.set("v.fieldvalue", finalArrayRecords);
	}
})