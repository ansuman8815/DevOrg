({
	myAction : function(component, event, helper) {
		$('head').append('<meta http-equiv="x-ua-compatible" content="ie=edge">');
        $('body').append('<script>svg4everybody();</script>');
        
        $(document).bind("contextmenu",function(e){
           return false;
        });
	}
})