/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcAdtConversionAssignCoordController, js front-end controller for HcAdtConversionAssignCoord component.
 * @since 198
 */
({
    onTypeInSearch: function(component, event, helper) {
        component.set('v.output',{});
        component.set('v.searchTerm', event.target.value);
    }
})