/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description JS Helper for Healthcare base component; extended by other Healthcare Lightning components;
 *    this component is deprecated.
 * @since 198
 */
({
    // DEBUG
    progressMessage: function(Message, startT,force) {
        var isDebug = false;
        var timing = performance.timing;

        if(isDebug) {
            var current = new Date().getTime();
            var start = startT;
            if($A.util.isEmpty(start)) {
                start = timing.navigationStart;
            }
            console.log('startT:'+startT+',navDiv:'+(current-(timing.navigationStart)));
            console.log('Rendered: ' + Message + '#' + (current - start));
        }
    },

    //
    // Hide buttons in a modal footer and show spinner w/ text
    //
    pleaseWait: function(component, show_flag, modalAuraId) {
        var buttons = component.find(modalAuraId).getElement().querySelector('.modalButtonWrap');
        var xbutton = component.find(modalAuraId).getElement().querySelector('.slds-modal__close');
        var spinner = component.find(modalAuraId).getElement().querySelector('.spinner-block');
        var hidden_class = "slds-hide";

        if (show_flag) {
            // hide buttons
            $A.util.addClass(buttons, hidden_class);
            $A.util.addClass(xbutton, hidden_class);
            // show please wait feedback
            // remove .invisible from spinner block
            $A.util.removeClass(spinner, hidden_class);

        } else {
            // show buttons
            // loop through buttons and remove .invisible from each
            $A.util.removeClass(buttons, hidden_class);
            $A.util.removeClass(xbutton, hidden_class);

            // hide please wait feedback
            // add .invisible from spinner block
            $A.util.addClass(spinner, hidden_class);

        }
    },

    /*
     * return the value of a data attribute from an event source element
     */
    getEventElementAttributeValue: function(event, attribute) {
      if (event.getSource) {
        target = event.getSource();
      } else {
        target = event.target;
      }

      return $A.util.getDataAttribute(target, attribute);
    },

    /*
     * return a localized label if fieldValue starts with 'label-', otherwise return fieldValue
     */
    getLocalizedLabel: function(fieldValue) {
        if (fieldValue.startsWith('label-')) {
            var labelSubStr = fieldValue.replace('label-', '');
            fieldValue = $A.getReference('$Label.HealthCloudGA.' + labelSubStr).valueOf();
            if (typeof fieldValue === 'string' || fieldValue instanceof String)
                return fieldValue;
            else return labelSubStr;
        }
        return fieldValue;
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
            return url;
        }
    },

    /*
     * overloaded Sanitize function - checking if the url has 'https' or http protocol.Used only in HelpTray to allow http url.
     */
    sanitizeUrl: function(url, fromWhere) {
        if (fromWhere === "")
            return "";
        var tmp = document.createElement("a");
        tmp.href = url;
        if (tmp.protocol === "https:") {
            return url;
        } else if (tmp.protocol === "http:" && fromWhere === 'HcHelpTrayDropDown') {
            return url;
        } else {
            return "";
        }
    },

    /*
     * Reads a query parameter value from the url (first match)
     */
    getUrlQueryParameter: function(name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    },

    /*
     * Simplified remote process call, params is optional
     * rpc:Object, params:Object, action:Function
     * rpc:Object, params:Function
     */
    rpcCall: function(rpc, params, action,isBackground) {
        if (params !== undefined && params != null)
            rpc.setParams(params);
        if(isBackground)
          rpc.setBackground();
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
    
    handleError: function(component, errors){
        var errorMessage = $A.get("$Label.HealthCloudGA.Msg_Error_General");
        var pslError = $A.get("$Label.HealthCloudGA.Msg_Component_Has_NoAccess");
        if (errors[0] && errors[0].message) {
            errorMessage = errors[0].message;
        }
        
        if(errorMessage === pslError){
            component.set("v.hasLicense", false);
        } else {
            component.find('toast-message').set('v.content', {
                'type': 'error',
                'message': errorMessage
            });
        }
    },

    handleError: function(component, errors){
        var errorMessage = $A.get("$Label.HealthCloudGA.Msg_Error_General");
        var pslError = $A.get("$Label.HealthCloudGA.Msg_Component_Has_NoAccess");
        if (errors[0] && errors[0].message) {
            errorMessage = errors[0].message;
        }

        if(errorMessage === pslError){
            component.set("v.hasLicense", false);
        } else {
            var toastCmp = component.find('toast-message');
            if(!$A.util.isUndefinedOrNull(toastCmp)){
              toastCmp.set('v.content', {
                  'type': 'error',
                  'message': errorMessage
              });
            }
        }
    },

    // IE shims for various methods
    ieShims: function() {
        // starts with shim
        if (!String.prototype.startsWith) {
            String.prototype.startsWith = function(str) {
                return this.lastIndexOf(str, 0) === 0;
            };
        }
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
                            var src = use.getAttribute("href") || use.getAttribute("xlink:href");
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
    populateGlobalSettings: function(component, event, helper) {
        if (component.get('v.globalSettings') == null) {
            helper.rpcCall(component.get("c.getGlobalSettings"), null, function(response) {
                if (response.getState() === "SUCCESS") {
                    component.set('v.globalSettings', response.getReturnValue());
                } else {
                    helper.handleError(component, response.getError());
                }
            });
        }
    },

    toggleSpinner: function(isVisible, component) {
        component.set("v.showSpinner", isVisible);
    },

    TYPEAHEAD_TIMEOUT_ID_HOLDER: 0,

    typeAheadDelayExecute: function( callback, delay ) {
        // 300ms is the acceptable delay for function execution after keyboard input
        var delayMilliseconds = isNaN(parseInt(delay)) ? 300 : parseInt(delay);
        clearTimeout (this.TYPEAHEAD_TIMEOUT_ID_HOLDER);
        this.TYPEAHEAD_TIMEOUT_ID_HOLDER = setTimeout(callback, delayMilliseconds);
    }
})