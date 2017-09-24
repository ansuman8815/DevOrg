({
    relatedAccount: 'RELATED_ACCOUNT',
    relatedCase: 'RELATED_CASE',
    relatedContact: 'RELATED_CONTACT',

    setupButtons: function(component){
        var entity = component.get("v.entity");

        var buttonLabel = '';
        if (entity.isGroup) {
            if (entity.bucketType === this.relatedCase) {
                buttonLabel = '$Label.HealthCloudGA.Header_Add_Member';
            }
            else {
                buttonLabel = '$Label.HealthCloudGA.Button_Label_Add_Group_Member';
            }
        }
        else {
            buttonLabel = '$Label.HealthCloudGA.Button_Label_Add_Household';
        }
        if (entity.bucketType===this.relatedContact){
            buttonLabel = '$Label.HealthCloudGA.Button_Label_Add_Contact';
        }
        if (entity.bucketType===this.relatedAccount){
            buttonLabel = '$Label.HealthCloudGA.Button_Label_Add_Account';
        }

        if (!$A.util.isEmpty(buttonLabel)){
            component.set('v.buttonLabel', $A.get(buttonLabel));
        }

        if (HC.isInAlohaConsole() && ((!entity.isGroup && $A.util.isUndefinedOrNull(entity.bucketType)) || entity.bucketType===this.relatedAccount)){
            var createButtonLabel = '$Label.HealthCloudGA.Button_Label_Relationship_New_Household';
            if (entity.bucketType===this.relatedAccount){
                createButtonLabel = '$Label.HealthCloudGA.Button_Label_Relationship_New_Account';
            }
            component.set('v.createButtonLabel',$A.get(createButtonLabel));
            component.set('v.showCreateButton',true);
        }
    },

    getParamsAndCreate: function(component, entity, parentEntity){
        var prefix = HC.orgNamespaceDash;
        var params = {};
        if (!$A.util.isUndefinedOrNull(entity) && entity.bucketType === this.relatedCase) {
            var careplanDefaultObj = {};
            var primaryCarePlan = entity.objId;
            if (!$A.util.isEmpty(primaryCarePlan)) {
                careplanDefaultObj[prefix + "ParentId"] = primaryCarePlan;
            }
            params = {
                "entityApiName": "CaseTeamMember",
                "defaultFieldValues": careplanDefaultObj
            };

            this.AddCaseTeamMember(component, params);
        }
        else {
            var primaryContact = entity.primaryContactId ? entity.primaryContactId : "";
            var primaryAccount = entity.primaryAccountId ? entity.primaryAccountId : "";
            if (entity.isGroup) {
                // add member to household
                params = {
                    "entityApiName": "AccountContactRelation",
                    "defaultFieldValues": {"AccountId": entity.relId}
                };
            }
            else if (entity.isIndividual || entity.isContact) {
                if (entity.bucketType === this.relatedContact) {
                    // add related contact
                    var conDefaultObj = {};
                    if (!$A.util.isEmpty(primaryContact)) {
                        conDefaultObj["Contact__c"] = primaryContact;
                        conDefaultObj["Contact__c__lookupValue"] = parentEntity.name;
                    }

                    params = {
                        "entityApiName": "ContactContactRelation__c",
                        "defaultFieldValues": conDefaultObj
                    };
                }
                else {
                    // add household
                    params = {
                        "entityApiName": "AccountContactRelation",
                        "defaultFieldValues": {"ContactId": primaryContact}
                    };
                }
            }
            else {
                if (entity.bucketType === this.relatedAccount) {
                    // add related account
                    params = {
                        "entityApiName": "AccountContactRelation",
                        "defaultFieldValues": {"ContactId": primaryContact}
                    };
                }
                else {
                    // default
                    params = {
                        "entityApiName": "AccountContactRelation",
                        "defaultFieldValues": {"AccountId": primaryAccount}
                    };
                }
            }
            this.createRecord(component, params);
        }

    },

    AddCaseTeamMember : function(component, params) {
        var prefix = HC.orgNamespaceDash;
        var fieldName = prefix + "ParentId";
        var caseId = params.defaultFieldValues[fieldName];
        $A.createComponent("HealthCloudGA:HcCareTeamAddMember", {
                caseId: caseId
            },
            function(view,status, errorMessage) {
                component.set("v.modal", view);
            }
        );
    },

    createRecord: function (component, params) {
        HC.invokeCreateRecord(params.entityApiName, undefined, params.defaultFieldValues, null, null);
    }
})