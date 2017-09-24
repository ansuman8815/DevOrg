({
	helperMethod : function(component) {
        $('.anchorClass').click(function (ev) {
            var urlEvent = $A.get("e.force:navigateToURL");
            urlEvent.setParams({
                "url": "/patientdetail?patientid="+this.name+"&empi="+this.value
            });
            urlEvent.fire();
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
        }
        x.style.display = 'block';
    }
})