({
	// Your renderer method overrides go here
	 afterRender : function(component, helper) {
     	var ipCmp = component.find("registrylistId");
        var ipCmpEle = ipCmp.getElement();
        ipCmpEle.setAttribute("list", "registrylists");
        return this.superAfterRender();
	}
})