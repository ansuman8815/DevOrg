({
    toggleHandler : function(component,event) {
    	var whichButton = event.getSource().getGlobalId();
        var toggleText = component.find(whichButton);
        $A.util.toggleClass(toggleText, "toggle");
    }
})