/* * Copyright © 2017 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description client controller for HcCommunitySurveyDetails component
 * @since 210.
*/
({
	onInit: function(component, event, helper) {
		helper.loadSurveyDetails(component, event);
	}
})