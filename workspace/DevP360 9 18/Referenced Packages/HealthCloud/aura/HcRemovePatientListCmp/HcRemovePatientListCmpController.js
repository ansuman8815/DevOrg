/**
 * Copyright © 2017 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcRemovePatientListCmpController, controller class for HcRemovePatientListCmp Component.
 * @since 208
 */
({
    onRemove: function(component, event, helper) {
        helper.removePatientList(component, event, helper);
    }
})