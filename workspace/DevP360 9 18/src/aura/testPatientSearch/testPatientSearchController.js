({
    doInit : function(component, event, helper) {
     
       
	
      
    },
	myAction : function(component, event, helper) {
		
	},
    myFunction : function(component,event,helper) {
            var myDropdown = document.getElementById('myDropdown');
           $A.util.toggleClass(myDropdown, 'dropdowndiplay');


    },
    registryClick : function(component, event, helper) {

        var quickLinkList_val = document.querySelector('#quickLinkList');
        var selected = quickLinkList_val.addEventListener('click', function (e) {
  document.getElementById("dropbtnID").innerHTML = e.target.outerHTML;
           console.log(e.target.outerHTML);
             var myDropdown = document.getElementById('myDropdown');
           $A.util.addClass(myDropdown, 'dropdowndiplay');
            
            });
    },
})