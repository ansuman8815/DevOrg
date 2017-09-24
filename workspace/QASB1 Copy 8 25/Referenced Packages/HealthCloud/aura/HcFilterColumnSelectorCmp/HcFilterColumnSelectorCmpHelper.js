/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcFilterColumnSelectorCmpHelper, helper class for HcFilterColumnSelectorCmp Component.
 * @since 196
 */
({
    getCategories: function(component, event) {
        var self = this;
        var action = component.get("c.getFilterablePatientRelatedObjectsMap");
        var errorResponse = [];

        action.setCallback(this, function(result) {
            var res = result.getReturnValue();
            var state = result.getState();

            if (res != undefined && null != res && state.toLowerCase() === "success") {
                // sort results list
                res.sort(function (a, b) {
                  return a.label.localeCompare(b.label);
                });
                component.set("v.categories", res);
            } else {
              var defaultCategory = new Object();
              defaultCategory.label = $A.get("$Label.HealthCloudGA.Filter_Default_Object");
              defaultCategory.value = "Account";
              errorResponse.push(defaultCategory);
              component.set("v.categories", errorResponse);
            }
        });
        $A.enqueueAction(action);
    },

    getAndUpdateCategoryFields: function(component, event) {
        var self = this;
        var selected = { 'value': HC.getDataAttribute(event.currentTarget, 'value'),
                         'label': self.getTextFromElement(event.currentTarget) };
        component.set("v.selectedCategory", selected);

        // clear dependant field options while new ones are loading
        component.set("v.categoryFields", [{ value: "", label: "Loading..."}]);

        var action = component.get("c.getSelectableFieldsForPatientRelatedObjectViaAPIName");

        action.setParams({
            "sObjectAPIName": selected.value
        });

        action.setCallback(this, function(result) {
            var res = result.getReturnValue();
            var state = result.getState();
            if (res != undefined && null != res && state.toLowerCase() === "success") {

                // check for values already in the columns list and remove them
                var fields = res;
                var columns = component.get('v.columnFields').slice(0); // slice is used to create a new array instead of a reference

                // remove selected field from available options
                var indexOfSelected = -1;
                for (var idx = 0; idx < fields.length; idx++ ) {

                  // loop over columns for each field entry
                  // :: if found reduce the columns to speed up the next lookup
                  for (var i = 0; i < columns.length; i++ ) {
                    if ( fields[idx].value == columns[i].field.value ) {

                      fields.splice(idx, 1); // remove the matching item from fields list
                      columns.splice(i, 1);  // reduce the columns list

                      // reduce our looping index every time we remove an item
                      idx--;

                      break;
                    }
                  }
                }

                // sort results list
                fields.sort(function (a, b) {
                  return a.label.localeCompare(b.label);
                });

                component.set("v.categoryFields", fields);

            } else {
                //If error occurs, don't have to populate any fields.
            }

        });
        $A.enqueueAction(action);
    },

    // set selected field as active/current selection
    setCurrentField: function(component, event) {
      var self = this;
      var element = event.currentTarget;
      var selected = { 'value': HC.getDataAttribute(element, 'value'),
                       'label': self.getTextFromElement(element) };
      component.set("v.selectedCategoryField", selected);
    },

    // set selected field as active/current selection
    setCurrentColumn: function(component, event) {
      var self = this;
      var element = event.currentTarget;
      var selected_data = HC.getDataAttribute(element, 'value').split(":");
      var selected_text = self.getTextFromElement(element).split(":");

      var selected = { 'category': { 'value': selected_data[0].trim(),
                                     'label': selected_text[0].trim() },
                       'field': { 'value': selected_data[1].trim(),
                                  'label': selected_text[1].trim() }
                     };

      component.set("v.selectedColumnField", selected);
    },

    // add a field to columns
    addFieldToColumns: function(component) {
      var selected = component.get("v.selectedCategoryField");

      // if for some reason our selection is empty then do nothing
      if (!selected) {
        return false;
      }

      var category = component.get("v.selectedCategory");
      var fields = component.get("v.categoryFields");
      var columns = component.get("v.columnFields");

      // remove selected field from available options
      var indexOfSelected = -1;
      for (var idx = 0; idx < fields.length; idx++ ) {
        if ( fields[idx].value == selected.value ) {
          indexOfSelected = idx;
          break;
        }
      }
      // only remove if we find a match
      if (indexOfSelected > -1) {
        fields.splice(indexOfSelected, 1);
      }
      component.set("v.categoryFields", fields);


      // check if value is already in the column list
      var columnExists = false;
      for (var idx = 0; idx < columns.length; idx++ ) {
        if ( columns[idx].field.value == selected.value ) {
          columnExists = true;
          break;
        }
      }

      // if value doesn't already exist, add it
      if (!columnExists) {
        // add selection (category + field) to columns list
        var column_map = { 'category': category, 'field': selected };

        columns.push(column_map);
        component.set("v.columnFields", columns);
      }

      // reset selected column field component attribute
      component.set("v.selectedCategoryField", "");
    },

    // remove field from columns
    removeFieldFromColumns: function(component) {
      var selected = component.get("v.selectedColumnField");

      // if for some reason our selection is empty then do nothing
      if (!selected) { return false; }

      var category = component.get("v.selectedCategory");
      var fields = component.get("v.categoryFields");
      var columns = component.get("v.columnFields");

      // remove column from column options
      var indexOfSelected = -1;
      for (var idx = 0; idx < columns.length; idx++ ) {
        if ( columns[idx].category.value === selected.category.value &&
             columns[idx].field.value === selected.field.value ) {
          indexOfSelected = idx;
          break;
        }
      }
      // only remove if we find a match
      if (indexOfSelected > -1) {
        columns.splice(indexOfSelected, 1);
      }
      component.set("v.columnFields", columns);

      // only add field back in if we have a selected category and it matches the currently selected one
      var selectedCategory = component.get("v.selectedCategory");

      if (selectedCategory && (selectedCategory.value === selected.category.value) ) {
        // add field back into field options
        // :: insert field back into fields list
        // :: sort list to maintain alpha sort
        var indexOfInsertion = fields.length;

        // iterate over fields until we find a label that is greater than the one to re-insert
        for (var idx = 0; idx < fields.length; idx++ ) {
          // break if we have a duplicate
          if ( fields[idx].label === selected.field.label ) {
            indexOfInsertion = -1;
            break;
          }

          // otherwise if we have an insertion point
          if ( fields[idx].label.localeCompare(selected.field.label) > 0 ) {
            indexOfInsertion = idx;
            break;
          }
        }

        // if we have a positive index perform the insert
        if ( indexOfInsertion >= 0 ) {
          // insert field back in at proper location
          fields.splice(indexOfInsertion, 0, { 'value': selected.field.value, 'label': selected.field.label });
          component.set("v.categoryFields", fields);
        }
      }

      // reset selected column field component attribute
      component.set("v.selectedColumnField", "");
    },

    // push column value up or down based on distance provided
    pushColumnValue: function(component, distance) {
      var selected = component.get("v.selectedColumnField");
      var columns = component.get("v.columnFields");
      var selectedIndex;
      var destinationIndex;

      // if for some reason our selection is empty then do nothing
      if (!selected) { return false; }

      // calculate current index location
      for (var idx = 0; idx < columns.length; idx++) {
        if ( selected.field.value == columns[idx].field.value ) {
          selectedIndex = idx;
          break;
        }
      }

      // confirm we don't intend to move the selected column beyond the range of the columns array
      destinationIndex = selectedIndex + distance;
      // if beyond the end of the array
      if ( destinationIndex > columns.length ) { destinationIndex = columns.length; }
      // if less than zero(0)
      if ( destinationIndex < 0 ) { destinationIndex = 0; }

      // move the selected column field by the distance specified
      columns.splice(destinationIndex, 0, columns.splice(selectedIndex, 1)[0]);

      // push updated array back to component
      component.set("v.columnFields", columns);
    },

    getColumnsByFilterId: function(component, event) {
        var filterId = component.get("v.filterId");
        component.set("v.columnsError","");

        // only retrieve if we have a filterID (i.e. edit mode)
        if (filterId != "" && undefined != filterId) {
            var action = component.get("c.getFilterColumnsByFilterCriterionId");

            action.setParams({
                "filterCriterionId": filterId
            });

            action.setCallback(this, function(result) {
                var res = result.getReturnValue();
                var state = result.getState();

                if (res != undefined && null != res && state === "SUCCESS") {
                    component.set("v.columnFields", res);
                } else {
                    component.set("v.columnsError",$A.get("$Label.HealthCloudGA.Msg_Error_Filter_Columns"));
                }
            });

            $A.enqueueAction(action);
        }
    },

    getTextFromEventElement: function(event) {
        var target = (event.srcElement != undefined) ? event.srcElement : event.target;
        return this.getTextFromElement(target);
    },

    getTextFromElement: function(target) {
        return (target.innerText != undefined) ? target.innerText.trim() : target.textContent.trim();
    },

    getGlobalSettings: function(component) {
        var self = this;
        var action = component.get("c.getGlobalSettings");
        var role;

        action.setCallback(this, function(response) {
            if (action.getState() === "SUCCESS") {
                var returnVal = action.getReturnValue();
                role = returnVal.PATIENT_ROLE;
                component.set("v.patientRole", role);
            } else {
              //Remove Comment once Aura bug for logging in console is fixed.
              //throw new Error($A.get("$Label.HealthCloudGA.Msg_Error_General"));
            }
        });
        $A.enqueueAction(action);
    },

})