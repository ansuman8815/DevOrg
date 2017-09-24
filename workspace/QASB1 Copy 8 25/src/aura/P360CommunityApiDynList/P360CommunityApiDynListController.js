({
    doInit : function(component, event, helper) {
        console.log('Inside Do init');
        if(document.getElementById("errorpopUp"))
       		document.getElementById("errorpopUp").style.display = 'none';
        helper.tableCreation(component);
    },
    waiting: function(component, event, helper) {
        if(document.getElementById("Loadingspinner") != null)
            document.getElementById("Loadingspinner").style.display = "block";
        if(document.getElementsByClassName("top") && document.getElementsByClassName("top")[0])
        	document.getElementsByClassName("top")[0].style.display = 'block';
    },
    doneWaiting: function(component, event, helper) {
        
        if(document.getElementById("Loadingspinner") != null)
            document.getElementById("Loadingspinner").style.display = "none";
        console.log(document.getElementById("errorpopUp"));
        if(document.getElementById("errorpopUp"))
        	document.getElementById("errorpopUp").style.display = 'block';
        if(document.getElementsByClassName("top") && document.getElementsByClassName("top")[0])
        	document.getElementsByClassName("top")[0].style.display = 'block';
        //console.log("after click here i add top pxs")
        
    },
   refresh: function(component,event,helper){
       	 console.log('inside refresh');
       	 helper.fetchApiData(component , 'refresh');
    },
   getNextData: function(component,event,helper){
       	 console.log('inside getNextData');
       	 helper.fetchApiData(component , 'buttonClick');
    }
})