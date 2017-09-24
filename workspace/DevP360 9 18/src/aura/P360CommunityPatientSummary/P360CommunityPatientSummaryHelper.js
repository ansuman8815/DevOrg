({    
    getPatientBannerData : function(component) {
        var action = component.get("c.getPatientBannerData");
        action.setParams({ 
            patientId : component.get("v.patientid")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                console.log(response.getReturnValue());
                component.set("v.patientBannerData", response.getReturnValue());
                component.set("v.isLoaded" , true);
             }
        });
        $A.enqueueAction(action);
	},
    helperMethodFooter: function(component , event, helper) {
        var winHeight = $(window).height();
        var x = document.getElementById('footerHide');
        var contentHeight = $('#column3Div').height();
        if (winHeight > contentHeight){
            x.style.position = "fixed";
        }else{
            x.style.position = "relative";
        }
        x.style.display = 'block';
    }
})