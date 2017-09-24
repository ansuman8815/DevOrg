({
    helperMethod : function(component , event, helper) {
        var listName = component.get("v.listName");
        var tableName = component.get("v.tableName");
        $("#"+tableName+" button").click(function (ev) {
            if(listName == "Clinical Notes" || listName == "Encounter Clinical Notes"){
                component.set("v.selectedId" , this.id);
                var compEvent = component.getEvent("cmpNotesEvent");
                compEvent.fire();
                component.set("v.selectedId" , this.id);
                $("#column2Div").css("margin-top","80px");
                if(!$( "#column1Div" ).hasClass( "slds-backdrop slds-backdrop--open" ))
                    document.getElementById("column1Div").className +=" slds-backdrop slds-backdrop--open";
                if(!$( "#column2Div" ).hasClass( "slds-backdrop slds-backdrop--open" ))
                    document.getElementById("column2Div").className +=" slds-backdrop slds-backdrop--open";
                if(!$( "#column4Div" ).hasClass( "slds-backdrop slds-backdrop--open" ))
                    document.getElementById("column4Div").className +=" slds-backdrop slds-backdrop--open";
            }
            else if( listName == "Encounter Provider"){
                component.set("v.selectedId" , this.id);
                var compEvent = component.getEvent("cmpNotesEvent");
                compEvent.fire();
                component.set("v.selectedId" , this.id);
                $("#column2Div").css("margin-top","80px");
                if(!$( "#column1Div" ).hasClass( "slds-backdrop slds-backdrop--open" ))
                    document.getElementById("column1Div").className +=" slds-backdrop slds-backdrop--open";
                if(!$( "#column2Div" ).hasClass( "slds-backdrop slds-backdrop--open" ))
                    document.getElementById("column2Div").className +=" slds-backdrop slds-backdrop--open";
                if(!$( "#column4Div" ).hasClass( "slds-backdrop slds-backdrop--open" ))
                    document.getElementById("column4Div").className +=" slds-backdrop slds-backdrop--open";
                if($( window ).width() <= 767){
                    $('.footer').css('position','absolute');
                }
            }
                else if(listName == "Encounter" ){
                    component.set("v.selectedId" , this.id);
                    var compEvent = component.getEvent("cmpNotesEvent");
                    compEvent.setParam("selectedNoteId", this.Id);
                    compEvent.fire();
                    component.set("v.selectedId" , this.id);
                }
            
        });   
    },
    helperMethodFooter: function(component , event, helper) {
        var headerHeight = $('#headerComp').innerHeight();
        var winHeight = $(window).height();
        var x = document.getElementById('footerHide');
        var xMargin = $('#footerHide').outerHeight (true) - $('#footerHide').innerHeight (); 
        
        var contentHeight = $('#column3Div').height();
        var dispHeight = contentHeight + headerHeight + xMargin;
        if (winHeight > dispHeight){
            x.style.position = "fixed";
        }else{
            x.style.position = "relative";
        } //}, 100);
        x.style.display = 'block';
    }
})