/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCareTeamDetailCmpRenderer, js front-end renderer for HcCareTeamDetailCmp component.
 * @since 200
 */
({
  rerender: function(component, helper) {
    var sanitizedURL = component.get('v.memberObjphotoURL');
    var health1CareteammemberCircleBase = document.getElementById('health1-careteammember-circleBase');
    health1CareteammemberCircleBase.style.backgroundImage = 'url(' + sanitizedURL + ')';
    return this.superRerender();
  }
})