/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description Controller class for generic expandable section container component
 * @since 200
 */

({
    // toggle state of component when toggle is clicked
    toggleClick: function(component, event, helper) {
        // check current state of component (expanded/collapsed)
        var isExpanded = component.get('v.isExpanded');
        component.set('v.isExpanded', !isExpanded);
    }
})