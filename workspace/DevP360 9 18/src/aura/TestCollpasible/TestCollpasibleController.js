({
	myAction : function(component, event, helper) {
		
	},

	doInit : function(component, event, helper) {
		
	},
    doneRendering : function(component, event, helper) {
       
    },
    toggleContent: function(component, event, helper) {
        console.log( $(this));
         var element = $(event.target.nodeName).parent();
       //var element=this.parent;
        $(element).addClass("hello");
        console.log(element);
        
         //var parent = $(element).parents("div");
        // element.siblings().find('.expanderContent').hide();
         element.find('.expanderContent').toggle();
        //var element=this;
         
        //element.find('.expanderContent').addClass("hi");
    },
    scriptsLoaded : function(component, event, helper) {
        /* $('.expanderHead').click(function(){
                    console.log('expanderHead');
             		
                    $(this).siblings().find('.expanderContent').hide();
                    $(this).find('.expanderContent').toggle();
             if($(this).find('.expanderContent').style.display== "block"){
                 
             }
             		var ToggleText = $(this).find('span');
             console.log(ToggleText);
                     if(ToggleText.innerText == "+"){
                         ToggleText.innerText = '-'
                     }
                     
                });*/
        		/*$('#example').dataTable({
                    "sPaginationType": "full_numbers",
                    "info":     false,
                    "sDom": '<"top"flp>rt<"bottom"i><"clear">',
                    
                    "order": [ 1, 'asc' ],
        
                    "oLanguage": 
                    {
                        "sSearch": "Search all columns:",
                        "oPaginate": 
                        {
                            "sNext": '&gt',
                            "sPrevious": '&lt'
                        }
                    }
                });*/

    },
    scriptsLoaded1 : function(component, event, helper) {
		var target = event.currentTarget;
        var parent = $(target).parent();
        $(parent).siblings().find('.expanderContent').hide();
        $(parent).find('.expanderContent').toggle();
        if ($(parent).find('.expanderContent').is(":visible")) {
            $('.ToggleText').html('&#9656;');
            $('.ToggleText',target).html('&#9662;');
            $(parent).find('h3').css({'background-color':'#007FFF','color':'#FFF'});
        	$(parent).siblings().find('h3').css({'background-color':'#fff','color':'#000'});
        }else{
            $('.ToggleText',target).html('&#9656;');
            $(parent).find('h3').css({'background-color':'#fff','color':'#000'});
        }
        
        $(parent).find('.expanderContent div').css('display','none');
             $(parent).find("#Loadingspinner").css('display','block');
        setTimeout(function() {
            $(parent).find('.expanderContent div').css('display','block');

                $(parent).find("#Loadingspinner").css('display','none');
        	
        }, 100);
        
          
    },
    expandContent: function(component, event, helper) {
        var target = event.currentTarget;
        //var parent = $(target).parent()
        //$('.ToggleText',parent).html('-');
        $(target).toggle();
    },
    waiting: function(component, event, helper) {
        if(document.getElementById("Loadingspinner") != null)
            document.getElementById("Loadingspinner").style.display = "block";
    },
    
    doneWaiting: function(component, event, helper) {
        if(document.getElementById("Loadingspinner") != null)
            document.getElementById("Loadingspinner").style.display = "none";
    },
   
})