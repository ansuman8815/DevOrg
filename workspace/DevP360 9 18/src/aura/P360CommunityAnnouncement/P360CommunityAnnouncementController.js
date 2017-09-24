({
    onClickAnnouncement: function(component, event, helper) {
        var action = component.get("c.updateUserRecord");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state == 'SUCCESS') {
                component.set("v.isRead",true);
            }
        });
        $A.enqueueAction(action);
        
        
    },
   
    isRead: function(component,event)
    {
        var action = component.get("c.checkIfAnnouncementRead");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state == 'SUCCESS') {
                component.set("v.isRead",response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
        
        var actiongetrefreshData = component.get("c.getRefreshDate");
         actiongetrefreshData.setCallback(this, function(response) {
            var state = response.getState();
            if (state == 'SUCCESS') {
                 var res = response.getReturnValue();
                 component.set("v.refreshData",res);
            }
        });
        $A.enqueueAction(actiongetrefreshData);
    }
    
    
})