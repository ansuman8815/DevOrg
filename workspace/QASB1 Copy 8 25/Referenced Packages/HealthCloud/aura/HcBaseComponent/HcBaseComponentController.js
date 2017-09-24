({
    doInit: function(component, event, helper) {
        // Initialize HC Util API if not already available
        if( $A.util.isUndefinedOrNull(window.HC) ) {
            helper.initHCUtil();
            HC.setNamespace(component);
        }
        
        if($A.util.isEmpty(component.get('v.startT'))) {
        	component.set('v.startT',new Date().getTime());	
        }
        helper.ieShims();
    },

    handleLEXTabFocusChange: function(component, event, helper) {
        /* LEX Console specific : Route tab focus events to helper functions implemented in inheriting components */
        var currentTabId = event.getParam('currentTabId');
        var previousTabId = event.getParam('previousTabId');
        var focusInHandler = function() {
            typeof helper.handleConsoleTabFocusIn === 'function' && helper.handleConsoleTabFocusIn( component.getConcreteComponent() );
        };
        var focusOutHandler = function() {
            typeof helper.handleConsoleTabFocusOut === 'function' && helper.handleConsoleTabFocusOut( component.getConcreteComponent() );
        };
        HC.handleTabFocus( currentTabId, previousTabId, focusInHandler, focusOutHandler );        
    },

    // this is currently only used for handling the create record event in console
    handleDelegatedAction: function (component, event, helper) {
        var data = event.getParam('data');
        var callback = event.getParam('callback');
        // stop this event from being handled multiple times
        event.preventDefault();
        event.stopPropagation();
        helper.getURLAndOpenCreateRecordSubTab(component, data, callback);
    }
})