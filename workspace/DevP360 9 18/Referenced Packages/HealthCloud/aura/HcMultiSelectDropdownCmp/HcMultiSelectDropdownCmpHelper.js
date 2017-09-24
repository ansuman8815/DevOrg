/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcMultiSelectDropdownCmpHelper, js front-end helper for HcMultiSelectDropdownCmp component.
 * @since 196
 */
({
    selectedItem: function(component, event) {
        var target = event.target || event.srcElement;
        console.log("target.innerText~~~~" + target.textContent);
    },

    filterOnChanged: function(component, result) {
        var filterChangedEvent = component.getEvent("filterChangedEvent");
        filterChangedEvent.fire();
    },

    fetchCategoryMap: function(component) {
        var self = this;
        var action = component.get("c.getTimelineViewMenu");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var returnMap = response.getReturnValue();
                var keys = Object.keys(returnMap);
                keys.sort();
                var res = "<optgroup label=";
                for (var i = 0; i < keys.length; i++) {
                    res = res.concat('\"' + keys[i] + '\"' + ' >');
                    var listOfmap = returnMap[keys[i]];
                    for (var j = 0; j < listOfmap.length; j++) {
                        res = res.concat('<option value=' + '\"' + listOfmap[j] + '\"' + '>' + listOfmap[j] + '</option>');
                    }
                    res = res.concat('</optgroup><optgroup label=');
                }
                res = res.replace(/<optgroup label=\s*$/, "");
                $("#example-multiple-optgroups").append(res);

                $('#example-multiple-optgroups').multiselect({
                    enableClickableOptGroups: true,
                    buttonClass: 'btn btn-link button--neutral',
                    selectAll: true,
                    maxHeight: 430,
                    selectedClass: null,
                    buttonText: function(options, select) {
                        return 'Show All Events';
                    },
                    buttonTitle: function(options, select) {
                        var labels = [];
                        options.each(function() {
                            labels.push($(this).text());
                        });
                        return labels.join(' - ');
                    },
                    onDropdownShow: function(event) {
                        $('.multiselect.dropdown-toggle.btn.btn-link.button--neutral').addClass("highlighted")

                    },
                    onDropdownHide: function(event) {
                        $('.multiselect.dropdown-toggle.btn.btn-link.button--neutral').removeClass("highlighted")

                    },
                    templates: {
                        liGroup: '<hr width="100%" class="option-group-line" /><li class="multiselect-item multiselect-group"><label></label></li>'
                    }

                });


                $('.multiselect-container').find('input').each(function() {
                    $(this).prop("checked", true);
                });

                $('.multiselect-container').find('li').each(function() {
                    if (!$(this).hasClass('multiselect-item')) {
                        $(this).addClass('single-option');
                    }
                });

                $('.multiselect-container').find('hr').each(function() {
                    $(this).css('display', 'none');
                    return false;
                });

                $('input:checkbox', '#mainContainer').click(function() {
                    var resultString = [];
                    $(this).closest('ul').find('input:checkbox').each(function() {
                        if ($(this).is(':checked')) {
                            resultString.push($(this).parent().text().trim());
                        }
                    });
                    component.set("v.resultString", resultString);
                    self.filterOnChanged(component, resultString);
                });

                $('li.multiselect-group-clickable', '#mainContainer').click(function() {
                    var resultString = [];
                    $(this).closest('ul').find('input:checkbox').each(function() {
                        if ($(this).is(':checked')) {
                            resultString.push($(this).parent().text().trim());
                        }
                    });
                    component.set("v.resultString", resultString);
                    self.filterOnChanged(component, resultString);
                });



            }
            if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        throw new Error(errors[0].message);
                    }
                } else {
                    throw new Error("Unknown error");
                }
            }

        });
        $A.enqueueAction(action);
    }
})