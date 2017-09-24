/**
 * Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description JS Helper for Healthcare base component; extended by other Healthcare Lightning components;
 * @since 198
 */
({
    customObjectURLPieces: {},

    progressMessage: function(Message, startT, force) {
        var isDebug = false;
        var timing = performance.timing;

        if (isDebug) {
            var current = new Date().getTime();
            var start = startT;
            if ($A.util.isEmpty(start)) {
                start = timing.navigationStart;
            }
            console.log('startT:' + startT + ',navDiv:' + (current - (timing.navigationStart)));
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
        return (tmp.protocol === "https:" || tmp.protocol === "http:") ? url : "";
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
     * Simplified remote process call, params is optional
     * rpc:Object, params:Object, action:Function
     * rpc:Object, params:Function
     */
    rpcCall: function(rpc, params, action, isBackground) {
        if (params !== undefined && params != null)
            rpc.setParams(params);
        if (isBackground)
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

    handleError: function(component, errors) {
        var self = this;
        var errorMessage = $A.get("$Label.HealthCloudGA.Msg_Error_General");
        var pslError = $A.get("$Label.HealthCloudGA.Msg_Component_Has_NoAccess");
        if (errors[0] && errors[0].message) {
            errorMessage = errors[0].message;
        }
        if (errorMessage === pslError) {
            component.set("v.hasLicense", false);
        } else {
            var messageBody = {
                type: 'error',
                message: errorMessage
            };
            self.showToast(component, messageBody, true, 'error');
        }
    },

    showToast: function(component, messageBody, autoHide, messageType) {
        var toastCmp = component.find('toast-message');
        if (!$A.util.isUndefinedOrNull(toastCmp)) {
            toastCmp.set('v.content', messageBody);
        } else {
            HC.showToast(messageBody, messageType, autoHide,
                function callback(cmp) {
                    if (!$A.util.isUndefinedOrNull(cmp)) {
                        component.set("v.toastCmp", cmp);
                    }
                });
        }
    },

    closeToast: function(component) {
        var toast = component.find('toast-message');
        if (!$A.util.isUndefinedOrNull(toast)) {
            toast.closeToast();
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

    typeAheadDelayExecute: function(callback, delay) {
        // 300ms is the acceptable delay for function execution after keyboard input
        var delayMilliseconds = isNaN(parseInt(delay)) ? 300 : parseInt(delay);
        clearTimeout(this.TYPEAHEAD_TIMEOUT_ID_HOLDER);
        this.TYPEAHEAD_TIMEOUT_ID_HOLDER = setTimeout(callback, delayMilliseconds);
    },

    stripNamespaceFromRecord: function( sObjectRecord ) {
        var recordWithoutNS = {};
        var nsRegex = new RegExp("^("+HC.orgNamespaceDash+")");
        for( var field in sObjectRecord ) {
            if( sObjectRecord.hasOwnProperty( field ) ) {
                recordWithoutNS[ field.replace(nsRegex,"") ] = typeof sObjectRecord[ field ] === 'string' ? sObjectRecord[ field ].replace(nsRegex,"") : sObjectRecord[ field ];
            }
        }
        return recordWithoutNS;
    },

    getURLAndOpenCreateRecordSubTab: function (component, data, callback) {
        var self = this;
        if (HC.isCustomObjectOrField(data.sObjectName)) {
            data.defaultFieldValues = HC.prependNamespaceOnFieldMap(data.defaultFieldValues);
        }

        if (HC.isCustomObjectOrField(data.sObjectName) && $A.util.isUndefinedOrNull(this.customObjectURLPieces[data.sObjectName])) {
            this.rpcCall(component.get("c.getCustomObjectNewRecordComponents"),
                {
                    customObjectApiName: HC.orgNamespaceDash + data.sObjectName,
                    fieldApiNames: Object.keys(data.defaultFieldValues)
                }, function(response){
                    if (response.getState()==="SUCCESS"){
                        var urlPieces = response.getReturnValue();
                        self.customObjectURLPieces[data.sObjectName] = urlPieces;

                        callback(data.sObjectName, data.defaultFieldValues, urlPieces);
                    }
                    else{
                        this.handleError(cmp, response.getError());
                    }
                });
        }
        else{
            callback(data.sObjectName, data.defaultFieldValues, this.customObjectURLPieces[data.sObjectName]);
        }
    },

    initHCUtil: function() {
        var self = this;

        var isRecordId = function(urlOrRecordId) {
            // Regex to check for valid recordId. Should contain only 15 or 18 alphanumeric characters.
            return !$A.util.isUndefinedOrNull(urlOrRecordId) && urlOrRecordId.match(/^([a-zA-Z0-9]{15}|[a-zA-Z0-9]{18})$/g) !== null;
        };

        var b64encode = function(data) {
            var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

            var _utf8encode = function(string) {
                string = string.replace(/\r\n/g, "\n");
                var utftext = "";

                for (var n = 0; n < string.length; n++) {

                    var c = string.charCodeAt(n);

                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    } else if ((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    } else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }

                }

                return utftext;
            };

            var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
                ac = 0,
                enc = "",
                tmp_arr = [];

            if (!data) {
                return data;
            }
            data = _utf8encode(data);

            // pack three octets into four hexets
            do {
                o1 = data.charCodeAt(i++);
                o2 = data.charCodeAt(i++);
                o3 = data.charCodeAt(i++);

                bits = o1 << 16 | o2 << 8 | o3;

                h1 = bits >> 18 & 0x3f;
                h2 = bits >> 12 & 0x3f;
                h3 = bits >> 6 & 0x3f;
                h4 = bits & 0x3f;

                // use hexets to index into b64, and append result to encoded
                // string
                tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
            } while (i < data.length);

            enc = tmp_arr.join('');

            var r = data.length % 3;

            var ret = (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);

            return encodeURIComponent(ret);
        };

        var generateUrlSuffix = function(attributes) {
            var urlSuffix = '';
            if (!$A.util.isEmpty(attributes)) {
                urlSuffix = '?';
                for (var attr in attributes) {
                    if (attributes.hasOwnProperty(attr) && !$A.util.isEmpty(attr)) {
                        let attrValue = $A.util.isUndefinedOrNull(attributes[attr]) ? '' : '=' + attributes[attr];
                        urlSuffix += attr + attrValue + '&';
                    }
                }
                // Remove trailing &
                urlSuffix = urlSuffix.slice(0, -1);
            }
            return urlSuffix;
        };

        var generateTabUrl = function(urlOrRecordId, componentAttributes) {
            var tabUrl = urlOrRecordId;
            if( isRecordId( urlOrRecordId ) ) {
                tabUrl = this.isInAlohaConsole() ? "/" + encodeURIComponent(urlOrRecordId) : "#/sObject/" + encodeURIComponent(urlOrRecordId) + "/view";
            } else {
                if (this.isInAlohaConsole()) {
                    tabUrl = tabUrl + generateUrlSuffix(componentAttributes);
                } else {
                    var componentSpec = null;

                    // Construct url to open a lightning component as tab/subtab
                    var vfPageToComponentMap = {
                        HcMultipleCarePlanPage: 'HcMultipleCarePlanContainer',
                        HcSingleCarePlanPage: 'HcSingleCarePlan',
                        HcCarePlanPage: 'HcSingleCarePlan',
                        HcCarePlanTemplatePage: 'HcCarePlanTemplateContainer',
                        HcCareTeamPage: 'HcCareTeamCollaboration',
                        HcTimelinePage: 'HcPatientTimeline',
                        HcAssessmentPage: 'HcAssessmentCmp',
                        HcRelationshipPage: 'HcRelationshipMap'
                    };
                    for( var vfPage in vfPageToComponentMap ) {
                        if( vfPageToComponentMap.hasOwnProperty(vfPage) && tabUrl.indexOf( vfPage ) !== -1 ) {
                            // All HC components have patientId as the account id attribute and so we pass in recId as patientId.
                            // We still support recId to support existing customer immplementations.
                            componentAttributes.patientId = componentAttributes.recId;
                            componentSpec = {
                                componentDef: this.orgNamespace + ":" + vfPageToComponentMap[vfPage],
                                attributes: componentAttributes
                            };
                            break;
                        }
                    }

                    if (componentSpec === null) {
                        if (tabUrl.indexOf('/apex/') !== -1) {
                            // Construct url to open a VF page as tab/subtab using the one:alohaPage component
                            componentSpec = {
                                componentDef: "one:alohaPage",
                                attributes: {
                                    address: tabUrl + generateUrlSuffix(componentAttributes)
                                }
                            };
                        } else if (tabUrl[0] !== '/') {
                            // Construct url to open a lightning component as tab/subtab
                            componentSpec = {
                                componentDef: tabUrl,
                                attributes: componentAttributes
                            };
                        }
                    }

                    if (componentSpec !== null) {
                        var tabComponentSpec = componentSpec;
                        // Construct url to open tab/subtab with wrapper having patient card left side bar
                        // TODO: Once LEX Console Workspace level left panel is available, introduced a custom setting to toggle our wrapper panel
                        if(componentSpec.componentDef !== "one:alohaPage") {
                            tabComponentSpec = {
                                componentDef : this.orgNamespace + ":HcComponentWrapper",
                                attributes: {
                                    patientId : componentAttributes.recId,
                                    mainComponentSpec : componentSpec
                                }
                            };
                        }
                        // TODO: Siva: https://gus.my.salesforce.com/0D5B000000RznFJ ; Replace encoded URL generation with stateRef passing to openSubtab
                        tabUrl = window.location.host.indexOf('localhost') == -1 ? b64encode(JSON.stringify(tabComponentSpec)) : encodeURIComponent(JSON.stringify(tabComponentSpec));
                    }
                }
            }
            return tabUrl;
        };

        var generateClassicCreateRecordUrl = function( sObjectName, defaultFieldValues, urlPieces ) {
            var genericCustomSObject = function(defaultFieldValues, urlPieces){
                var lookupDataType = 'Lookup';
                var lookupIdSuffix = '_lkid';
                var customParamPrefix = 'CF';
                var urlQueryParams = [];

                for(var fieldName in urlPieces.fieldDefinitions){
                    if(urlPieces.fieldDefinitions.hasOwnProperty(fieldName)) {
                        var param = urlPieces.fieldDefinitions[fieldName].DurableId.split('.')[1];
                        // if custom field, prepend 'CF'
                        param = HC.isCustomObjectOrField(fieldName) ? customParamPrefix + param : param;

                        // lookup field is a special case, need to add value AND id
                        if (urlPieces.fieldDefinitions[fieldName].DataType.substr(0,lookupDataType.length)===lookupDataType){
                            urlQueryParams.push(param + '=' + defaultFieldValues[fieldName + HC.lookupValueSuffix]);
                            urlQueryParams.push(param + lookupIdSuffix + defaultFieldValues[fieldName]);
                        }
                        else {
                            urlQueryParams.push(param + '=' + defaultFieldValues[fieldName]);
                        }
                    }
                }
                return '/' + urlPieces.keyPrefix + '/e?' + urlQueryParams.join('&');
            };

            var newRecordUrlMap = {
                case: function( defaultFieldValues )
                {
                    var accountId = defaultFieldValues.Account;
                    var contactId = defaultFieldValues.Contact;
                    return '/setup/ui/recordtypeselect.jsp?isdtp=vw&ent=Case&cas3_lkid=' + contactId + '&cas4_lkid=' + accountId + '&retURL=%2F500%2Fo&save_new_url=%2F500%2Fe%3FretURL%3D%252F500%252Fo';
                },
                accountcontactrelation: function (defaultFieldValues) {
                    var acrKeyPrefix = '07k';
                    var urlParam;
                    if (!$A.util.isUndefinedOrNull(defaultFieldValues.AccountId)){
                        urlParam = 'accid=' + defaultFieldValues.AccountId;
                    }
                    else{
                        urlParam = 'conid=' + defaultFieldValues.ContactId;
                    }
                    return '/' + acrKeyPrefix + '/e?' + urlParam;
                },
                account: function (defaultFieldValues) {
                    return '/setup/ui/recordtypeselect.jsp?ent=Account&retURL=%2F001%2Fo&save_new_url=%2F001%2Fe%3FretURL%3D%252F001%252Fo';
                }
            };

            if (HC.isCustomObjectOrField(sObjectName)){
                newRecordUrlMap[sObjectName.trim().toLowerCase()] = genericCustomSObject;
            }

            var newRecordUrl = '';
            if( !$A.util.isUndefinedOrNull(sObjectName) && newRecordUrlMap.hasOwnProperty( sObjectName.trim().toLowerCase() ) )
            {
                newRecordUrl = newRecordUrlMap[ sObjectName.trim().toLowerCase() ]( defaultFieldValues, urlPieces );
            }
            return newRecordUrl;
        };

        var LEXWorkspace = null;
        //Create force:workspaceAPIAccess only in LEX Console
        if (typeof sforce == "undefined") {
            $A.createComponent('force:workspaceAPI', {}, function(workspace, status, statusMessage) {
                LEXWorkspace = workspace;
            });
        } 

        window.HC = {

            orgNamespace: '',
            orgNamespaceDash: '',
            customSObjectSuffix: '__c',
            lookupValueSuffix: '__lookupValue',

            setNamespace: function(component) {
                var namespace = component.toString().match(/markup:\/\/(\w{1,15}):/)[1];
                this.orgNamespace = $A.util.isEmpty(namespace) ? "c" : namespace;
                this.orgNamespaceDash = $A.util.isEmpty(namespace) ? "" : namespace + '__';
            },

            format: function(formatString, arg1, arg2, argN) { //eslint-disable-line no-unused-vars
                var formatArguments = Array.prototype.slice.call(arguments, 1);
                return formatString.replace(/\{(\d+)\}/gm, function(match, index) {
                    var substitution = formatArguments[index];
                    if (substitution === undefined) {
                        match = '';
                        return match;
                    }
                    return substitution + '';
                });
            },

            isNumber: function(obj) {
                return typeof obj === 'number';
            },

            isCustomObjectOrField: function(name){
                var rgx = new RegExp(this.customSObjectSuffix, 'g');
                return rgx.test(name);
            },

            stripNamespace: function(string){
                var nsRegex = new RegExp("^("+this.orgNamespaceDash+")");
                return string.replace(nsRegex,"");
            },

            prependNamespaceOnFieldMap: function(fieldValues){
                var fieldValuesMapWithNS = {};
                for(var fieldName in fieldValues) {
                    if(fieldValues.hasOwnProperty(fieldName)) {
                        var mapName = this.isCustomObjectOrField(fieldName) ? this.orgNamespaceDash + fieldName : fieldName;
                        fieldValuesMapWithNS[ mapName ] = fieldValues[fieldName];
                    }
                }
                return fieldValuesMapWithNS;
            },

            deleteLookupValueParams: function(fieldValues){
                var rgx = new RegExp(this.lookupValueSuffix, 'g');
                for(var fieldName in fieldValues) {
                    if(fieldValues.hasOwnProperty(fieldName) && rgx.test(fieldName)) {
                        delete fieldValues[fieldName];
                    }
                }
                return fieldValues;
            },

            squash: function(event, preventDefault) {
                event = event || window.event;
                if (event.stopPropagation) {
                    event.stopPropagation();
                }
                event.cancelBubble = true;

                if (preventDefault) {
                    if (event.preventDefault) {
                        event.preventDefault();
                    }
                    event.returnValue = false;
                }
            },

            camelCaseToHyphens: function(str) {
                var CAMEL_CASE_TO_HYPHENS_REGEX = /([A-Z])/g;
                return str.replace(CAMEL_CASE_TO_HYPHENS_REGEX, "-$1").toLowerCase();
            },

            getDataAttribute: function(element, name) {
                if (!this.acceptsData(element) || $A.util.isUndefined(name)) {
                    return null;
                }
                var key = "data-" + this.camelCaseToHyphens(name);
                return element.getAttribute(key);
            },

            setDataAttribute: function(element, name, value) {
                if (!this.acceptsData(element) || $A.util.isUndefined(name)) {
                    return null;
                }

                var key = "data-" + this.camelCaseToHyphens(name);

                if (!$A.util.isUndefined(value)) {
                    return element.setAttribute(key, value);
                }
                return element.removeAttribute(key);
            },

            isHTMLElement: function(obj) {
                if (typeof HTMLElement === "object") {
                    return obj instanceof HTMLElement;
                } else {
                    return obj && obj.nodeType === 1 && typeof obj.nodeName === "string";
                }
            },

            acceptsData: function(element) {
                if (!this.isHTMLElement(element)) {
                    return false;
                }
                var noData = {
                    "embed": true,
                    "object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000", // flash
                    "applet": true,
                    "#text": true
                };

                if (element.nodeName) {
                    var match = noData[element.nodeName.toLowerCase()];

                    if (match) {
                        return !(match === true || element.getAttribute("classid") !== match);
                    }
                }
                return true;
            },

            isInAlohaConsole: function() {
                // typeof sforce !== "undefined" handles the case where Classic Console is opened when LEX is enabled
                return typeof sforce !== "undefined";
            },

            openConsolePrimaryTab: function(urlOrRecordId, active, tabLabel, name, attributes) {
                if (this.isInAlohaConsole()) {
                    if ($A.util.isUndefinedOrNull(sforce)) {
                        console.warn('sforce API not available');
                    } else {
                        if (sforce.console.isInConsole()) {
                            sforce.console.openPrimaryTab(null,
                                generateTabUrl.call(this, urlOrRecordId, attributes),
                                active,
                                tabLabel,
                                function(response) {
                                    console.log(response.success ? 'Opened tab : ' + response.id : 'Failed to open tab');
                                },
                                name);
                        } else {
                            console.warn('openConsolePrimaryTab() called in a non-console context (perhaps within a VF page outside aloha console?)');
                        }
                    }
                } else {
                    if (!$A.util.isUndefinedOrNull(LEXWorkspace)) {
                        var setTabLabelCallback = function(tabId) {
                            LEXWorkspace.setTabLabel({
                                tabId: tabId,
                                label: tabLabel
                            });
                        };
                        LEXWorkspace.openTab({
                            url: generateTabUrl.call(this, urlOrRecordId, attributes),
                            focus: active
                        }).then(setTabLabelCallback);
                    } else {
                        console.warn('Workspace API not available');
                    }
                }
            },

            openConsoleSubTab: function(urlOrRecordId, active, tabLabel, id, name, attributes) {
                var self = this;
                if (this.isInAlohaConsole()) {
                    if ($A.util.isUndefinedOrNull(sforce)) {
                        console.warn('sforce API not available');
                    } else {
                        if (sforce.console.isInConsole()) {
                            sforce.console.getEnclosingPrimaryTabId(function(primaryTab) {
                                sforce.console.openSubtab(primaryTab.id,
                                    generateTabUrl.call(self, urlOrRecordId, attributes),
                                    active,
                                    tabLabel,
                                    id,
                                    function(response) {
                                        console.log(response.success ? 'Opened sub tab : ' + response.id : 'Failed to open sub tab');
                                    },
                                    name);
                            });
                        } else {
                            console.warn('openConsoleSubTab() called in a non-console context (perhaps within a VF page outside aloha console?)');
                        }
                    }
                } else {
                    if (!$A.util.isUndefinedOrNull(LEXWorkspace)) {

                        var setTabLabelCallback = function(tabId) {
                            LEXWorkspace.setTabLabel({
                                tabId: tabId,
                                label: tabLabel
                            });
                            LEXWorkspace.setTabIcon({
                                tabId: tabId,
                                icon: "standard:account", // TODO: Update with appropriate icons
                                iconAlt: ""
                            });
                        };
                        var openSubTabCallback = function(tabInfo) {
                            var currentWorkspaceId = tabInfo.isSubtab ? tabInfo.parentTabId : tabInfo.tabId;

                            LEXWorkspace.openSubtab({
                                parentTabId: currentWorkspaceId,
                                url: generateTabUrl.call(self, urlOrRecordId, attributes),
                                focus: active
                            }).then(setTabLabelCallback);
                        };

                        LEXWorkspace.getAllTabInfo().then(function(tabInfo) {
                                var parentTabInfo = null;
                                var isPatientSubTab = !$A.util.isUndefinedOrNull(attributes) && isRecordId(attributes.recId);

                                for (let i = 0; i < tabInfo.length; i++) {
                                    // By default, set parent tab to the current focused primary tab with a record id
                                    if (tabInfo[i].focused) {
                                        parentTabInfo = tabInfo[i];
                                    }
                                    // If the patientId (recId) matches the recordId in a different primary tab, then choose that as the parent tab
                                    let parentTabRecordId = tabInfo[i].recordId;
                                    if( isPatientSubTab && parentTabRecordId == attributes.recId ) {
                                        parentTabInfo = tabInfo[i];
                                        break;
                                    }
                                }
                                if(isPatientSubTab) {
                                    // Open a patient subtab only under a patient primary tab based on matching record id
                                    if(parentTabInfo.recordId == attributes.recId) {
                                        openSubTabCallback(parentTabInfo);
                                    } 
                                } else {
                                    openSubTabCallback(parentTabInfo);
                                }
                            }
                        );
                    } else {
                        console.warn('Workspace API not available');
                    }
                }
            },

            openRecordPrimaryTab: function(recordId, title) {
                return this.openConsolePrimaryTab(recordId, true, title, recordId);
            },

            openRecordSubTab: function(recordId, title) {
                var openRecordUrl = recordId;
                if (this.isInAlohaConsole()) {
                    openRecordUrl = generateTabUrl.call(this, recordId) + "?noredirect=1";
                }
                return this.openConsoleSubTab(openRecordUrl, true, title, null, title);
            },

            handleTabFocus: function( currentTabId, previousTabId, focusInHandler, focusOutHandler ) {
                if (this.isInAlohaConsole()) {
                    // TODO: Investigate if there is a hook to focus change events in Aloha Console
                    console.warn('Handling tab focus change is currently supported only in LEX Console.');
                } else {
                    var getEnclosingTabIdEvent = $A.get("e.force:getEnclosingTabId");
                    getEnclosingTabIdEvent.setParams({
                        callback: function( tabId ) {
                            if( tabId == currentTabId && typeof focusInHandler === 'function' ) {
                                focusInHandler();
                            } 
                            if( tabId == previousTabId && typeof focusOutHandler === 'function' ) {
                                focusOutHandler();
                            } 
                        }
                    });
                    getEnclosingTabIdEvent.fire();
                }
            },

            invokeEditRecord: function(sObjectName, title, recordId, componentAttributes, callback) {
                if (this.isInAlohaConsole()) {
                    if ($A.util.isUndefinedOrNull(componentAttributes)) {
                        var editRecordUrl = generateTabUrl.call(this, recordId) + "/e";
                        // Make changes here when there is a need to edit record in a primary tab
                        this.openConsoleSubTab(editRecordUrl, true, title, null, title);
                    } else { // Custom field set based edit record modal
                        componentAttributes.sObjectName = sObjectName;
                        componentAttributes.headerTitle = title;
                        componentAttributes.recordId = recordId;
                        $A.createComponent(this.orgNamespace + ":HcFieldSetsModal",
                            componentAttributes,
                            callback
                        );
                    }
                } else {
                    // TODO: Check what is the title
                    var editRecordEvent = $A.get("e.force:editRecord");
                    editRecordEvent.setParams({
                        recordId: recordId
                    });
                    editRecordEvent.fire();
                }
            },

            invokeCreateRecord: function(sObjectName, title, defaultFieldValues, componentAttributes, callback) {
                var self = this;
                if (this.isInAlohaConsole()) {
                    if ($A.util.isUndefinedOrNull(componentAttributes)) {

                        var classicCreateRecordEvent = $A.get("e.HealthCloudGA:HcDelegateEvent");
                        classicCreateRecordEvent.setParams({
                            data: {
                                sObjectName: sObjectName,
                                defaultFieldValues: defaultFieldValues
                            },
                            callback: function(sObjectName, fieldValuesMap, urlPieces){
                                var newRecordUrl = generateClassicCreateRecordUrl(sObjectName, fieldValuesMap, urlPieces);
                                self.openConsoleSubTab(newRecordUrl, true, title, null, title);
                            }
                        });
                        classicCreateRecordEvent.fire();

                    } else { // Custom field set based create record modal
                        componentAttributes.sObjectName = sObjectName;
                        componentAttributes.headerTitle = title;
                        componentAttributes.prePopMap = defaultFieldValues;
                        $A.createComponent(this.orgNamespace + ":HcFieldSetsModal",
                            componentAttributes,
                            callback
                        );
                    }
                } else {
                    defaultFieldValues = this.deleteLookupValueParams(defaultFieldValues);
                    var entityApiName = this.isCustomObjectOrField(sObjectName) ? this.orgNamespaceDash + sObjectName : sObjectName;
                    var createRecordEvent = $A.get("e.force:createRecordWithRecordTypeCheck");
                    var fieldValuesMapWithNS = this.prependNamespaceOnFieldMap(defaultFieldValues);
                    createRecordEvent.setParams({
                        entityApiName: entityApiName,
                        defaultFieldValues: fieldValuesMapWithNS,
                        createRecordPanelTitle: title
                        // navigationLocation: "LOOKUP" /* Uncomment this to create a record via a modal */
                    });
                    createRecordEvent.fire();
                }
            },

            openNewCarePlan: function(accountId, contactId, title) {
                if (this.isInAlohaConsole()) {
                    this.invokeCreateRecord('Case', title, { Account: accountId, Contact: contactId });
                } else {
                    this.invokeCreateRecord('Case', title, { AccountId: accountId, ContactId: contactId });
                }
            },

            openSingleCarePlanSubtab: function(carePlanId, patientId, tabName) {
                if ($A.util.isUndefinedOrNull(carePlanId) || $A.util.isUndefinedOrNull(patientId)) {
                    console.warn('Unable to open care plan');
                    return false;
                }
                var pageUrl = '/apex/' + this.orgNamespaceDash + 'HcSingleCarePlanPage';
                var attributes = {
                    carePlanId: carePlanId,
                    recId: patientId
                };
                return this.openConsoleSubTab(pageUrl, true, tabName, null, tabName, attributes);            
            },

            openCarePlanTemplatesSubtab: function(carePlanId, patientId, tabName) {
                if ($A.util.isUndefinedOrNull(carePlanId) || $A.util.isUndefinedOrNull(patientId)) {
                    console.warn('Unable to open care plan templates');
                    return false;
                }
                var pageUrl = '/apex/' + this.orgNamespaceDash + 'HcCarePlanTemplatePage';
                var attributes = {
                    carePlanId: carePlanId,
                    recId: patientId
                };
                return this.openConsoleSubTab(pageUrl, true, tabName, null, tabName, attributes);
            },

            openCaseTeamSubTab: function(patientId, carePlanId, tabName, careTeamByCaseId) {
                if ($A.util.isUndefinedOrNull(patientId) || $A.util.isUndefinedOrNull(carePlanId)) {
                    console.warn('Unable to open care team');
                    return false;
                }
                var pageUrl = '/apex/' + this.orgNamespaceDash + 'HcCareTeamPage';
                var attributes = {
                    carePlanId: carePlanId,
                    recId: patientId,
                    careTeamByCaseId: careTeamByCaseId === true
                };
                var name = $A.util.isUndefinedOrNull(tabName) ? $A.get("$Label.HealthCloudGA.Collaboration") : tabName;
                return this.openConsoleSubTab(pageUrl, true, name, null, name, attributes);
            },

            showToast: function(messageBody, type, autoHide, callback) {
                var auraId = 'toast-message';
                var typeCssMap = {
                    'normal': 'slds-theme--normal',
                    'success': 'slds-theme--success',
                    'warning': 'slds-theme--warning',
                    'error': 'slds-theme--error'
                };
                var mode = autoHide ? "dismissible" : "sticky";
                var typeCss = typeCssMap.hasOwnProperty(type) ? typeCssMap[type] : 'slds-theme--normal';
                if (this.isInAlohaConsole()) {
                    var toastAttribs = { "content": messageBody, "autoHideErrorAndWarning": autoHide, "aura:Id": auraId, typeClass: typeCss };
                    $A.createComponent(this.orgNamespace + ':toast', toastAttribs, function(cmp) {
                        callback(cmp);
                    });
                } else {
                    var appEvent = $A.get("e.force:showToast");
                    appEvent.setParams({
                        "message": messageBody.message,
                        "type": type,
                        "mode": mode
                    });
                    appEvent.fire();
                }
                return true;
            },

            showConfirmationModal: function(component, title, confirmationMsg, confirmLabel, confirmAction, cancelAction) {
                if (this.isInAlohaConsole()) {
                    var confirmationAttribs = {
                        "aura:Id": 'confirmation-modal',
                        confirmationMessage: confirmationMsg,
                        modalSizeClass: '',
                        index: 0,
                        count: 0,
                        finishButtonText: confirmLabel,
                        headerTitle: title,
                        finishEvent: confirmAction,
                        cancelEvent: cancelAction,
                        isDoable: true
                    };
                    $A.createComponent(this.orgNamespace + ':modal', confirmationAttribs, function(cmp, status, statusMessage) {
                        if(status === 'SUCCESS') {
                            component.set("v.modalCmp", cmp);
                        }
                    });         
                } else {
                    var attributes = {
                        label: confirmLabel,
                        class: 'slds-button--brand',
                        onclick: confirmAction
                    };
                    $A.createComponent("lightning:button", attributes, function(confirmButton, status, statusMessage) {
                        if (status === "SUCCESS") {
                            var cancelLabel = $A.get("$Label.Buttons.cancel");
                            // TODO: Passed in cancelAction should be passed on to onAfterShow or onDestroy attributes of ui:createPanel
                            // but we don't have access to those attributes yet.
                            var cancelAction = {
                                title: cancelLabel,
                                label: cancelLabel,
                                isCancelAction: true
                            };
                            $A.get("e.ui:createPanel").setParams({
                                panelType: "actionModal",
                                visible: true,
                                panelConfig: {
                                    title: title,
                                    detail: confirmationMsg,
                                    footerActions: [confirmButton, cancelAction]
                                }
                            }).fire();
                        }
                    });
                }
            }
        };        
    }
})