/*
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcPatientMinicardController, js front-end controller for HcPatientMinicard component
 * @since 200
 */
({
	// handle open patient details action
	handleOpenPatientDetails: function(component, event, helper) {
		var patientId;
		// retrieve patient data from component
		var patient = component.get("v.patient");
		var defRecOpenType = component.get("v.defRecOpenType").toLowerCase();
		if(defRecOpenType === 'account'){
			patientId = patient.accountId;
		}
		else if(defRecOpenType === 'contact'){
			patientId = patient.contactId;
		}
		// create unique tab label from patient ID & name
		var tabLabel = patient.firstname + " " + patient.lastname;
		helper.openPatientDetailsPage(component, patientId, tabLabel);
	}
})