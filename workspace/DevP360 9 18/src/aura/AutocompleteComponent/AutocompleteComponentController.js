({
	doInit : function(component, event, helper) {
        var opts=[];
        var action = component.get("c.getRegistry");
        var inputsel = component.find("InputSelectDynamic");
        action.setCallback(this, function(data) {
        var optionData = JSON.parse(JSON.stringify(data.getReturnValue()));
        var keys = Object.keys(optionData);
        var val = Object.values(optionData);
       // console.log('Keys'+keys);
       // console.log('val'+val);
        var options = '';
        for(var i=0;i< keys.length;i++){
        	//opts.push({"class": "optionClass", label: val[i], value: keys[i]});
        	options += '<option id="'+keys[i]+'" value="'+val[i]+'"/>';
            //options.push({"class": "option", label: val[i], value: keys[i]});
        }    
            
        //inputsel.set("v.options", opts);
        document.getElementById('registrylists').innerHTML = options;
       // console.log(document.getElementById('registrylists').innerHTML);
        /*var list = document.getElementById('registry');
        keys.forEach(function(item){
   		var option = document.createElement('option');
   		option.value = item;
   		list.appendChild(option);
		});*/
		});
        $A.enqueueAction(action);
	},
})