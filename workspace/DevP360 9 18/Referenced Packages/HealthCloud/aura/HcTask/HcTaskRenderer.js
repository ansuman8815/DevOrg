({
	render: function(component, helper) {
		return this.superRender();
	},
	rerender: function(component, helper) {
		helper.afterRerenderMethod(component);
	}
})