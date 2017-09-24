/*
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description Controller for the patientDetailComponent
 * @since 196
 */
({
    init: function(component, event, helper) {
        helper.isPSLRestricted(component);
    }
})