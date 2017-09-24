({
    doInit: function(component, event, helper) {

        //This is needed if we want to do AutoInit
    	helper.abstractInit(component, event, helper);
    },

    handleRefreshEvent: function(component, event, helper) {
    	if (event.getParam("type") == "REFRESH_CARETEAMLIST" && component.get("v.carePlanId") == event.getParam("memberObj").carePlanId) {
            helper.abstractInit(component, event, helper);
        }
    }
})