({
    doInit : function(component, event, helper) {
        var encId = component.get("v.encounterid");
        var action = component.get("c.getEncBannerData");
        action.setParams({ encId : encId });
        action.setCallback(this, function(response)
                           {
                               var state = response.getState();
                               if (state === "SUCCESS")
                               {
                                   var res = response.getReturnValue();
                                   component.set("v.EncSummList", res);
                               }
                           });
        $A.enqueueAction(action);
    },
    myAction : function(component, event, helper) {
        $('body').append('<script>svg4everybody();</script>');
    },
    doneRendering : function(component, event, helper) {
        setTimeout(function() {
            var ipadonlydisplay =  $(".ipadonlydisplay").height();
            var firstCol = $(".ipadonlydisplay .firstCol").height();
            var secondCol = $(".ipadonlydisplay .secondCol").height();
            if(firstCol > secondCol){
                $('.firstCol').css('border-right','1px solid #ccc');
                $('.secondCol').css('border-left', 'none');
            }
            else{
                $('.secondCol').css('border-left', '1px solid #ccc');
                $('.firstCol').css('border-right','none');
            }
        }, 100);
        
    }
})