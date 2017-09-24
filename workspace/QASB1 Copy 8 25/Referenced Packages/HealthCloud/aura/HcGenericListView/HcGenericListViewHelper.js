/** 
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcGenericListView component: a configurable, reusable, container component for building
 * list UIs which allow the selection of multiple list views, and actions that can be applied to the 
 * list items;
 * @since 198
 */
({
    LINK_COLUMN_NAME_PREFIX: 'URL:',
    MESSAGE_TYPE_ACTION_SELECT: 'GLV:ActionSelect',
    MESSAGE_TYPE_VIEW_SELECT: 'GLV:ViewSelect',
    MESSAGE_TYPE_URL_CLICK: 'GLV:UrlClick',
    CLASS_RESPONSIVE_HIDE: 'health1-small-hide',

    loadView: function(component) {

        var selectedView = component.get('v.selectedView');
        var msgEvent = component.getEvent("HcMessageCmpEvent");
        component.set('v.selectedViewId', selectedView.Id);

        msgEvent.setParams({
            "type": this.MESSAGE_TYPE_VIEW_SELECT,
            "payload": {
                "selectedView": selectedView
            }
        });
        msgEvent.fire();        
    },

    setListMeta: function(component,eventData){
        component.set('v.sortBy',null);
        component.set('v.sortByLabel',null);
        for(var i=0; i<eventData.metaData.length; i++){
            var column = eventData.metaData[i];
            if (!$A.util.isEmpty(column.sortOrder)){
                component.set('v.sortBy',column.name);
                component.set('v.sortByLabel',column.label);
                break;
            }
        }
    }
 })