/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcFilterColumnSelectorCmpController, controller class for HcFilterColumnsSelectorCmp Component.
 * @since 196
 */
({
    /*
     * This function is responsible for loading the Patient related Filterable Objects/Categories on intialization.
     * In addition it responsible for loading the filter columns for Edit Filter functionality.
     */
    doInit: function(component, event, helper) {
      helper.getCategories(component, event);
      helper.getColumnsByFilterId(component, event);
      helper.getGlobalSettings(component);
    },

    getAndUpdateCategoryFields: function(component, event, helper) {
      helper.getAndUpdateCategoryFields(component, event);
    },

    setSelectedCategoryField: function(component, event, helper) {
      helper.setCurrentField(component, event);
    },

    setSelectedColumnField: function(component, event, helper) {
      helper.setCurrentColumn(component, event);
    },

    moveFromCategoryToColumnFields: function(component, event, helper) {
      helper.addFieldToColumns(component);
    },

    moveFromColumnToCategoryFields: function(component, event, helper) {
      helper.removeFieldFromColumns(component);
    },

    pushValueUp: function(component, event, helper) {
      helper.pushColumnValue(component, -1);
    },

    pushValueDown: function(component, event, helper) {
      helper.pushColumnValue(component, 1);
    },
})