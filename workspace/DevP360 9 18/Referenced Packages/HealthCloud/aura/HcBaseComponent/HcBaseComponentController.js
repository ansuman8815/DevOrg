({
    doInit: function(component, event, helper) {
    	var namespace = component.toString().match(/markup:\/\/(\w{1,15}):/)[1];
        component.set('v.namespace', $A.util.isEmpty(namespace) ? "c" : namespace);
        component.set('v.namespaceDash', $A.util.isEmpty(namespace) ? "" : namespace + '__');
        if($A.util.isEmpty(component.get('v.startT'))) {
        	component.set('v.startT',new Date().getTime());	
        }

        // IE shims
        helper.ieShims();
    }
})