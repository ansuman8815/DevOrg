({
    abstractInit: function(component, event, helper) {
        var autoInit = component.get('v.autoInit');
        helper.initAllVars(component);
        if(!$A.util.isEmpty(autoInit) && autoInit) {
            helper.getData(null,component,event,helper);
        }
    },

    initAllVars: function(component) {
        component.set('v.searchTerm', '');
        this.initPageVars(component);
    },

    initPageVars: function(component) {
        component.set('v.currentPage', -1);
        component.set('v.lastEndIndex', 0);
        component.set('v.hasMoreData', false);
    },

    cacheDataOnFetch: function( component, metaData, fetchType, items, currentAction, noDataMessage, totalRows ) {
        var localItems;
        if( fetchType == 'DataFetch' )
        {
            localItems = [];
            component.set('v.metaData', metaData);
        }
        else if( fetchType == 'MoreDataFetch' )
        {
            localItems = component.get('v.items');
        }
        localItems.push.apply(localItems, items);
        component.set('v.items', localItems);
        component.set('v.currentAction', currentAction);
    },

    filterData: function( component, items ) {
        component.set('v.matchingResultsCount', null);
        var searchTerm = component.get('v.searchTerm');
        if( (typeof searchTerm) !== 'string' || searchTerm.trim() === '') 
        {
            // Remove _matchesFilter property only when search term is reset 
            // and not on initial load
            if( items.length > 0 && items[0].hasOwnProperty('_matchesFilter') )
            {
                for( var i = 0; i < items.length; i++ )
                {   
                    delete items[i]._matchesFilter;
                }
            }
            return items;
        }
        searchTerm = searchTerm.trim().toLowerCase();
        
        var metaData = component.get('v.metaData');
        var filteredItems = [];
        var matchingResultsCount = 0;
        for( var i = 0; i < items.length; i++ )
        {
            items[i]._matchesFilter = false;
            // Filter only through data from visible columns
            for( var j = 0; j < metaData.length; j++ )
            {
                var columnName = metaData[j]['name'];
                if(!items[i].hasOwnProperty(columnName) || (typeof items[i][columnName]) !== 'string') continue;
                if(items[i][columnName].toLowerCase().indexOf(searchTerm) > -1) {
                    items[i]._matchesFilter = true;
                    matchingResultsCount++;
                    break;
                }
            }
            filteredItems.push(items[i]);    
        }
        component.set('v.matchingResultsCount', matchingResultsCount);
        return filteredItems;
    },

    filterDataAndRaiseEvent: function( component ) {
        var items = this.filterData( component, component.get('v.items') );
        this.raiseDataFetchedEvent( component, 
                                    'DataFilter', 
                                    component.get('v.metaData'),
                                    items,
                                    component.get('v.hasMoreData'),
                                    component.get('v.currentAction'),
                                    $A.get("$Label.HealthCloudGA.Text_Search_No_Matches"),
                                    component.get('v.totalItems'),
                                    true
                                  );
    },

    raiseDataFetchedEvent: function(component, type, metaData, dataList, hasMoreData, currentAction, noDataMessage, totalRows, dataFiltered) {
        var items = dataList;
        if( $A.util.isUndefinedOrNull(dataFiltered) || dataFiltered == false )
        {
            this.cacheDataOnFetch( component, metaData, type, dataList, currentAction, noDataMessage, totalRows );
            items = this.filterData( component, dataList );
        }
        var compEvent = component.getEvent("onchange");
        var eventData = { type: type, 
                          metaData: metaData, 
                          list: items,
                          hasMoreData: hasMoreData,
                          actionName: currentAction,
                          noDataMessage: noDataMessage,
                          totalRows: totalRows,
                          matchingResultsCount: component.get('v.matchingResultsCount') };
        compEvent.setParams({ data:eventData });
        compEvent.fire();
    },
    
    raiseDataErrorEvent: function(component, errorResponse, noDataMessage) {
        var compEvent = component.getEvent("onchange");
        
        var eventData = { type: 'DataError', 
                          metaData: component.get('v.metaData'), 
                          list: [],
                          hasMoreData: component.get('v.hasMoreData'),
                          actionName: component.get('v.currentAction'),
                          noDataMessage: noDataMessage,
                          totalRows: component.get('v.totalItems') };
        compEvent.setParams({ data:eventData });
        compEvent.fire();
        
        // add exception handling
        var errorMsg = this.getErrorMessage(errorResponse);
        var errorEvent = component.getEvent("error");
        errorEvent.setParams({error:errorMsg});
        errorEvent.fire();
    },
    
    sortData: function(actionName, cmp, columnNameSelected) {
        this.initPageVars(cmp);
        var metaData = cmp.get('v.metaData');
        var sortOrder = '';
        var columnMeta = [];
        for (var i = 0; i < metaData.length; i++) {
            var column = metaData[i];
            if (columnNameSelected === column.rawName) {
                if (column.sortOrder == '') {
                    column.sortOrder = 'A';
                } else if (column.sortOrder == 'D') {
                    column.sortOrder = 'A';
                } else {
                    column.sortOrder = 'D';
                }
                columnMeta = column;
                break;
            }
        }
        var sortClientSide = cmp.get('v.sortClientSide');
        if (sortClientSide){
            this.sortDataAndRaiseEvent( cmp, cmp.get('v.items'), columnMeta );
        }
        else {
            this.getData(actionName, cmp, null, this, columnMeta);
        }
    },

    getErrorMessage: function(response) {
        var err = response.getError();
        var errors = [];
        for (var i = 0; i < err.length; i++) {
            errors.push(err[i].message);
        }
        var msg = errors.join(' ');
        if ($A.util.isEmpty(msg)) {
            msg = $A.get("$Label.HealthCloudGA.Msg_Error_General");
        }

        return msg;
    },

    // DEBUG
    progressMessage: function(Message, startT) {
        var isDebug = false;
        if(isDebug) {
            var current = new Date().getTime();
            var start = startT;
            if($A.util.isEmpty(start)) {
                var timing = performance.timing;
                start = timing.navigationStart;
            }
            console.log('Rendered: ' + Message + '#' + (current - start)+',startT:'+startT);
        }        
    },

    isValidDate: function(str) {
          var d = moment(str);
          if(d == null || !d.isValid()) return false;

          return true;
    },

    getPageParams : function(component,columnMeta) {
        var sortColumnName = '';
        var sortColumnOrder = '';
        var pageSize = component.get('v.pageSize'); // TODO: Siva: Check what happens when pageSize is not set.
        var offSet =  component.get('v.lastEndIndex');

        var rowsToFetch = pageSize;
        if(!$A.util.isEmpty(columnMeta)) {
            sortColumnName = columnMeta.rawName;
            sortColumnOrder = columnMeta.sortOrder;
        }else {
            var metaData = component.get('v.metaData');
            if(!$A.util.isEmpty(metaData)) {
                for (var i = 0; i < metaData.length; i++) {
                    var column = metaData[i];
                    if (!$A.util.isEmpty(column.sortOrder)) {
                        sortColumnName = column.rawName;
                        sortColumnOrder = column.sortOrder;
                    }
                }
            }
        }

        var pageParams = {
            "soffSet" : offSet.toString(),
            "srowLimit" : rowsToFetch.toString(),
            "orderByField" : sortColumnName,
            "orderByDir" : sortColumnOrder
        };

        return pageParams;
    },

    getAction : function(actionName,actionMap,actionParamsMap,component,columnMeta) {
        var action = '';
        var actionParams = {};

        if( actionMap.hasOwnProperty(actionName) )
        {
            action = component.get(actionMap[actionName]);
        }

        if(!$A.util.isEmpty(action)) {
            if( actionParamsMap.hasOwnProperty(actionName) ) {
                actionParams = actionParamsMap[actionName];
            }else {
                actionParams = actionParamsMap['DEFAULT'] || {};
            }

            var pageParams = this.getPageParams(component,columnMeta);
            if(!$A.util.isEmpty(actionParams)) { // TODO: Siva: Use case when there is no action parameters but there is need for pageSize
                for (var attrname in pageParams) { actionParams[attrname] = pageParams[attrname]; }
            }
            action.setParams(actionParams);            
        }

        return action;     
    },    

    processResponsePageControl : function(component,columnMeta,result) {
        var _resultList = result.recordsData;
        var colMetadata = result.columnsMeta;
        var pageControl = result.pageControl;

        var offSet =  component.get('v.lastEndIndex');
        var currentPage =  component.get('v.currentPage');
        var sortClientSide = component.get('v.sortClientSide');

        var eventType = 'DataFetch';

        //Setup sort headers only if its the first Page
        if(pageControl.requestedOffset < 1) {
            component.set('v.currentPage', 1);   
            component.set('v.lastEndIndex', _resultList.length);
            var sortColumnName = '';
            var sortColumnOrder = '';

            if(!$A.util.isEmpty(columnMeta) && !sortClientSide) {
                sortColumnName = columnMeta.rawName;
                sortColumnOrder = columnMeta.sortOrder;
            }

            for (var i = 0; i < colMetadata.length; i++) {
                if (colMetadata[i].rawName == sortColumnName) {
                    colMetadata[i].sortOrder = sortColumnOrder;
                } else {
                    colMetadata[i].sortOrder = '';
                }
            }
            component.set('v.totalItems', pageControl.totalRows);
        }else {
            eventType = 'MoreDataFetch';
            component.set('v.currentPage', currentPage+1);                
            component.set('v.lastEndIndex', offSet + _resultList.length);
        }

        var hasMoreData = pageControl.moreFetchAllowed;
        component.set('v.hasMoreData', hasMoreData);

        var processResult = {
            hasMoreData : hasMoreData,
            eventType : eventType,
            colMetadata: colMetadata
        };

        return processResult;
    },

    sortDataAndRaiseEvent: function(component, items, columnMeta){
        items.sort(function(a, b) {
            var aVal = a[columnMeta.name],
                bVal = b[columnMeta.name],
                ret = 0;

            if (typeof aVal !== 'number') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
                ret = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
            } else {
                ret = parseInt(aVal,10) - parseInt(bVal,10);
            }

            if (columnMeta.sortOrder.toUpperCase()!='A') {
                ret = -ret;
            }

            return ret;
        });

        this.raiseDataFetchedEvent( component,
            'DataFetch',
            component.get('v.metaData'),
            items,
            component.get('v.hasMoreData'),
            component.get('v.currentAction'),
            '',
            component.get('v.totalItems'),
            false
        );
    }
})