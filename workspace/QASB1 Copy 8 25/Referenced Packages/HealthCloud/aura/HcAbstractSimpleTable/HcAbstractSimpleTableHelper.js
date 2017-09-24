({
    NAME_SELECTION: 'SELECTION_COLUMN',
    TYPE_SELECTION: 'SELECTION',

    NAME_ACTION: 'ACTION_COLUMN',
    TYPE_ACTION: 'ACTION', 

	fetchMoreData: function( component ) {
        var action = component.get('v.currentAction');
        var dataProvider = component.get('v.dataProvider');
        var provideEvent = dataProvider[0].get("e.provide");
        var parameters = {type:'MoreDataFetch','action':action};
        var eventData = {"parameters" : parameters};
        provideEvent.setParams(eventData);
        provideEvent.fire();
    },

    addColumn: function( rawName, name, label, type, isSortable, sortOrder, linkFunction, linkResolver, selectionAttributes, actionAttributes, lookupIdProperty ) {
        var col = {
            rawName: rawName,
            name: name, 
            label: label, 
            type: type, 
            isSortable: isSortable,
            sortOrder: sortOrder,
            linkFunction: linkFunction,
            linkResolver: linkResolver,
            selectionAttributes: selectionAttributes, // { type: SINGLE or MULTI, callback: function } 
            actionAttributes: actionAttributes, // { defaultActions: [<'EDIT'>, <'DELETE'>], customActionComponentName: String }
            lookupIdProperty: lookupIdProperty // Populated in case of lookup column. itemData[col.lookupIdProperty] contains the Id of the referenced record
        };
        return col;
    },

    selectionTypes: [
        'SINGLE', 
        'MULTI' 
    ],

    _getRenderedComponent: function( parentComponent, auraId ) {
        var componentFound = parentComponent.find( auraId );
        var renderedComponent = null;
        if( Array.isArray( componentFound ) )
        {
            for( var i = 0; i < componentFound.length; i++ )
            {
                if(componentFound[i].isRendered())
                {
                    renderedComponent = componentFound[i];
                    break;
                }
            }
        }
        else if( !$A.util.isUndefinedOrNull( componentFound ) )
        {
            if(componentFound.isRendered())
            {
                renderedComponent = componentFound;
            }
        }
        return renderedComponent;
    },

    _setSelectAllState: function( component, checkedState ) {
        var selectAll = this._getRenderedComponent( component, 'ast-select-all' );
        if( !$A.util.isUndefinedOrNull( selectAll ) )
        {
            selectAll.set('v.checked', checkedState);
        }
    },

    setNoItemsMessage: function( component, message ) {
        if( !$A.util.isEmpty(message) )
        {
            $A.createComponent('ui:outputText', 
                                { value: message, 
                                  class: "hc-noItemsMessage ast-noItemsMessage slds-align--absolute-center" }, 
                                function(textCmp, status, errorMessage) {
                                    component.set('v._noItemsMessage', textCmp);
                                }
            );
        }
        else
        {
            component.set('v._noItemsMessage', null);
        }
    },

    resetTable: function( component ) {
        component.set("v.headerColumns",[]);
        component.set("v.rows",[]);       
    },

    setFilteredTable: function( component, event ) {
        var eventData = event.getParam('data');
        var items = eventData.list;
        var noDataMessage = eventData.noDataMessage;
        var selectionType = component.get('v.selectionType');
        var selectAllState = true;

        component.set('v.items', items);
        
        var rows = component.get('v.rows');
        var matchingRowsFound = false;
        for( var i = 0; i < items.length; i++ )
        {
            // Unhide rows whenever an item matches filter or when there is no filter
            if( items[i]._matchesFilter || !items[i].hasOwnProperty('_matchesFilter') )
            {
                $A.util.removeClass( rows[i], 'slds-hide' );
                matchingRowsFound = true;
                if( selectionType == 'MULTI' && selectAllState == true )
                {
                    let selectionCell = this.getCellComponentsByColumnName( component, this.NAME_SELECTION, [rows[i]] )[0];
                    let isRowSelected = selectionCell.get("v.body")[0].get('v.checked');

                    // Uncheck select all checkbox even if one of the filtered results is unselected
                    if( !isRowSelected )
                    {
                        selectAllState = false;
                    }
                }
            }
            else
            {
                $A.util.addClass( rows[i], 'slds-hide' );   
            }     
        } 

        this._setSelectAllState( component, matchingRowsFound == true && selectAllState );
        this.setNoItemsMessage( component, matchingRowsFound == false ? noDataMessage : null );
    },

    setTable: function( component, event ) {
        this.resetTable(component);
        var eventData = event.getParam('data');
        var metaData = eventData.metaData;
        var list = eventData.list;
        var hasMoreData = eventData.hasMoreData;
        var actionName = eventData.actionName;
        var noDataMessage = eventData.noDataMessage;
        
        var columns = [];

        var selectionType = component.get('v.selectionType');
        if( !$A.util.isEmpty( selectionType ) && this.selectionTypes.indexOf( selectionType.toUpperCase() ) > -1 && metaData.length > 0 )
        {
            columns.push( this.addColumn('',
                                         this.NAME_SELECTION,
                                         '',
                                         this.TYPE_SELECTION,
                                         false,
                                         '', 
                                         null, 
                                         null,
                                         { type: selectionType }, 
                                         {} 
                                        ));
        }

        var columnLinkFunctionMap = component.get('v.columnLinkFunctionMap');
        var columnLinkResolverFunctionMap = component.get('v.columnLinkResolverFunctionMap');

        for (var i = 0; i < metaData.length; i++) {
            var column = metaData[i];

            var linkFunction = columnLinkFunctionMap && 
                                typeof columnLinkFunctionMap[ metaData[i].name ] == 'function' && 
                                columnLinkFunctionMap[ metaData[i].name ];
            var linkResolver = columnLinkResolverFunctionMap &&
                                typeof columnLinkResolverFunctionMap[ metaData[i].name ] == 'function' &&
                                columnLinkResolverFunctionMap[ metaData[i].name ];

            columns.push(this.addColumn(column.rawName,
                                        column.name,
                                        column.label,
                                        column.type,
                                        $A.util.isUndefinedOrNull( column.isSortable ) ? true : column.isSortable,
                                        column.sortOrder,
                                        linkFunction,
                                        linkResolver,
                                        {},
                                        {},
                                        column.lookupIdProperty 
                        ));
        }

        var defaultActions = component.get('v.defaultActions');
        var customActionComponentName = component.get('v.customActionComponentName');        

        if( !$A.util.isEmpty( defaultActions ) || !$A.util.isEmpty( customActionComponentName ) )
        {
            columns.push( this.addColumn('',
                                         this.NAME_ACTION,
                                         '',
                                         this.TYPE_ACTION,
                                         false,
                                         '',
                                         null,
                                         null,
                                         {}, 
                                         { 
                                            defaultActions : defaultActions,
                                            customActionComponentName : customActionComponentName
                                         } 
                                        ));
        }
        
        this.progressMessage('Fetch',component.get('v.startT'));
        component.set('v.headerColumns',columns);
        this.progressMessage('Header Set',component.get('v.startT'));
        
        component.set('v.items',list);
        component.set('v.hasMoreData',hasMoreData);
        component.set('v.dataFetchState','FETCHED');
        this.progressMessage('Rows Created::',component.get('v.startT'));
        component.set("v.showSpinner",false);
        component.set('v.currentAction',actionName);

        this.setNoItemsMessage( component, $A.util.isEmpty(list) ? noDataMessage || component.get('v.noItemsText') : null );

        if( !$A.util.isEmpty(list) )
        {
            this.renderRows(component,list,false);  
        }     
    },

    updateTable: function( component , event ) {
        this._setSelectAllState( component, false );
        var eventData = event.getParam('data');
        var list = eventData.list;
        var hasMoreData = eventData.hasMoreData;
        var matchingResultsCount = eventData.matchingResultsCount;
        var newList = component.get('v.items');
        newList = newList.concat(list);
        component.set('v.items',newList);
        component.set('v.hasMoreData',hasMoreData);
        component.set('v.dataFetchState','FETCHED');
        if( !$A.util.isEmpty(newList) && !$A.util.isEmpty(matchingResultsCount) && matchingResultsCount > 0 )
        {
            this.setNoItemsMessage( component, null );
        }
        this.renderRows(component,list,true);                
    },   

    setTableWithErrors: function( component, event ) {
        var eventData = event.getParam('data');
        var noDataMessage = eventData.noDataMessage;
        var currentItems = component.get('v.items');
        component.set('v.dataFetchState','ERROR');
        
        this.setNoItemsMessage( component, $A.util.isEmpty(currentItems) ? noDataMessage || component.get('v.noItemsText') : null );
    },

    renderRows: function( component, items, isAppendMode ) {
        var rowsToCreate = [];

        var userDateFormat = component.get('v.userDateFormat');
        var userDateTimeFormat = component.get('v.userDateTimeFormat');
        var headerColumns = component.get('v.headerColumns');
        var idField = component.get('v.uniqueRecordIdField');

        var uniqueRowId; 
        var userRowClass = component.get('v.rowClass');
        var cellClass = component.get('v.cellClass');
        var tableId = component.get('v.id');
        for( var i = 0; i < items.length; i++ )
        {
            uniqueRowId = this.getRowId( component, items[i] );
            var rowClass = userRowClass + (items[i]._matchesFilter == false ? ' slds-hide' : '' );

            if( !$A.util.isUndefinedOrNull( uniqueRowId ) )
            {
                rowsToCreate.push(["HealthCloudGA:HcSimpleTableRow", {
                                'aura:id' : uniqueRowId,
                                'id' : uniqueRowId,
                    			'class' : rowClass,
                                'cellClass' : cellClass,
    							'tableId' : tableId,
                                'item' : items[i],
                                'userDateFormat' : userDateFormat,
                                'userDateTimeFormat' : userDateTimeFormat,
                                'headerColumns' : headerColumns
                            }]);
            }
        }
        
        this.progressMessage('Component Creation Done:',component.get('v.startT'));
        $A.createComponents(rowsToCreate, function(newRows, status, statusMessages) {
            if( status == "SUCCESS" )
            {
                if(isAppendMode) {
                    var existingRows = component.get('v.rows');
                    newRows = existingRows.concat(newRows);
                }
                component.set('v.rows', newRows);
            }
            else
            {
                var tableErrorEvent = component.getEvent("tableErrorEvent");
                tableErrorEvent.setParams({
                    eventType: 'ERROR',
                    eventSubType: $A.get("$Label.HealthCloudGA.Items_Display_Error"),
                    data: statusMessages
                });
                tableErrorEvent.fire();
            }
        });
    },

    sortBy: function( component, columnNameSelected ) {
        if(columnNameSelected === 'Action') {
            component.set("v.showSpinner",false);
            return;
        }
        var action = component.get('v.currentAction');
        var dataProvider = component.get('v.dataProvider');
        var provideEvent = dataProvider[0].get("e.provide");
        var parameters = { type:'Sort', col:columnNameSelected, 'action':action };
        var eventData = {"parameters" : parameters};
        provideEvent.setParams(eventData);
        provideEvent.fire();
        this.resetSelectedItems( component );
    },

    getRowId: function( component, itemData ) {
        var uniqueRecordIdField = component.get('v.uniqueRecordIdField');
        var tableId = component.get('v.id');
        var rowId = null;
        if( itemData.hasOwnProperty( uniqueRecordIdField ) )
        {
            rowId = tableId + '_row_' + itemData[uniqueRecordIdField];    
        }
        else
        {
            console.error({ error: "Unique Record Id field '" + uniqueRecordIdField + "' does not exist in item data.",
                            itemData: itemData 
                         });
        }
        return rowId;
    },

    getCellId: function( component, itemData, columnName ) {
        var cellId = null;
        var rowId = this.getRowId(component, itemData);
        if( !$A.util.isUndefinedOrNull(rowId) )
        {
            cellId = rowId + '_cell_' + columnName;
        }
        return cellId;      
    },

    getCellComponentsByColumnNameForItems: function( component, columnName, items ) {
        var cellComponents = [];

        var cellIdComponentMap = {};
        for( var i = 0 ; i < items.length ; i++ )
        {
            if( !$A.util.isUndefinedOrNull(items[i]) && ( items[i].hasOwnProperty( columnName ) || 
                                                            columnName == this.NAME_SELECTION || 
                                                            columnName == this.NAME_ACTION ) )
            {    
                var cellId = this.getCellId( component, items[i], columnName );
                if( !$A.util.isUndefinedOrNull(cellId) )
                {
                    cellIdComponentMap[ cellId ] = 1;
                }
            }
        }

        var matchingCells = this.getCellComponentsByColumnName( component, columnName );

        for( var i = 0 ; i < matchingCells.length ; i++ ) 
        {
            let cellId = matchingCells[i].get('v.id');
            // Check if this is a cell we need
            if( cellIdComponentMap.hasOwnProperty( cellId ) )            
            {
                cellComponents.push( matchingCells[i] );
                delete cellIdComponentMap[ cellId ];
            }
            if( $A.util.isEmpty(cellIdComponentMap) )
            {
                break;
            }
        }

        return cellComponents;
    },

    getCellComponentsByColumnName: function( component, columnName, rowComponents ) {
        var cellComponents = [];

        var rows = $A.util.isUndefinedOrNull(rowComponents) ? component.get('v.rows') : rowComponents;
        var columnIndex = null;
        for( var i = 0 ; i < rows.length ; i++ ) 
        {
            var cells = rows[i].get('v.cells');
            if( columnIndex == null )
            {
                for( var j = 0 ; j < cells.length ; j++ ) {
                    let cellMetadata = cells[j].get('v.cellMetadata');
                    if( cellMetadata.name == columnName )
                    {
                        // Find the index of the matching cell with a given column name 
                        // This index remains the same across rows
                        columnIndex = j;
                        cellComponents.push( cells[columnIndex] );
                        break;
                    }   
                }
            }
            else
            {
                cellComponents.push( cells[columnIndex] );
            }
        }

        return cellComponents;        
    },

    getValidatedSelectionType: function( component ) {
        var selectionType = component.get('v.selectionType');
        if( $A.util.isUndefinedOrNull(selectionType) )
        {
            console.warn('WARNING: v.selectionType not set for table component with id : ' + component.get('v.id') );
            selectionType = null;
        }
        else if( this.selectionTypes.indexOf(selectionType) == -1 )
        {
            console.warn('WARNING: Invalid v.selectionType set for table component with id : ' + component.get('v.id') );
            selectionType = null;   
        }
        return selectionType;    
    },

    getSelectedItems: function( component ) {
        var selectedItems = [];
        if( !$A.util.isUndefinedOrNull(this.getValidatedSelectionType( component )) ) 
        {
            var _selectedItemsMap = component.get( 'v._selectedItemsMap' );
            
            for( let id in _selectedItemsMap )
            {
                if( _selectedItemsMap.hasOwnProperty( id ) )
                {
                    selectedItems.push( _selectedItemsMap[ id ] );
                }
            }
        }
        component.set('v.selectedItems', selectedItems); // Update latest selections
        return selectedItems;
    },

    updateSelectedItems: function( item, selectType, component ) {
        if( !$A.util.isUndefinedOrNull(this.getValidatedSelectionType( component )) )  
        {
            var _selectedItemsMap = component.get( 'v._selectedItemsMap' );
            var idField = component.get('v.uniqueRecordIdField');

            if( selectType == 'SINGLE' )
            {
                _selectedItemsMap = {};
                _selectedItemsMap[ item[idField] ] = item;
            }
            else if( selectType == 'MULTI_SELECT' )
            {
                _selectedItemsMap[ item[idField] ] = item;
            }
            else if( selectType == 'MULTI_DESELECT' )
            {
                this._setSelectAllState( component, false );
                delete _selectedItemsMap[ item[idField] ];
            }

            component.set( 'v._selectedItemsMap', _selectedItemsMap );
            component.set( 'v.selectedItems', [] ); // Reset stale selections
        }
    },

    resetSelectedItems: function( component )
    {
        component.set( 'v._selectedItemsMap', {} );
        component.set( 'v.selectedItems', [] );
    },
    
    setSelection: function( component, selectionCells, selectionState )
    {
        var selectionType = this.getValidatedSelectionType( component );
        if( !$A.util.isUndefinedOrNull(selectionType) )  
        {
            if( selectionType == 'SINGLE' )
            {
                this.resetSelectedItems( component );
            }
            for( var i = 0; i < selectionCells.length; i++ )
            {
                let cell = selectionCells[i];
                if(!$A.util.isUndefinedOrNull(cell) && cell.get('v.isSelectionCell')){
                    let selectionComponent = cell.get("v.body")[0];

                    selectionComponent.set("v.checked", selectionState);

                    if( selectionType == 'MULTI' )
                    {
                        this.updateSelectedItems( selectionCells[i].get('v.itemData'), selectionState ? 'MULTI_SELECT' : 'MULTI_DESELECT', component );   
                    }

                    // For single selection the first selection cell passed is selected
                    // and the rest are deselected.
                    if( selectionType == 'SINGLE' && selectionState )
                    {
                        this.updateSelectedItems( selectionCells[i].get('v.itemData'), 'SINGLE', component );
                        selectionState = false;       
                    }
                }
            }
        }
    },

    setSelectionForItems: function( component, items, selectionState ) {
        if( !$A.util.isUndefinedOrNull(this.getValidatedSelectionType( component )) )  
        {
            if( !$A.util.isArray(items) )
            {
                items = [ items ];
            }

            var selectionCells = this.getCellComponentsByColumnNameForItems( component, this.NAME_SELECTION, items );

            this.setSelection( component, selectionCells, selectionState );
        }
    },

    toggleSelectionForAllItems: function( component, selectionState ) {
        var selectionType = this.getValidatedSelectionType( component );
        if( !$A.util.isUndefinedOrNull(selectionType) && selectionType == 'MULTI' )  
        {
            var selectionCells = [];
            var items = component.get('v.items');
            var rows = component.get('v.rows');
            for( var i = 0; i < items.length; i++ )
            {
                // Select all rows which matches filter or when there is no filter
                if( items[i]._matchesFilter || !items[i].hasOwnProperty('_matchesFilter') )
                {
                    let selectionCell = this.getCellComponentsByColumnName( component, this.NAME_SELECTION, [rows[i]] )[0];
                    selectionCells.push( selectionCell );
                }
            }
            this.setSelection( component, selectionCells, selectionState );
        }
    }
})