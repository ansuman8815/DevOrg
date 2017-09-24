({
    onActionTypesChange: function (cmp, event, helper) {
		var menuItems = [];

        var actionType = $A.util.isUndefinedOrNull(cmp.get("v.actionTypes")) ? null : cmp.get("v.actionTypes")[0];

        if(actionType == helper.MEMBERSHIP || actionType == helper.GROUP || actionType == helper.CARE_PLAN) {

            menuItems.push({ 
                                name: $A.get("$Label.HealthCloudGA.Link_Remove_Member"),
                                value : 'REMOVE_MEMBER'
                            });
        } else if(actionType == helper.RELATIONSHIP) {

            menuItems.push({ 
                                name: $A.get("$Label.HealthCloudGA.Menu_Item_Relationship_Remove"),
                                value : 'REMOVE_RELATIONSHIP'
                            });
        } else if(actionType == helper.STANDARD_BUTTON) {

            menuItems.push({ 
                                name: $A.get("$Label.HealthCloudGA.Menu_Item_Relationship_Remove"),
                                value : 'REMOVE_CONTACT_RELATIONSHIP'
                            });
        }
        
        cmp.set("v.menuItems", menuItems);

    },

    onRemove: function(cmp, event, helper) {
        if(!$A.util.isUndefinedOrNull(cmp.get("v.actionTypes"))){
            if (cmp.get("v.actionTypes")[0] === helper.CARE_PLAN) {
                helper.removeCareTeamMember(cmp, event, helper);
            } else if (cmp.get("v.actionTypes")[0] === helper.STANDARD_BUTTON) {
                helper.deleteContactContactRelation(cmp, event, helper);
            } else {
                helper.removeAccountRelations(cmp, event, helper);
            }
        }
    }
})