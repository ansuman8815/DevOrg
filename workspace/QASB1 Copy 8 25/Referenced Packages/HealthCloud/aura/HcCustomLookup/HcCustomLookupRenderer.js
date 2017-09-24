/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCustomLookupRenderer,renderer file to hadle retrieve ans search functions.
 * @since 198
 */
({
	render: function(component, helper) {
		return this.superRender();
	},
	rerender: function(component, helper) {
		helper.afterRerenderMethod(component);
	}
})