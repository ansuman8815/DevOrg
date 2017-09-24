({
    doInit : function(component, event, helper) {
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
        if(document.getElementById("errorpopUp"))
            document.getElementById("errorpopUp").style.display = 'block';
        if(document.getElementsByClassName("top") && document.getElementsByClassName("top")[0])
            document.getElementsByClassName("top")[0].style.display = 'block';
    },
    refresh: function(component,event,helper){
        helper.fetchApiData(component , 'refresh');
    },
    getNextData: function(component,event,helper){
        helper.fetchApiData(component , 'buttonClick');
    },
})