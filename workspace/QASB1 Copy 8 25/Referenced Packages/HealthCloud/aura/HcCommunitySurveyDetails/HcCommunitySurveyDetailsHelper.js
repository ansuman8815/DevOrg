/* * Copyright © 2017 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description client helper for HcCommunitySurveyDetails component
 * @since 210.
*/
({
    loadSurveyDetails : function(component, event) {
        var recordData = component.get("v.surveyData");
           if(recordData != null){
               var col1Fields = [];
                col1Fields.push({
                    key: $A.get("$Label.HealthCloudGA.Field_Label_Name"),
                    value: recordData.surveyName,
                    isURL: false
                });
                col1Fields.push({
                    key: $A.get("$Label.HealthCloudGA.Field_Label_Description"),
                    value: recordData.invitationName,
                    isURL: false
                });
                 col1Fields.push({
                    key: $A.get("$Label.HealthCloudGA.Field_Label_Date_Sent"),
                    value:  recordData.localizedSentDate,
                   isURL: false
                });
                component.set("v.dataForColumn1", col1Fields);
                
                var col2Fields = [];
                var hrefLink = is_safe(recordData.invitationLink) ? recordData.invitationLink : "";
                col2Fields.push({
                    key: $A.get("$Label.HealthCloudGA.Dropdown_Action"),
                    value: hrefLink,
                    isURL: true,
                    hyperLinkText: $A.get("$Label.HealthCloudGA.Text_Open_Assessment")
                });
                col2Fields.push({
                    key: $A.get("$Label.HealthCloudGA.Field_Label_Status"),
                    value: recordData.status,
                    isURL: false
                });
                 col2Fields.push({
                    key: $A.get("$Label.HealthCloudGA.Field_Label_Date_Completed"),
                    value: recordData.localizedCompletedDate,
                    isURL: false
                });
                component.set("v.dataForColumn2", col2Fields);
            }

    },

    is_safe: function(url) {
    if (typeof(url) == 'string' && (url.indexOf('https:') === 0|| url.indexOf('/') === 0) ) { return true; } else { return false; }
	}
})