/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description JS Helper for Healthcare base component; extended by other Healthcare Lightning components;
 *      this verson imports the updated SLDS styles;
 * @since 198
 */
({
    /*
     * Hide buttons in a modal footer and show spinner w/ text
     */
    pleaseWait: function(component, show_flag, spinner_text) {
        var buttons = component.getElement().querySelectorAll('.slds-button');
        var spinner = component.getElement().querySelector('.spinner-block');
        var hidden_class = "slds-hide";

        // set spinner text
        if (spinner_text) {
            component.set('v.spinnerMsg', spinner_text);
        }

        // set iteration value – in case there are no buttons
        var numButtons = buttons ? buttons.length : 0;

        if (show_flag) {
            // hide buttons
            // loop through buttons and add .invisible to each
            for (var i = 0; i < numButtons; i++) {
                $A.util.addClass(buttons[i], hidden_class);
            }

            // show please wait feedback
            // remove .invisible from spinner block
            $A.util.removeClass(spinner, hidden_class);
        } else {
            // show buttons
            // loop through buttons and remove .invisible from each
            for (var i = 0; i < numButtons; i++) {
                $A.util.removeClass(buttons[i], hidden_class);
            }

            // hide please wait feedback
            // add .invisible from spinner block
            $A.util.addClass(spinner, hidden_class);
        }
    },

    /*
     * Sanitize the url, checking if the url has 'https' protocol.
     */
    sanitize: function(url) {
        var tmp = document.createElement("a");
        tmp.href = url;
        if (tmp.protocol === "https:") {
            return url;
        } else {
            return "";
        }
    },

    /*
     * overloaded Sanitize function - checking if the url has 'https' or http protocol.Used only in HelpTray to allow http url.
     */
    sanitizeUrl: function(url,fromWhere) {
        if(fromWhere === "")
        return "";
        var tmp = document.createElement("a");
        tmp.href = url;
        if (tmp.protocol === "https:") {
          return url;
        }
        else if (tmp.protocol === "http:" && fromWhere === 'HcHelpTrayDropDown') {
          return url;
        } else {
          return "";
        }
    },

    /*
     * Read record id from url
     */
    parseUrlRecordId: function(parameter) {
        var recordId;
        if (window.location != null) {
            recordId = window.location.href.split('recId=')[1];
        }
        return recordId;
    },

    /*
     * Simplified remote process call, params is optional
     * rpc:Object, params:Object, action:Function
     * rpc:Object, params:Function
     */
    rpcCall: function(rpc, params, action) {
        if (params !== undefined && params != null)
            rpc.setParams(params);
        rpc.setCallback(this, action);
        $A.enqueueAction(rpc);
    },

    /*
     * Util function return sorting method comparing and sorting object by value in default order
     */
    sortByValue: function(param) {
        return function(a, b) {
            return a[param] < b[param] ? -1 : a[param] > b[param] ? 1 : 0;
        };
    },

    /*
     * Util function converting string Boolean value into Boolean type
     */
    stringToBool: function(str) {
        if (str === undefined || str === null)
            throw new Error("Invalid params: Cannot convert undefined or null string to boolean!!!!!");
        return str.toLowerCase() === 'true';
    },

    // svg support for IE and Edge
    svg4everybody: function(component, event, helper) {

        ! function(root, factory) {
            "function" == typeof define && define.amd ? define([], function() {
                return root.svg4everybody = factory();
            }) : "object" == typeof exports ? module.exports = factory() : root.svg4everybody = factory();
        }(this, function() {
            /*! svg4everybody v2.0.0 | github.com/jonathantneal/svg4everybody */
            function embed(svg, g) {
                if (g) {
                    var viewBox = !svg.getAttribute("viewBox") && g.getAttribute("viewBox"),
                        fragment = document.createDocumentFragment(),
                        clone = g.cloneNode(!0);
                    for (viewBox && svg.setAttribute("viewBox", viewBox); clone.childNodes.length;) {
                        fragment.appendChild(clone.firstChild);
                    }
                    svg.appendChild(fragment);
                }
            }

            function loadreadystatechange(xhr) {
                xhr.onreadystatechange = function() {
                    if (4 === xhr.readyState) {
                        // my code changes
                        var x = document.createElement("x");
                        var parser = new DOMParser();
                        var payload;
                        payload = xhr.responseText;
                        var doc = parser.parseFromString(payload, "image/svg+xml"),
                            child = doc.firstChild;
                        x.appendChild(child);
                        xhr.s.splice(0).map(function(array) {
                            embed(array[0], x.querySelector("#" + array[1].replace(/(\W)/g, "\\$1")))
                        });


                    }
                }, xhr.onreadystatechange();
            }

            function svg4everybody(opts) {
                function oninterval() {
                    for (var use, svg, i = 0; i < uses.length;) {
                        if (use = uses[i], svg = use.parentNode, svg && /svg/i.test(svg.nodeName)) {
                            var src = use.getAttribute("href");
                            if (polyfill && (!validate || validate(src, svg, use))) {
                                var url = src.split("#"),
                                    url_root = url[0],
                                    url_hash = url[1];
                                if (svg.removeChild(use), url_root.length) {
                                    var xhr = svgCache[url_root] = svgCache[url_root] || new XMLHttpRequest();
                                    xhr.s || (xhr.s = [], xhr.open("GET", url_root), xhr.send()), xhr.s.push([svg, url_hash]),
                                        loadreadystatechange(xhr);
                                } else {
                                    embed(svg, document.getElementById(url_hash));
                                }
                            }
                        } else {
                            i += 1;
                        }
                    }
                    requestAnimationFrame(oninterval, 17);
                }
                opts = opts || {};
                var uses = document.getElementsByTagName("use"),
                    polyfill = "polyfill" in opts ? opts.polyfill : /\bEdge\/12\b|\bTrident\/[567]\b|\bVersion\/7.0 Safari\b/.test(navigator.userAgent) || (navigator.userAgent.match(/AppleWebKit\/(\d+)/) || [])[1] < 537,
                    validate = opts.validate,
                    requestAnimationFrame = window.requestAnimationFrame || setTimeout,
                    svgCache = {};
                polyfill && oninterval();
            }
            return svg4everybody;
        });
    },

    // utility method to return a user's locale string
    // retrieve user's locale info and create is as a standard locale string (i.e.: en_US, fr_FR, de_DE)
    getUserLocaleString: function() {
        return $A.get("$Locale.userLocaleLang") + "_" + $A.get("$Locale.userLocaleCountry");
    },

    // returns a date string in the user's locale selection in Salesforce Setup
    getUserLocalizedDate: function(date, dateFormat) {
        var date = date || new Date();
        var dateFormat = dateFormat || 'LL'; // default to long local format

        // retrieve user's locale info and create is as a standard locale string (i.e.: en_US, fr_FR, de_DE)
        var userLocale = this.getUserLocaleString();

        // return the localized date
        return $A.localizationService.formatDate(date, dateFormat, userLocale);
    },

    // returns a date-time string in the user's locale selection in Salesforce Setup
    getUserLocalizedDateTime: function(dateTime, dateTimeFormat) {
        var dateTime = dateTime || new Date();
        var dateTimeFormat = dateTimeFormat || 'LLL'; // default to long local format

        // retrieve user's locale info and create is as a standard locale string (i.e.: en_US, fr_FR, de_DE)
        var userLocale = this.getUserLocaleString();

        // return the localized date
        return $A.localizationService.formatDateTime(dateTime, dateTimeFormat, userLocale);
    },

    /*
     * Simplified remote process call, params is optional
     * rpc:Object, params:Object, action:Function
     * rpc:Object, params:Function
     */
    rpcCall: function(rpc, params, action) {
        if (params !== undefined && params != null)
            rpc.setParams(params);
        rpc.setCallback(this, action);
        $A.enqueueAction(rpc);
    },

    /*
     * Sanitize the url, checking if the url has 'https' protocol.
     */
    sanitize: function(url) {
        var tmp = document.createElement("a");
        tmp.href = url;
        if (tmp.protocol === "https:") {
            return url;
        } else {
            return "";
        }
    },

    /*
     * Read record id from url
     */
    parseUrlRecordId: function(parameter) {
        var recordId;
        if (window.location != null) {
            recordId = window.location.href.split('recId=')[1];
        }
        return recordId;
    },

    /*
     * Util function return sorting method comparing and sorting object by value in default order
     */
    sortByValue: function(param) {
        return function(a, b) {
            return a[param] < b[param] ? -1 : a[param] > b[param] ? 1 : 0;
        };
    },
})