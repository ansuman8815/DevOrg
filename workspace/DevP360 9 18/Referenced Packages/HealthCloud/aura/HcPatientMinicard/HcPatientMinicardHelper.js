/*
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcPatientMinicardHelper, js front-end helper for HcPatientMinicard component
 * @since 200
 */
({
    // open a patient's details page (w/ tabs)
    // :: recordLabel should be unique such as "<patient name> (<patient ID>)"
    openPatientDetailsPage: function(component, recordId, recordLabel) {
        var self = this;

        if (this.checkForConsole()) {
            sforce.console.openPrimaryTab(null, '/' + recordId, true, recordLabel,  function (result) {
            // try to refocus on an existing primary tab if opening primary tab fails
            if (result.success != true) {
                sforce.console.focusPrimaryTabByName(recordId);    
            }}, recordId);
        }
    },

    // check for console
    checkForConsole: function() {
        if (!sforce.console.isInConsole()) {
            $A.log('Patient Mini Card not in service console. Returning false.');
            return false;
        }

        return true;
    },
})