/** Copyright © 2015 salesforce.com, inc. All rights reserved.
  * @copyright This document contains proprietary and confidential information and shall not be reproduced,
  * transferred, or disclosed to others, without the prior written consent of Salesforce.
  * @description HcCareTeamDataProviderController, js front-end controller for HcCareTeamDataProvider component.
  * @since 198
  */
({
    provide: function(component, event, helper) {
        if (component.get('v.items') == null) return;

        helper.provide(component, event);
    }
})