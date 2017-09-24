({
    
    handleTemplateAddEvent: function(component, event, helper) {
        var self = this;

        var selectedTemplate = event.getParam("selectedTemplate");
        var selectedItems = component.get("v.selectedTemplateList");
        if ($A.util.isUndefinedOrNull(selectedItems)) {
            selectedItems = {};
        }
        var selectedTemplateCountLimit = component.get("v.selectedTemplateCountLimit");
        if (Object.keys(selectedItems).length >= selectedTemplateCountLimit) {
            //send a tost message : Cannot select more than 5 templates.
            //the value 5 should come from custom setting
            self.showToast(component, {message: HC.format($A.get("$Label.HealthCloudGA.Msg_Info_CarePlanTemplateWizard_Selection_Count"), selectedTemplateCountLimit) }, true, 'warning');
            var selectedItems = [selectedTemplate.data];
            var selectTable = component.find("CarePlanTemplateSelectTable");
            selectTable.deselectItems(selectedItems);
            return;
        }
        self.setTemplateSelectionAttribute(component, selectedTemplate.data, false);

    },

    handleTemplateRemoveEvent: function(component, event, helper) {
        var self = this;
        var selectedTemplate = event.getParam("selectedTemplate");

        var selectedItems = {};
        if(selectedTemplate.eventType === "SELECTION"){
            selectedItems[selectedTemplate.data.Id] = selectedTemplate.data;
            self.setTemplateSelectionAttribute(component, selectedTemplate.data, true);
        } else{
            selectedItems[selectedTemplate.Id] = selectedTemplate;
            self.setTemplateSelectionAttribute(component, selectedTemplate, true);
            var deselectedItems = [selectedTemplate];
            var selectTable = component.find("CarePlanTemplateSelectTable");
            selectTable.deselectItems(deselectedItems);

        }
    },

    setTemplateSelectionAttribute: function(component, selectedItem, isRemoveEvent) {

        var selectedTemplateList = component.get("v.selectedTemplateList");
        var packageNamespace = component.get("v.packageNamespace");
        
        if(isRemoveEvent){
            var removedSelectedTemplateList = [];
            var i = 0;
            for(var index = 0; index < selectedTemplateList.length; index++ ){
                if(selectedTemplateList[index].Id !== selectedItem.Id){
                    removedSelectedTemplateList.push(selectedTemplateList[index]);
                    
                }
            }
            component.set("v.selectedTemplateList", removedSelectedTemplateList);
        } else {
            selectedTemplateList.push(selectedItem);
            component.set("v.selectedTemplateList", selectedTemplateList);
        }
        
    },

    handleTableRefeshedEvent: function(component, eventData){
        var tableData = eventData.list;
        var selectedTemplateList = component.get('v.selectedTemplateList');

        var itemsToSelect = [];
        for(var i = 0; i< selectedTemplateList.length; i++) {
            for(var j = 0; j<tableData.length ; j++){
                if( selectedTemplateList[i].Id  === tableData[j].Id ){
                    itemsToSelect.push(tableData[j]);
                }
            }
        }

        if(itemsToSelect.length > 0){
            var templateTable = component.find('CarePlanTemplateSelectTable');
            templateTable.selectItems(itemsToSelect);
        }
    }
})