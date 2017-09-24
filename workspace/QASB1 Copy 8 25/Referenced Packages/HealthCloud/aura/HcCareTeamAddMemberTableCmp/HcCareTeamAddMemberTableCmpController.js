/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCareTeamAddMemberTableCmpController, js front-end controller for HcCareTeamAddMemberTableCmp component.
 * @since 198
 */
({
    onInit: function (component, event, helper) {
        helper.onMembersChange(component, event);
    },
    
    handleClick: function (component, event, helper) {
        var member = $A.getComponent(event.getSource().getGlobalId()).get("v.value");
        HC.openRecordSubTab(member.id, member.name);
    },

    handleSelect: function (component, event, helper) {
        var selected = event.getSource().get("v.text");
        component.set("v.radioValue", selected.id);
        component.set('v.output', selected);
    },
    
    onMembersChange: function (component, event, helper) {
        helper.onMembersChange(component, event);
    }
})