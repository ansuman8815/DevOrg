({
    DeleteAction:function(cmp, recordId){
        var recordName = '';
        var records = cmp.get("v.foundResult");
        var ridKeyPrefix = recordId.substring(0,3);
        var myMap = JSON.parse(cmp.get("v.objectKeyPrefix"));
        var objectType = myMap[ridKeyPrefix];
       for(var i=0;i<records.length;i++)
        {
            if(records[i].Id ==recordId){
                if(records[i].Name != undefined ){
                    recordName =records[i].Name ;
                }else if(records[i].LastName != undefined ){
                    recordName = records[i].LastName;    
                }else if(records[i].Subject != undefined ){
                    recordNam = records[i].Subject ;
                }else if(records[i].Title != undefined ){
                    recordNam = records[i].Title;
                }
            }
        }
        cmp.set("v.UserActionMessage","Are you really want to delete '"+recordName+"' this record");
        var dialogBox = cmp.find("DialogBoxActionID");
        $A.util.removeClass(dialogBox,'slds-hide');
        $A.util.addClass(dialogBox,'slds-show');
    },
	getSearchRecords : function(cmp,event)
    {
		var ct = cmp.find("SearchInputTextID");
        var myCmp = cmp.find("hideshowsldc");
        $A.util.removeClass(myCmp, "slds-is-close");
        $A.util.addClass(myCmp, "slds-is-open");
        var d = cmp.find("SearchInputTextID").getElement();
        //console.log('Input Search Text - '+d.value.length);
        cmp.set("v.message","Searching '"+d.value+"'");
        if(d.value == null || d.value=='' || d.value.trim() =='' || d.value.length <3){
           	cmp.set("v.foundResult",null);
            cmp.set("v.message","Please enter more than 2 char");
            return ;
        }
        this.apexInvoker(cmp,d.value);
	},
    
    apexInvoker :function(cmp,SearchText)
    {
        cmp.set("v.isfoundResult",false);
        var queryFastVal = cmp.get("v.queryFast");
    	var action = cmp.get("c.searchRecord");
        action.setParams({ searchField :SearchText ,queryFast :queryFastVal});
		action.setCallback(this, function(response){
            	var state = response.getState();
            	if (state === "SUCCESS"){
                	//console.log(" Result From server response: " + response);
                   // console.log(" Result From server: getReturnValue >> Length" + response.getReturnValue().length);
                    var dl = '';
                    if(response.getReturnValue().length <1){
                        cmp.set("v.message","Not found any result");
                    } 
                    else{ 
                        cmp.set("v.isfoundResult",true);
                    }
					cmp.set("v.foundResult",response.getReturnValue());
             
            	}else{
                    	var errors = response.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                console.log("Error message: " + 
                                         errors[0].message);
                            }
                        } else {
                            console.log("Unknown error");
                        }
                }
        	});
    		$A.enqueueAction(action);
	},
    
    getKeyPrefixMap : function(cmp){
        var action = cmp.get("c.getPrefixMap");
            var Configuration = { 	
            					"inUserContext" 		: cmp.get("v.inUserContext"),
                              	"OpenSearchMetaData"	: cmp.get("v.OpenSearchMetaData"),
                				"OpenObjectSchema":cmp.get("v.OpenObjectSchema")
                            };
        action.setParams({
            "Configuration":JSON.stringify(Configuration)
        });
        action.setCallback(this, function(response){
            	var state = response.getState();
            	if (state === "SUCCESS"){
                    var t = JSON.parse(response.getReturnValue());
    				console.log(t.fastQuery);	 
                    cmp.set("v.objectKeyPrefix",t.keyPrefixMap);
                    cmp.set("v.queryFast",t.fastQuery);
                }else{
                    	var errors = response.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                console.log("Error message: " + 
                                         errors[0].message);
                            }
                        } else {
                            console.log("Unknown error");
                        }
                }
        });
        $A.enqueueAction(action);
    }
    
})