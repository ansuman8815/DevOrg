/**
 * Copyright © 2016 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * Helper for baseOutApp
 * @since 200
 */
({
    // Required to keep security errors due to chatter:feed Visualforce component
    // 		from being injected onto the page by Aura; used in Lightning Apps that
    //		are embedded in Visualforce pages via Lightning Out, which also contain
    //		the chatter:feed Visualforce component, and are displayed in Service Console.
    //		RE: W-2918250
    suppressAuraBrowserSecurityError: function(event) {

        // Browser-specific security error message fragments thrown by chatter:feed Visualforce component's
        // 		misbehaving "Give Thanks" and "Upload a File from Salesforce" functionality in Service Console
        var errChrome = "Uncaught SecurityError",
            errFFThanks = "Error: Permission denied",
            errFFSafaFile = "TypeError:",
            errEdgeIE = "Access is denied";

        var errList = [errChrome, errFFThanks, errFFSafaFile, errEdgeIE];
        var message = event.getParam("message");

        // Suppress the "expected" specific x-frame-options/cross domain access violation
        var tempMsg;
        for (var idx = 0; idx < errList.length; idx++) {
            tempMsg = errList[idx];

            if (message.indexOf(tempMsg) >= 0) {
                event["handled"] = true;
                console.log('Suppressing error: ' + message);
                return;
            }
        }
    }
})