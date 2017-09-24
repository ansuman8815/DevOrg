/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcBaseComponentRenderer, js front-end renderer for HcBaseComponent component.
 * @since 200
 */
({
	afterRender: function(component, helper) {
		helper.svg4everybody();
		return this.superAfterRender();
	}
})