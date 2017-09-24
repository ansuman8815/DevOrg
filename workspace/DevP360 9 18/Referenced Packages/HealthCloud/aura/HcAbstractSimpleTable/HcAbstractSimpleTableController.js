({
	abstractInit : function(component, event, helper) {
        if ($A.util.isUndefinedOrNull( component.get('v.id') ) )
        { 
            component.set('v._id', component.getGlobalId() + '_SimpleTable' );
        }
        else
        {
            component.set('v._id', component.get('v.id') );   
        }
        helper.resetSelectedItems( component );
        if( $A.util.isEmpty( component.get('v.userDateFormat') ))
        {
            component.set("v.userDateFormat", $A.get("$Locale.dateFormat"));
        }
        if( $A.util.isEmpty( component.get('v.userDateTimeFormat') ))
        {
            component.set("v.userDateTimeFormat",$A.get("$Locale.datetimeFormat"));
        }
	},

	handleSort : function(component, evt, helper) {
        component._start = new Date().getTime();
        if (evt.currentTarget && evt.currentTarget.dataset.sortable == 'true') {
            var colId = evt.currentTarget.dataset.id;
            component.set("v.showSpinner",true);
            helper.sortBy(component,colId);
        }
    },

	showData : function(component, event, helper) {
        var eventData = event.getParam('data');
        var eventType = eventData.type;

        var eventTypeFunctionMap = {
            DataFetch : function() {
                helper.setTable(component,event);
            },
            MoreDataFetch : function() {
                helper.updateTable(component,event);
            },
            DataFilter : function() {
                helper.setFilteredTable(component,event);   
            },
            DataError : function() {
                helper.setTableWithErrors(component,event);
            }
        };

        if( eventTypeFunctionMap.hasOwnProperty(eventType) ) 
        {
            eventTypeFunctionMap[eventType]();
        }
        event.stopPropagation();

        var tableDataUpdatedEvent = component.getEvent("tableDataUpdatedEvent");
        tableDataUpdatedEvent.setParams({
            eventType: 'DATA_FETCHED',
            data: eventData
        });
        tableDataUpdatedEvent.fire();
    },

    fetchMoreData : function(component, event, helper) {
        var cmpId = component.get('v.id');
        component.set('v.dataFetchState', 'FETCHING');
        component.set('v.startT', new Date().getTime());
        helper.fetchMoreData(component);
    },
    
    showError : function(component, event, helper) {
        var errorMessage = event.getParam('error');
        if( $A.util.isUndefinedOrNull(errorMessage) && event.getName() == 'tableErrorEvent' )
        {
            errorMessage = event.getParam('eventSubType');
            var eventData = event.getParam('data');
            var errorObjects = [];
            for( var i = 0; i < eventData.length; i++ )
            {
                if( eventData[i].status == "ERROR" )
                {
                    errorObjects.push( eventData[i] );
                }
            }
            console.error( errorMessage, errorObjects );
        }
        var toastCmp = component.find('toast-message');
        toastCmp.set('v.content', {
            'type': 'error',
            'message': errorMessage
        });
        component.set("v.showSpinner",false); 
        event.stopPropagation(); 
    },

    handleActionEvent: function(component, event, helper) {
        var concreteComponent = component.getConcreteComponent();

        if ( typeof concreteComponent.handleActionEvent == "function" )
        {
            // NOTE: When concreteComponent's aura:method is invoked as follows,
            //   concreteComponent.handleActionEvent( param1, param2 );
            // the event received in concreteComponent controller will   
            // have { arguments : [ param1, param2 ] } as a property 
            
            component.set('v.actionEvent', event);
            concreteComponent.handleActionEvent();
        }
        else
        {
            console.log("ERROR: aura:method handleActionEvent not found in extended component.");
        }
    },   

    handleSelectionEvent: function(component, event, helper) {
        var concreteComponent = component.getConcreteComponent();

        if ( typeof concreteComponent.handleSelectionEvent == "function" )
        {
            component.set('v.selectionEvent', event);
            var eventType = event.getParam('eventType');
            
            if( eventType == 'SELECTION' )
            {
                helper.updateSelectedItems( event.getParam('data'), event.getParam('eventSubType'), component );
            }

            concreteComponent.handleSelectionEvent();
        }
        else
        {
            console.log("ERROR: aura:method handleSelectionEvent not found in extended component.");
        }
    },

    handlePointerEvent: function(component, event, helper) {
        var concreteComponent = component.getConcreteComponent();

        if ( typeof concreteComponent.handlePointerEvent == "function" )
        {
            component.set('v.pointerEvent', event);
            concreteComponent.handlePointerEvent();
        }
        else
        {
            //console.log("ERROR: aura:method handlePointerEvent not found in extended component.");
        }
    },

    populateSelectedItemsList: function(component, event, helper) {
        helper.getSelectedItems( component );
    },

    selectItems: function(component, event, helper) {
        var items = event.getParam("arguments")[0];
        helper.setSelectionForItems( component, items, true );
    },

    deselectItems: function(component, event, helper) {
        var items = event.getParam("arguments")[0];
        helper.setSelectionForItems( component, items, false );  
    },

    selectAll: function(component, event, helper) {
        helper.toggleSelectionForAllItems( component, true );
    },

    clearSelection: function(component, event, helper) {
        helper.toggleSelectionForAllItems( component, false );
    },

    toggleSelectAll: function(component, event, helper) {
        var checked = event.getSource().get('v.checked');
        if( checked )
        {
            helper.toggleSelectionForAllItems( component, true );
        }
        else
        {
            helper.toggleSelectionForAllItems( component, false );
        }
        // Update selected items list
        helper.getSelectedItems( component );
    },

    resetTable: function(component, event, helper) {
        helper.resetTable(component);
    },
    // DEBUG
    doneRendering: function(cmp, event, helper) {
        helper.progressMessage('Done Rendering',cmp.get('v.startT'),true);
    }   
})