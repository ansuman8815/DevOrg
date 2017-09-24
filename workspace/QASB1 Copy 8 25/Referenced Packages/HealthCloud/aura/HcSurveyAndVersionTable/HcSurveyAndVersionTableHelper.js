/* * Copyright © 2017 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description Sent to patient table helper function
 * @since 210.
*/
({
	getInitialData : function(cmp,evt,hlp) {
        var dataProvider = cmp.get('v.dataProvider');
        var provideEvent = dataProvider[0].get("e.provide");
        var parameters = {'type':'DataFetch'};
        var eventData = {"parameters" : parameters};
        provideEvent.setParams(eventData);
        provideEvent.fire();
    }
})