/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCareTeamDetailCmpHelper, helper class for HcCareTeamDetail Component.
 * @since 206
 */
({
    onClick: function(component, event, helper) {
        var member = component.get("v.memberObj");
        var sanitizedURL = helper.sanitize(member.photoURL);
        // triggers the reRender
        component.set('v.memberObjphotoURL', sanitizedURL);
        var picCmp = component.find("health1-careteammember-checkmark");
        $A.util.removeClass(picCmp, "slds-hide");

        if (null != member && undefined != member && member.isInternal!=='true' && (member.isCommunityLive!=='true' || member.isCommunityEnabled!=true)) {
            $A.util.addClass(picCmp, "slds-hide");
        } 
        
        
    }

 })