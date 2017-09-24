/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcCustomLookupHelper,helper file to hadle retrieve ans search functions.
 * @since 198
 */
({
    retrieveData: function(component) {
        var obj = component.get("v.Sobject");
        var recId = component.get("v.selectedId");
        var action = component.get("c.searchById");
        if (recId != '' && recId != null) {
            action.setParams({
                "typeName": obj,
                "recordId": recId
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    component.set("v.selectedName", response.getReturnValue());
                } else if (state === "ERROR") {
                    var errors = response.getError();
                    if (errors) {
                        $A.log("Errors", errors);
                        if (errors[0] && errors[0].message) {
                            throw new Error (errors[0].message);
                        }
                    } else {
                        throw new Error("Unknown error");
                    }
                }
            });
            $A.enqueueAction(action);
        }
    },
    searchRecords: function(component,lookupValue) {
        component.set("v.showSpinner", true);
        var isMultiColumn = component.get("v.isMultiColumn");
        if(lookupValue == null || lookupValue == '')
        component.set("v.selectedId",'');
        else
        component.set("v.selectedId",'no results found');
        var action;
        if(isMultiColumn){
          action = component.get("c.searchMultipleFields");
          action.setParams({
              "typeName": component.get("v.Sobject"),
              "keySearch": component.find("lookupValue").getElement().value,
              "selectFields":component.get("v.selectFields"),
              "whereClause": component.get("v.whereClause"),
              "limitSize":component.get("v.limitSize")
          });
        }
        else{
          action = component.get("c.search");
            var params = {
                "typeName": component.get("v.Sobject"),
                "keySearch": component.find("lookupValue").getElement().value,
                "whereClause": component.get("v.whereClause"),
                "limitSize":component.get("v.limitSize")
            };
            if (params.typeName === "Topic") {
                var topicWhereClauseMap = new Object();
                topicWhereClauseMap["EntityType"] = "Account";
                params.whereClause = topicWhereClauseMap;
                params.limitSize = 20;
            }
            action.setParams(params);
        }
        var self = this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result  = response.getReturnValue();
                component.set("v.resultList", result);
                component.set("v.renderResult", true);
                component.set("v.errorMsg","");
                if(!isMultiColumn){
                  if(result[0]['name'] === $A.get('$Label.HealthCloudGA.Text_Lookup_NoResults')){
                      component.set("v.selectedId",'no results found');
                  }
                }
                else if(isMultiColumn){
                  var compEvent = component.getEvent("hcCustomLookupMultiColumnEvent");
                  compEvent.setParams({ "multiColumnItems" : result });
                  compEvent.fire();
                }
                $(document).mouseup(function(e) {
                    var container = $(".slds-lookup");
                    if (!container.is(e.target) && container.has(e.target).length === 0){
                        if(component.isValid())
                            component.set("v.renderResult",false);
                    }
                });
                //console.log('******* result'+JSON.stringify(result));
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    $A.log("Errors", errors);
                    if (errors[0] && errors[0].message) {
                        throw new Error (errors[0].message);
                    }
                } else {
                    throw new Error("Unknown error");
                }
            }
            component.set("v.showSpinner", false);
        });
        $A.enqueueAction(action);
    },

    afterRerenderMethod : function(component){
        if(component != undefined && component.get("v.resultSel")){
            component.find("lookupValue").getElement().value = component.get("v.selectedName");
            component.set("v.resultSel", false);
        }
    },
    processSelected: function(component, selectedRecId, selectedName) {
            component.set("v.selectedName",selectedName);
            component.set("v.resultSel", true);
            component.set("v.renderResult", false);
    },

    isEnterKeyPressed: function(event) {
        if ($A.util.isUndefinedOrNull(event)) {
            return false;
        }

        var enterPressed = false;
        // we need to identify the actual keyCode integer
        if (event.key) {
            // DOM level 3 draft spec
            // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
            switch (event.key) {
                case "Enter":
                    enterPressed = true;
                    break;
                default:
                    break;
            }
        } else {
            var keyCode = null;
            if (event.keyIdentifier) {
                if(event.keyIdentifier == 'Enter') {
                    // safari on OSX returns this weirdness
                    enterPressed = true;
                } else {
                    // The following was taken from: http://stackoverflow.com/questions/27206737/how-can-i-convert-google-chromes-keyidentifier-to-something-reasonable
                    // parse base-16 to base 10 int
                    keyCode = parseInt(event.keyIdentifier.substr(2), 16);
                }
            } else {
                keyCode = event.which ? event.which : event.keyCode;
            }

            if(!enterPressed){
               enterPressed = (keyCode == 13);
            }
        }
        return enterPressed;
    }

})