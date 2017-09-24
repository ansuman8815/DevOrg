({
  
	selectChange : function(component, event, helper) {
      //  console.log('On change');
		var selected = component.find("sel").get("v.value");
       // console.log('On change : '+  selected);
        var pageName = component.get("v.pageName");
       // console.log('On change Get select list value :: '+pageName);
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
		//console.log('Get select list value');
        var pageName = component.get("v.pageName");
        var listName = component.get("v.listName");
        console.log('Get select page :: '+pageName);
         console.log('Get select list value :: '+listName);
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
            console.log(res);
            component.set("v.options" , res);
		});
		$A.enqueueAction(action);
        
      },
    myFunction : function(component,event,helper) {
           var myDropdown = document.getElementById('myDropdown');
           $A.util.toggleClass(myDropdown, 'dropdowndiplay');
    },
    registryClick : function(component, event, helper) {

        var quickLinkList_val = document.querySelector('#quickLinkList');
         console.log("The LI was clicked.");
            document.getElementById("dropbtnID").innerHTML = event.currentTarget.innerHTML;
            console.log(event.target.outerHTML);
            var myDropdown = document.getElementById('myDropdown');
            $A.util.addClass(myDropdown, 'dropdowndiplay');
        /*$("#quickLinkList li").click(function(e){
            console.log("The LI was clicked.");
            document.getElementById("dropbtnID").innerHTML = e.currentTarget.innerHTML;
            console.log(e.target.outerHTML);
            var myDropdown = document.getElementById('myDropdown');
            $A.util.addClass(myDropdown, 'dropdowndiplay');
        });*/
        /*var selected = quickLinkList_val.addEventListener('click', function (e) {
        document.getElementById("dropbtnID").innerHTML = e.target.outerHTML;
        console.log(e.target.outerHTML);
        var myDropdown = document.getElementById('myDropdown');
        $A.util.addClass(myDropdown, 'dropdowndiplay');
            
    });*/
    }
    
})