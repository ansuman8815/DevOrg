({
	init : function(component, event, helper) {
		var pagelist = [];
		var pageCount = parseInt(component.get("v.pageCount"));
		for(var i=1;i<=pageCount;i++){
			pagelist.push(i);
		}
		component.set("v.jumpToPageList",pagelist);
		var hcInputSelectOptions = helper.formatOptionsData(component.get("v.jumpToPageList"),component.get("v.pageNumber"));
    component.set("v.hcInputSelectOptions",hcInputSelectOptions);
	},
	first : function(component, event, helper) {
		component.getEvent("first").fire();
	},
	previous : function(component, event, helper) {
		component.getEvent("previous").fire();
	},
	next : function(component, event, helper) {
		component.getEvent("next").fire();
	},
	last : function(component, event, helper) {
		component.getEvent("last").fire();
	},
	setPageSize : function(component, event, helper){
		var cmpTarget = event.currentTarget;
    var pageSize ;
    children = cmpTarget.children[0].children;
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if(i==1){
          pageSize= c.innerHTML;
      }
		}
    component.set("v.recsPerPage",Number(pageSize));
    var myTarget = component.find("pageOptions");
		$A.util.toggleClass(myTarget, 'pageOptionsHide');
	},
	toggleOptions: function(component){
      var cmpTarget = component.find('pageOptions');
      $A.util.toggleClass(cmpTarget, 'pageOptionsHide');
  },
	onPageSelect: function(component,event){
		var pageNumber = component.find("selectedPageNumber").get('v.value');
		component.set("v.pageNumber", parseInt(pageNumber));
	},

	// handle change in pageNumber value
	handlePageChange: function(component, event, helper) {
		var pageNumber = component.get("v.pageNumber");
		component.find("selectedPageNumber").set('v.value', pageNumber.toString()); // toString is required due to HcInputSelect handling of value changes
	}
})