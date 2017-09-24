/* * Copyright © 2017 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description client helper for HcCommunitySurveyDetails component
 * @since 210.
*/
({
    loadSurveyDetails: function(component, event) {
        var action = component.get("c.getDetailsOfCompletedSurvey");
        var responseID = component.get("v.surveyResponseId");
        action.setParams({
            "surveyRespId": component.get("v.surveyResponseId")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var returnObj = response.getReturnValue();
                var sentDateMap = returnObj["sentDateMap"];
                var completedDateMap = returnObj["completedDateMap"];
                var sentDate = this.getUserLocalizedDate(new Date(sentDateMap["year"],sentDateMap["month"]-1,sentDateMap["day"]),'LL');
                var completedDate = this.getUserLocalizedDate(new Date(completedDateMap["year"],completedDateMap["month"]-1,completedDateMap["day"]),'LL');
                var responseDateInfo = $A.get("$Label.HealthCloudGA.Label_Sent") + ' ' + sentDate + '  .  ' + $A.get("$Label.HealthCloudGA.Label_Completed") + ' ' + completedDate;
                //set the component object attribute from returnObj
                component.set("v.responseDateInfo", responseDateInfo);
                returnObj["localizedSentDate"] = sentDate;
                returnObj["localizedCompletedDate"] = completedDate;
                component.set("v.surveyData", returnObj);
            }
        });
        $A.enqueueAction(action);
    },
    // returns a date string in the user's locale selection in Salesforce Setup
    getUserLocalizedDate: function(date, dateFormat) {
        var date = date || new Date();
        var dateFormat = dateFormat || 'LL'; // default to long local format

        // retrieve user's locale info and create is as a standard locale string (i.e.: en_US, fr_FR, de_DE)
        var userLocale = this.getUserLocaleString();

        // return the localized date
        return $A.localizationService.formatDate(date, dateFormat, userLocale);
    },

    // utility method to return a user's locale string
    // retrieve user's locale info and create is as a standard locale string (i.e.: en_US, fr_FR, de_DE)
    getUserLocaleString: function() {
        return $A.get("$Locale.userLocaleLang") + "_" + $A.get("$Locale.userLocaleCountry");
    },
})