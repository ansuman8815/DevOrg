({
    doinit :function(component, event, helper) {
        component.set("v.foundResult",[]);
        helper.getKeyPrefixMap(component);
    },
    
    ActionOnRecord :function(component, event, helper) {
      	var ActionData = event.currentTarget.getAttribute("data-id");
    	var actionPerform = ActionData.split('#')[1];
        var actionOnID = ActionData.split('#')[0];
       if(actionPerform == 'NEWWINDOW'){
           window.open("/"+actionOnID);
        }else if(actionPerform == 'DELETE'){
            helper.DeleteAction(component,actionOnID );
        }else if(actionPerform == 'OPEN'){
        	   window.location.href ="/"+actionOnID;
        }
    },
    
    DialogBoxAction:function(component, event, helper) {
        var ActionData = event.currentTarget.getAttribute("data-action");
        console.log(">>>>>>"+ActionData);
        if(ActionData =='CLOSE')
        {
            var dialogBox = component.find("DialogBoxActionID");
            $A.util.removeClass(dialogBox,'slds-show');
            $A.util.addClass(dialogBox,'slds-hide');
        }else{
            
        }
    },
    
    foucsOnSearchText :function(component, event, helper){
        var oldValue = component.get("v.oldsearchtext");
        if(oldValue != null && oldValue !='' && oldValue.trim() !=''){
        	var d = component.find("SearchInputTextID").getElement().value= oldValue;
        	helper.getSearchRecords(component, event);
        }
    },
    
    hideshowClass: function(component, event, helper) {
        window.setTimeout(
    		$A.getCallback(function() {
        		if (component.isValid()) {
                    var myCmp = component.find("hideshowsldc");
                    $A.util.addClass(myCmp, "slds-is-close");
                    $A.util.removeClass(myCmp, "slds-is-open");
                    component.set("v.oldsearchtext",component.find("SearchInputTextID").getElement().value);
                    var d = component.find("SearchInputTextID").getElement().value='';
                    //var d = component.find("SearchInputTextID").set("v.value",'');
               }
    		}), 500
		);
    },
    
	findout : function(component, event, helper) {
		helper.getSearchRecords(component, event);
   },
    
   showSpinner : function (component, event, helper) {
        var spinner = component.find('spinner');
        $A.util.removeClass(spinner,'slds-hide');
        $A.util.addClass(spinner,'slds-show');
       
      	if(component.get('v.isEnableBlockScreen'))
        {
            var isEnableBlockScreenVar = component.find('isEnableBlockScreenId');
            $A.util.removeClass(isEnableBlockScreenVar,'slds-hide');
        	$A.util.addClass(isEnableBlockScreenVar,'slds-show');
        }
    },
    
   hideSpinner : function (component, event, helper) {
        var spinner = component.find('spinner');
        $A.util.removeClass(spinner,'slds-show');
        $A.util.addClass(spinner,'slds-hide');
     	if(component.get('v.isEnableBlockScreen'))
        {
            	var isEnableBlockScreenVar = component.find('isEnableBlockScreenId');
                $A.util.removeClass(isEnableBlockScreenVar,'slds-show');
        		$A.util.addClass(isEnableBlockScreenVar,'slds-hide');
        }
   }
    
    
})