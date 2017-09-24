/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcLookUp, js front-end controller for HcLookUp component.
 * @since 202
 */


({

    doInit : function(component, event, helper) {
    },

    typeAheadAction : function(component, event, helper) {
        helper.narrowDownList(component, event);
        // if user types out full entry and
        // hits enter key
        if(event.keyCode == 13){
            var clickedItem = event.currentTarget.value;

            component.set('v.selectedItem', clickedItem);
            // blur component to hide list
            component.getElement().querySelector('input').blur();
            // fire the change event so the parent component
            // is aware of the change to selectedItem
            var ReturnHitEvent = component.getEvent('onLookUpChangeEvent');
            ReturnHitEvent.fire();
        } // end if

        // TODO: allow user to toggle thourgh list with arrow keys.
        // below is the code to toggle through the list with down arrow
        // just need to handle the up arrow

        // if(event.keyCode == 40){
        // 	var lookupMenulistItem = component.getElement().querySelector('.slds-lookup__list').getElementsByTagName('li');
        //
        // 	for(i=0; i<lookupMenulistItem.length; i++){
        // 		if($A.util.hasClass(lookupMenulistItem[i].children[0], 'lookupListItemActive')){
        // 			 var thisOne = lookupMenulistItem[i];
        // 		}// end if
        //
        // 	}// end for
        // 	if(!thisOne){
        // 		$A.util.toggleClass(lookupMenulistItem[0].children[0], 'lookupListItemActive');
        // 		component.getElement().querySelector('#lookup').focus();
        // 	}
        //
        // 	if(thisOne) {
        // 		var nextOne = thisOne.nextSibling.children[0];
        // 		$A.util.toggleClass(thisOne.children[0], 'lookupListItemActive');
        // 		$A.util.toggleClass(nextOne, 'lookupListItemActive');
        // 		component.getElement().querySelector('#lookup').focus();
        // 	}
        //
        //
        // }// end if event.keyCode == 40
    },

    toggleLookupList : function(component, event, helper) {
        // grab the component to set the proper state
        //var lookupMenu = component.getElement().querySelector('.slds-lookup__menu');
        var componentElement = component.getElement();
        var cssToggleClass = 'slds-is-open';
        // update typedText if not updated from
        // last click to select
        helper.updateTypedText(component);
        // if event is just a click to focus and show list
        // reset list to all values till user types again
        if(event.type === "focus") {
            helper.deleteBtnHit.key = false;
            $A.util.addClass(componentElement, cssToggleClass);
            // reset the list to show all options on 'show'
            component.set('v.list', component.get('v.originalList'));
        }

        if(event.type === "blur") {
            //  stop function if you are clicking on the icons
            if(helper.deleteBtnHit.key){
                component.getElement().querySelector('input').focus();
                return;
            }
            $A.util.removeClass(component.getElement(), cssToggleClass);
        }
    },

    valueChange : function(component, event, helper) {
        helper.valueChangeHandler(component, event);
    },

    checkValueAgainstOGList : function(component, event, helper) {
        // if the list passed to the component changes
        // iterate over the new list to see if the
        // previous selectedItem matches an item in the new list
        // if not reset the selectedItem to the placholder
        var selectedItem = component.get('v.selectedItem');

        if(selectedItem !== ""){
            var originalList = component.get('v.originalList');
            component.set('v.list', originalList);
            var list = component.get('v.list');
            var match;

            for(var i = 0; i<list.length; i++){
                if(list[i] === selectedItem) match = true;
            } // end for loop

            if(match === true) return;

            component.getElement().querySelector('input').value = "";
            component.set('v.selectedItem', "");
        } // end if selectedItem !== ""

    },

    deleteText : function(component, event, helper){
        var inputField = component.getElement().querySelector('input');
        helper.deleteBtnHit.key = true;
        inputField.value = "";
        //helper.updateTypedText(component);
        helper.valueChangeHandler(component, event);
        inputField.focus();
    },

})