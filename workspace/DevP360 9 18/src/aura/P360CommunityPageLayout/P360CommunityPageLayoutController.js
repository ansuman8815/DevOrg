({
	myAction : function(component, event, helper) {
		$('head').append('<meta http-equiv="X-UA-Compatible" content="IE=edge">');
        $('body').append('<script>svg4everybody();</script>');  
	},
    getContent : function(component, event, helper) {
        var menuDivComp = document.getElementById("menuDiv");
        var quickLinkDiv = document.getElementById("quickLinkDiv");
        var searchLinkDiv = document.getElementById("searchLinkDiv");
      
         if (event.target.id != 'menuDiv' || event.target.id != 'searchLinkDiv' || event.target.id != 'quickLinkDiv') {
          
        }
       
        document.getElementById("searchLinkDiv").style.display = "none";
        document.getElementById("quickLinkDiv").style.display = "none";
        document.getElementById("menuDiv").style.display = "none";
       
    },
     doneWaiting :  function(component, event, helper) {
            var headerHeight = $('#headerComp').innerHeight();
            var winHeight = $(window).height();
            var x = document.getElementById('footerHide');
            var xMargin = $('#footerHide').outerHeight (true) - $('#footerHide').innerHeight (); 
            var contentHeight = $('#columnDiv2').height();
            var dispHeight = contentHeight + headerHeight + xMargin;
            if (winHeight > dispHeight){
                x.style.position = "fixed";
            }else{
                x.style.position = "relative";
            } //}, 100);
            x.style.display = 'block';
      // }
	}
})