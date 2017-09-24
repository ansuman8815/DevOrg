/*
+ * Copyright © 2015 salesforce.com, inc. All rights reserved.
+ * @copyright This document contains proprietary and confidential information and shall not be reproduced,
+ * transferred, or disclosed to others, without the prior written consent of Salesforce.
+ * @description helper to handle various functions.
+ * @since 198
*/
({
	rerender : function(component, helper) {
        var formElem = component.get("v.formElement");
        formElem.forEach(function(entry) {
            var value = entry.get("v.value");
            if(entry.toString().indexOf("ui:input") > -1) { // errors, showErrors and required are attributes present only in ui:input based components
                var required = entry.get("v.required");
                if (!value && required) {
                    entry.set("v.errors",  [{message: $A.get("$Label.HealthCloudGA.Field_Label_Required_field")}]);
                    entry.set("v.showErrors",  true);
                } else {
                    entry.set("v.errors", null);
                }
            }  
         }
           
       ); 
},
})