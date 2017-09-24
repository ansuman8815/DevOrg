({
    doInit : function(cmp, event, helper) {
        var action = cmp.get("v.res");
        console.log(action);
        if(document.getElementById("searchLinkDiv"))
        	document.getElementById("reRenderDiv").style.display = "block";
        else
            document.getElementById("basicAccessDiv").style.display = "block";
        var Loadingspinner = cmp.find('Loadingspinner');
        $A.util.addClass(Loadingspinner, "displayBlk");
        var ua = navigator.userAgent.toLowerCase();
		function removeSpaces(ua) {
		return ua.split(' ').join('');
		}
        
		ua = removeSpaces(ua);
      	var iPad = ua.match(/(ipad)/);
        if(iPad) {
             var searchResultvalue = cmp.find("searchDiv");
            $A.util.addClass(searchResultvalue, 'slds-max-medium-table--stacked-horizontal');
        }
        else{
            var searchResultvalue = cmp.find("searchDiv");
            $A.util.addClass(searchResultvalue, 'slds-max-medium-table--stacked-horizontal');
        }
    } 
})