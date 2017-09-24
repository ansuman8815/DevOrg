({
    doInit : function(component, event, helper) {
       /* $().ready(function() {  
        $('.drop-down').append('<div class="button"></div>');    
        $('.drop-down').append('<ul class="select-list"></ul>');    
        $('.drop-down select option').each(function() {  
        var bg = $(this).css('background-image');    
        $('.select-list').append('<li class="clsAnchor"><span value="' + $(this).val() + '" class="' + $(this).attr('class') + '" style=background-image:' + bg + '>' + $(this).text() + '</span></li>');   
        });    
        $('.drop-down .button').html('<span style=background-image:' + $('.drop-down select').find(':selected').css('background-image') + '>' + $('.drop-down select').find(':selected').text() + '</span>' + '<a href="javascript:void(0);" class="select-list-link">Arrow</a>');   
        $('.drop-down ul li').each(function() {   
        if ($(this).find('span').text() == $('.drop-down select').find(':selected').text()) {  
        $(this).addClass('active');       
        }      
        });     
        $('.drop-down .select-list span').on('click', function()
        {          
        var dd_text = $(this).text();  
        var dd_img = $(this).css('background-image'); 
        var dd_val = $(this).attr('value');   
        $('.drop-down .button').html('<span style=background-image:' + dd_img + '>' + dd_text + '</span>' + '<a href="javascript:void(0);" class="select-list-link">Arrow</a>');      
        $('.drop-down .select-list span').parent().removeClass('active');    
        $(this).parent().addClass('active');     
        $('.drop-down select[name=options]').val( dd_val ); 
        $('.drop-down .select-list li').slideUp();     
        });       
        $('.drop-down .button').on('click','a.select-list-link', function()
        {      
        $('.drop-down ul li').slideToggle();
        });
		});  */
    },
	selectChange : function(component, event, helper) {
        console.log('On change');
		var selected = component.find("sel").get("v.value");
        console.log('On change : '+  selected);
        var pageName = component.get("v.pageName");
        console.log('On change Get select list value :: '+pageName);
        component.set("v.listName" , selected);
        var tableName = selected.split(' ').join('_');
        var evntVar = $A.get("e.c:DropdownEvent");
        evntVar.setParams({"listName":selected});
        evntVar.setParams({"pageName":pageName});
        evntVar.setParams({"tableName":tableName});
        evntVar.setParams({"dropdownChange":true});
        evntVar.fire();
      },
  	getLstValue : function(component, event, helper) {
		console.log('Get select list value');
        var pageName = component.get("v.pageName");
        var listName = component.get("v.listName");
        console.log('Get select list value :: '+pageName);
        
		var action = component.get("c.getDropDownValue");
        action.setParams({"pageName":pageName});
		action.setCallback(this, function(data) {
            var res = data.getReturnValue();
            var index = res.indexOf(listName);
            if (index >= 0) {
              res.splice( index, 1 );
            }
            res.push(listName);
            res.reverse();
         
            component.set("v.options" , res);
		});
		$A.enqueueAction(action);
        
      }
})