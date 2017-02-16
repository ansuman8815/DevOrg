({
	handleApplicationEvent : function(component, event) {
       var ResultValue = event.getParam("Show_Result");
       // set the handler attributes based on event data
      console.log('before tabular data page');
       component.set("v.res", ResultValue);
       component.set("v.onLoad", 'true');
      console.log('tabular data page');
   }
})