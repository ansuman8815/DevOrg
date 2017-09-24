/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcFieldSetsModalHelper, helper class for HcFieldSetsModal Component.
 * @since 196
 */
({


        saveResult: function(component, helper) {
            helper.pleaseWait(component, true, 'modalCmp');
            var fieldsetRecordEdit = component.find("MandatorySection");
            fieldsetRecordEdit.onSave();
        },

        handleFieldSetCmpEvent: function(component, event, helper) {
            var evtType = event.getParam("type");

            /*required Field validation error*/
            if (evtType === 'FS:VALIDATION_ERROR') {
                helper.handleValidationError(component, event, helper);
            }
            /*Sucess*/
            else if (evtType === 'FS:SUCCESS') {
                helper.handleSuccessScenerio(component, event, helper);
            }
            /*Error*/
            else if (evtType === 'FS:ERROR') {
                helper.handleErrorScenerio(component, event, helper);
            }
        },

        handleValidationError: function(component, event, helper) {
            var memberObj = {};
            memberObj["parentListItemId"] = component.get("v.parentListItemId");
            memberObj["topLevelParentId"] = component.get("v.topLevelParentId");
            memberObj["sObjectName"] = component.get("v.sObjectName");
            var payload = event.getParam("payload");
            var response = payload.response;
            component.set('v.toastObj', {
                'type': 'valitdation error',
                'message': response,
                'memberObj': memberObj
            });
            helper.pleaseWait(component, false, 'modalCmp');

        },

        handleSuccessScenerio: function(component, event, helper) {
            var recordId = component.get("v.recordId");
            var payload = event.getParam("payload");
            var response = payload.response;

            var memberObj = {};
            memberObj["parentListItemId"] = component.get("v.parentListItemId");
            memberObj["topLevelParentId"] = component.get("v.topLevelParentId");
            memberObj["sObjectName"] = component.get("v.sObjectName");
            
            // On successful response
            if (response.indexOf("Successfully") != -1) {
                if (null != recordId && recordId != '') {
                    $A.get("e.HealthCloudGA:HcComponentStatusEvent").setParams({
                        status: "SUCCESS",
                        message: $A.get("$Label.HealthCloudGA.Msg_Field_Set_Edit"),
                        memberObj: memberObj
                    }).fire();
                } else {
                    $A.get("e.HealthCloudGA:HcComponentStatusEvent").setParams({
                        status: "SUCCESS",
                        message: $A.get("$Label.HealthCloudGA.Msg_Field_Set_Success"),
                        memberObj: memberObj
                    }).fire();
                }

                var dataChangedEvent = $A.get("e.HealthCloudGA:HcCarePlanDataChangedEvent");
                dataChangedEvent.setParams({
                    "record": payload.resultMap,
                    "recordId": recordId,
                    "newParentId": memberObj.parentListItemId,
                    "topLevelParentId" : component.get("v.topLevelParentId"),
                    "sObjectName": component.get("v.sObjectName")
                });
                dataChangedEvent.fire();

                // if error occurs (server side)
            } else {

                component.set('v.toastObj', {
                    'type': 'error',
                    'message': response,
                    'memberObj': memberObj
                });

                helper.pleaseWait(component, false, 'modalCmp');

            }
        },

        handleErrorScenerio: function(component, event, helper) {
            var memberObj = {};
            memberObj["parentListItemId"] = component.get("v.parentListItemId");
            memberObj["topLevelParentId"] = component.get("v.topLevelParentId");
            memberObj["sObjectName"] = component.get("v.sObjectName");
            var payload = event.getParam("payload");
            var response = payload.response;
            component.set('v.toastObj', {
                'type': 'error',
                'message': response,
                'memberObj': memberObj
            });

            helper.pleaseWait(component, false, 'modalCmp');


        }
})