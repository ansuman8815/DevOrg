/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcLookUp, js front-end helper for HcLookUp component.
 * @since 202
 */


({

	deleteBtnHit: {
		'key':false,
	},

	narrowDownList : function(component, event) {
		// grab the value of the text being typed and
		// pass it to the function matchWhatsTyped so the list
		// can match and return
		this.updateTypedText(component);

		var list = component.get('v.originalList');
		var typedText = component.get('v.typedText');

	    var autoCompleteResult = this.matchWhatsTyped(typedText, list);
	    //check if the auto suggestion is empty. If it is empty, set the error field
	    if(autoCompleteResult.length==0){
          component.set('v.hasError', true);
	    }else{
	    component.set('v.list', autoCompleteResult);
	    // handle error-state on input when user types again
		component.set('v.hasError', false);
	   } 
	},

	matchWhatsTyped : function(typedText, list) {
		var reg = new RegExp(typedText.split('').join('\\w*').replace(/\W/, ""), 'i');

  	return list.filter(function(listItem) {
		    if (listItem.label.match(reg)) {
		      return listItem;
		    }
	  });
	},

	updateTypedText : function(component){
		var typedText = component.getElement().querySelector('input').value;
		component.set('v.typedText', typedText);
	},

	valueChangeHandler : function(component, event){
		var componentElement = component.getElement();
		var label_text = event.currentTarget.text ? event.currentTarget.text : '';
		var data_value = HC.getDataAttribute(event.currentTarget, 'value') ? HC.getDataAttribute(event.currentTarget, 'value') : '';

		var clickedItem = { 'value': data_value,
												'label': label_text };

		component.set('v.selectedItem', clickedItem);

		// fire the change event so the parent component
		// is aware of the change to selectedItem
		var ChangeEvent = component.getEvent('onLookUpChangeEvent');
		ChangeEvent.fire();

		var inputField = componentElement.querySelector('input');
		inputField.value = clickedItem.label;
		HC.setDataAttribute(inputField, 'value', clickedItem.value);

		var lookupMenu = componentElement.querySelector('.slds-lookup__menu');
		$A.util.removeClass(componentElement, 'slds-is-open');
	}

})