({
    resetPagination: function(cmp, evt, hlp) {
        hlp.initAllVars(cmp);
    },

    provider: function(cmp, evt, hlp) {
        var parameters = evt.getParam('parameters');
        var action = parameters.action;
        var actionTypeFunctionMap = {
            DataFetch : function() {
                hlp.initPageVars(cmp);
                hlp.getData(action,cmp,evt,hlp);
            },
            MoreDataFetch : function() {
                hlp.getData(action,cmp,evt,hlp);
            },
            Sort : function() {
                var col = parameters.col;
                hlp.sortData(action,cmp,col);    
            }
        };

        if( actionTypeFunctionMap.hasOwnProperty(parameters.type) ) 
        {
            actionTypeFunctionMap[parameters.type]();
        }
    },

    onSearchTermChanged: function(component, event, helper) {
        if( component.get('v.allowSearch') )
        {
            helper.filterDataAndRaiseEvent( component );     
        }   
    }
})