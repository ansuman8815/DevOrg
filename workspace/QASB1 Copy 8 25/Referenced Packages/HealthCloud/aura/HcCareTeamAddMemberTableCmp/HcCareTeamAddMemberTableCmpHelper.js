/** Copyright © 2015 salesforce.com, inc. All rights reserved.
  * @copyright This document contains proprietary and confidential information and shall not be reproduced,
  * transferred, or disclosed to others, without the prior written consent of Salesforce.
  * @description HcCareTeamAddMemberTableCmpHelper, js front-end helper for HcCareTeamAddMemberTableCmpHelper component.
  * @since 198
  */
({  
    onMembersChange: function (component, event) {
        if (!$A.util.isEmpty(component.get("v.members"))) {
            var firstMember = component.get("v.members")[0];
            component.set("v.radioValue", firstMember.id);
            component.set('v.output', firstMember);
        }
    }
})