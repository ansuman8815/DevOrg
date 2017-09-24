({
    doinit : function(component, event, helper) {
        
        var objectType = 'account';
        try
        {
            var rid = component.get("v.recordID");
            var mapKey = component.get("v.KeyPrefixMap");
            var ridKeyPrefix = ''+rid.substring(0, 3);
            var myMap = new Map();
            myMap = JSON.parse(mapKey);
            var iconFolder = 'standard';
            objectType = myMap[ridKeyPrefix];
            var title = objectType;
            if(objectType == 'apex class' || objectType == 'apex trigger' || objectType == 'visualforce page' || objectType == 'visualforce component')
            {
                iconFolder = 'utility';
                objectType = 'settings';
            }
        }catch(err){
      		      
        }
         var mapKey = component.set("v.iconName",iconFolder+':'+objectType);
  				      component.set("v.Title",title);
    }
})