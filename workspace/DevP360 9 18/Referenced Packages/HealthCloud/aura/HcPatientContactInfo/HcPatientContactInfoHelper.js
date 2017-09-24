({
	getRecordDetails: function(component) {
        var action = component.get("c.getContactDetails");
        var self = this;
        action.setBackground();
        action.setParams({
            "contId": component.get('v.patientId')
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            var result;
            if (state === "SUCCESS") {
                result = response.getReturnValue();
                component.set('v.patientName', result["name"]);
                component.set('v.gender', result["gender"]);

                var bDateMap = result["bDateMap"];
                // only show birthdate & age if contact birthdate is set
                if (!$A.util.isUndefinedOrNull(bDateMap)){
                    var ageYears = result["age"].split(':')[0];
                    var yearLabel = $A.get("$Label.HealthCloudGA.Field_label_Years");
                    // if age less than 1 year, don't show years in age section
                    if (ageYears=='0'){
                      yearLabel = '';
                      ageYears = '';
                    }
                    if(ageYears == '1')
                      yearLabel = $A.get("$Label.HealthCloudGA.Field_label_Year");
                    var ageMonths = result["age"].split(':')[1];
                    var monthLabel = $A.get("$Label.HealthCloudGA.Field_label_months");
                    if (ageMonths=='1')
                      monthLabel = $A.get("$Label.HealthCloudGA.Field_label_month");
                    // if 0 months and age 1 year or over, don't show months
                    if(ageMonths == '0' && ageYears!=''){
                      ageMonths = '';
                      monthLabel = '';
                    }
                    var format = $A.get("$Label.HealthCloudGA.Field_BirthDate_Age");
                    var birthDate = this.getUserLocalizedDate(new Date(bDateMap["year"],bDateMap["month"]-1,bDateMap["day"]),'LL');
                    var bDateAndAge = HC.format(format,birthDate,ageYears,yearLabel,ageMonths,monthLabel);
                    component.set("v.bDateAndAge", bDateAndAge);
                }
            }
            if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        component.set('v.errorMsg', errors[0].message);
                    }
                } else {
                    component.set('v.errorMsg', "Unknown error");
                }
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