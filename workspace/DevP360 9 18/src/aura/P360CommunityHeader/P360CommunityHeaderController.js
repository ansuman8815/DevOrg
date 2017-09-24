({
    doInit: function(component, event, helper) {
        var action = component.get("c.getLoggedInUserProfile");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state == 'SUCCESS') {
                component.set("v.profilename", response.getReturnValue());
                
            }     
        });
        $A.enqueueAction(action);
        var a = component.get("c.checkIfAnnouncementRead");
        a.setCallback(this, function(response) {
            var state = response.getState();
            if (state == 'SUCCESS') {
                component.set("v.isRead",response.getReturnValue());
            }
        });
        $A.enqueueAction(a);     
    },
    doneRendering: function(component, event, helper) {
        var sPageURL = decodeURIComponent(window.location);
        var profileName = component.get("v.profilename");
        var profileLabel = $A.get("$Label.c.P360CommunityBasicAccess");
        if (sPageURL.indexOf('patientdetail') != -1 || sPageURL.indexOf('patientsearch') != -1 || sPageURL.indexOf('patientregistries') != -1 || sPageURL.indexOf('help') != -1) {
            if (profileName != '' && profileName != profileLabel && document.getElementById("reRenderDiv")) {
                if (document.getElementById("reRenderDiv"))
                    document.getElementById("reRenderDiv").style.display = "block";
            } else {
                if (document.getElementById("basicAccessDiv"))
                    document.getElementById("basicAccessDiv").style.display = "block";
                $('body').append('<script>svg4everybody();</script>');
                
            }
            
        }
    },
    /*Method to capture serch button clicked or not */
    handleApplicationEvent: function(component, event, helper) {
        component.set("v.search_clicked", event.getParam("Search_Clicked"));
    },
    /* Method to capture logic when clicked on help icon */
    helpClick: function(component, event, helper) {
        var evt = $A.get("e.force:navigateToURL");
        evt.setParams({
            "url": "/help",
            isredirect: true
        });
        evt.fire();
    },
    myAction: function(component, event, helper) {
        $('body').append('<script>svg4everybody();</script>');
    },
    
    logOutClick: function(component, event, helper) {
        document.getElementById("menuDiv").style.display = "none";
        setTimeout(function() {
            var r = confirm("Are you sure you want to Logout?");
            if (r == true) {
                var logOutURL = $A.get("$Label.c.P360CommunitylogoutURL");
                window.location.href = logOutURL;
            }
        }, 100);
    },
    //Added for Mount Logo
    LogoClick: function(component, event, helper) {
        var evt = $A.get("e.force:navigateToURL");
        evt.setParams({
            "url": "/",
            isredirect: true
        });
        evt.fire();
    },
    
    /* Method to capture logic when clicked on patient registries icon */
    registryClick: function(component, event, helper) {
        var evt = $A.get("e.force:navigateToURL");
        evt.setParams({
            "url": "/patientregistries",
            isredirect: true
        });
        evt.fire();
    },
    
    /* Method to capture logic when clicked on quick link icon */
    quickLinkClick: function(component, event, helper) {
        if (document.getElementById("quickLinkDiv")) {
            var className = document.getElementById("quickLinkDiv").style.display;
            if (className.indexOf("none") != -1) {
                if (document.getElementById("searchLinkDiv"))
                    document.getElementById("searchLinkDiv").style.display = "none";
                else
                    document.getElementById("searchLinkDiv1").style.display = "none";
                document.getElementById("menuDiv").style.display = "none";
                document.getElementById("quickLinkDiv").style.display = "block";
            } else {
                document.getElementById("quickLinkDiv").style.display = "none";
            }
        }
    },
    /* Method to capture logic when clicked on search icon */
    searchClick: function(cmp, event, helper) {
        var profileName = cmp.get("v.profilename");
        var profileLabel = $A.get("$Label.c.P360CommunityBasicAccess");
        var className;
        
        if (profileName != profileLabel)
            className = document.getElementById("searchLinkDiv").style.display;
        else
            className = document.getElementById("searchLinkDiv1").style.display;
        
        if (className.indexOf("none") != -1) {
            cmp.set("v.viewSearchon", true);
            if (document.getElementById("quickLinkDiv"))
                document.getElementById("quickLinkDiv").style.display = "none";
            document.getElementById("menuDiv").style.display = "none";
            if (profileName != profileLabel) {
                document.getElementById("searchLinkDiv").style.display = "block";
                $(".Logo ,.onlyDeskText,.onlyMobileText").css({
                    opacity: 0.4
                });
                $(".Logo").css({
                    'pointer-events': 'none',
                    'margin-top': '20px',
                    'padding-left':'20px'
                });
                $(".onlyDeskText").css({
                    'margin-top': '30px'
                });
                document.getElementById("headerL").className += " slds-backdrop slds-backdrop--open";
                if (document.getElementById("column1Div"))
                    document.getElementById("column1Div").className += " slds-backdrop slds-backdrop--open";
                if (document.getElementById("searchColl"))
                    document.getElementById("searchColl").className += " slds-backdrop slds-backdrop--open";
            } else {
                document.getElementById("searchLinkDiv1").style.display = "block";
                $(".Logo ,.onlyDeskText,.onlyMobileText").css({
                    opacity: 0.4
                });
                $(".Logo").css({
                    'pointer-events': 'none',
                    'margin-top': '20px',
                    'padding-left':'20px'
                });
                $(".onlyDeskText").css({
                    'margin-top': '30px'
                });
                document.getElementById("headerL").className += " slds-backdrop slds-backdrop--open";
                if (document.getElementById("column1Div"))
                    document.getElementById("column1Div").className += " slds-backdrop slds-backdrop--open";
                if (document.getElementById("searchColl"))
                    document.getElementById("searchColl").className += " slds-backdrop slds-backdrop--open";
            }
        } else {
            if (document.getElementById("searchLinkDiv")) {
                document.getElementById("searchLinkDiv").style.display = "none";
                var headerL = document.getElementById("headerL");
                $A.util.removeClass(headerL, 'slds-backdrop slds-backdrop--open');
                $(".Logo ,.onlyDeskText,.onlyMobileText").css({
                    opacity: 1
                });
                $(".Logo").css({
                    'pointer-events': 'all',
                    'margin-top': '0px',
                    'padding-left':'0px'
                });
                $(".onlyDeskText").css({
                    'margin-top': '0px'
                });
                if (document.getElementById("column1Div")) {
                    var cmpDiv1 = document.getElementById("column1Div");
                    $A.util.removeClass(cmpDiv1, 'slds-backdrop slds-backdrop--open');
                }
                if (document.getElementById("searchColl")) {
                    var searchColl = document.getElementById("searchColl");
                    $A.util.removeClass(searchColl, 'slds-backdrop slds-backdrop--open');
                }
            } else {
                document.getElementById("searchLinkDiv1").style.display = "none";
                var headerL = document.getElementById("headerL");
                $A.util.removeClass(headerL, 'slds-backdrop slds-backdrop--open');
                $(".Logo ,.onlyDeskText,.onlyMobileText").css({
                    opacity: 1
                });
                $(".Logo").css({
                    'pointer-events': 'all',
                    'margin-top': '0px',
                    'padding-left':'0px'
                });
                $(".onlyDeskText").css({
                    'margin-top': '0px'
                });
                if (document.getElementById("column1Div")) {
                    var cmpDiv1 = document.getElementById("column1Div");
                    $A.util.removeClass(cmpDiv1, 'slds-backdrop slds-backdrop--open');
                }
                if (document.getElementById("searchColl")) {
                    var searchColl = document.getElementById("searchColl");
                    $A.util.removeClass(searchColl, 'slds-backdrop slds-backdrop--open');
                }
            }
        }
    },
    menuSearchClick: function(cmp, event, helper) {
        var divComp = document.getElementById("menuDiv");
        var className = document.getElementById("menuDiv").style.display;
        if (className.indexOf("none") != -1) {
            if (document.getElementById("quickLinkDiv"))
                document.getElementById("quickLinkDiv").style.display = "none";
            if (document.getElementById("searchLinkDiv"))
                document.getElementById("searchLinkDiv").style.display = "none";
            else
                document.getElementById("searchLinkDiv1").style.display = "none";
            document.getElementById("menuDiv").style.display = "block";
        } else {
            document.getElementById("menuDiv").style.display = "none";
        }
        
    },
    goback: function(component, event, helper) {  
        $('body').css('overflow-y', 'auto');
        var getUrlParameter = function getUrlParameter(sParam) {
            var sPageURL = decodeURIComponent(window.location.search.substring(1)),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;
            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : sParameterName[1];
                }
            }
        };
       
        var urlParam = '';
        var action = component.get("c.getLandingPage");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state == 'SUCCESS') {
                var res = response.getReturnValue();
                if (res.urlParam != '')
                    urlParam = "?" + res.urlParam;
                if (res.pageName) {
                    var urlEvent = $A.get("e.force:navigateToURL");
                    urlEvent.setParams({
                        "url": res.pageName + urlParam
                    });
                    urlEvent.fire();
                } else {
                    var searchTerm = document.getElementById("searchText").value;
                    searchTerm = searchTerm.trim();
                    var lastChar = searchTerm[searchTerm.length-1];
                    if(lastChar != '*')
            			searchTerm = searchTerm + '*';
                    if (res.landingPage == 'Clinical Summary') {
                        var evt = $A.get("e.c:DynamicPalletEvent");
                        evt.setParams({
                            "viewMore": false
                        });
                        evt.fire();
                    } else if (res.landingPage == 'Social Summary') {
                        var evt = $A.get("e.c:SocialSummaryEvent");
                        evt.setParams({
                            "viewSocialsummary": true
                        });
                        evt.fire();
                    } else if (res.landingPage == 'Encounter Summary') {
                        var evt = $A.get("e.c:EncounterSummaryEvent");
                        evt.setParams({
                            "patientid": getUrlParameter('patientid'),
                            "tableName": "encounter_table",
                            "listName": "Encounter Summary",
                            "viewEncounterSummary": true
                        });
                        evt.fire();
                       } 
                       else if(res.landingPage == 'Encounter Details'){
                         var evt = $A.get("e.c:EncounterSummaryEvent"); 
                             evt.setParams({
                            "selectedId":res.EncounterId,
                            "ESselected": true
                        });
                        evt.fire();
                       }
                   	   else if (res.landingPage == 'Global Search' && searchTerm != '') {
                        var evt = $A.get("e.c:P360CommunityGlobalSearchEvent");
                        evt.setParams({"searchString": searchTerm,
                                       "viewGlobalSearch": true});
                        evt.fire();
                       } else if (res.landingPage == 'Demographics') {
                        var evt = $A.get("e.c:DemographicEvent");
                        evt.setParams({ "patientid" : getUrlParameter('patientid'),
                        				"viewDemographics" : true });
                        evt.fire();
                    }
                }
            }
        });
        $A.enqueueAction(action);
    },
    onClickAnnouncement: function(component, event, helper) {
        var action = component.get("c.updateUserRecord");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state == 'SUCCESS') {
                component.set("v.isRead",true);
            }
        });
        $A.enqueueAction(action);    
    }    
    
})