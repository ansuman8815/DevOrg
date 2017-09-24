/** Copyright © 2015 salesforce.com, inc. All rights reserved.
 * @copyright This document contains proprietary and confidential information and shall not be reproduced,
 * transferred, or disclosed to others, without the prior written consent of Salesforce.
 * @description HcAdtConversionDupCheckHelper, js front-end helper for HcAdtConversionDupCheck component.
 * @since 198
 */
({
    DUP_REASON_CANDIDATE: '', // Msg_Duplicate_Candidate
    DUP_REASON_PATIENT: '', // Msg_Duplicate_Patient
    DUP_REASON_BOTH: '', // Msg_Duplicate_Both

    initLabels: function() {
        if (this.DUP_REASON_CANDIDATE === '') {
            this.DUP_REASON_CANDIDATE = $A.get("$Label.HealthCloudGA.Msg_Duplicate_Candidate");
            this.DUP_REASON_PATIENT = $A.get("$Label.HealthCloudGA.Msg_Duplicate_Patient");
            this.DUP_REASON_BOTH = $A.get("$Label.HealthCloudGA.Msg_Duplicate_Both");
        }
    },

    checkDuplicate: function(component) {
        // Map of candidate id to candidate
        var duplicatesMap = {};

        this.initLabels();
        this.checkDuplicateCandidates(component, duplicatesMap);
        this.checkDuplicatePatients(component, duplicatesMap);
    },

    checkDuplicatePatients: function(component, duplicatesMap) {
        // Initialize server rpc call to "checkCandidateDuplicates" method in "HcPatientCreationFlowController"
        var self = this;
        var payload = JSON.stringify(component.get('v.entries'));
        var rpc = component.get("c.checkCandidateDuplicates");
        rpc.setParams({
            'payload': payload
        });

        rpc.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                var adts = response.getReturnValue();
                var output = [];
                var dups = [];

                adts.forEach(function(candidate, index, all) {

                    if (candidate.isDuplicated !== 'true' && !duplicatesMap[candidate.id]) {
                        output.push(candidate);
                    } else {
                        if (duplicatesMap[candidate.id]) {
                            if (candidate.isDuplicated === 'true') {
                                candidate.reason = self.DUP_REASON_BOTH;
                            } else {
                                candidate.reason = self.DUP_REASON_CANDIDATE
                            }
                        } else {
                            candidate.reason = self.DUP_REASON_PATIENT;
                        }

                        // Save the updated reason (or add new candidate) to the duplicates map
                        duplicatesMap[candidate.id] = candidate;
                    }
                });

                // Convert duplicate map to list
                dups = Object.keys(duplicatesMap || {}).map(function(key) {
                    return duplicatesMap[key];
                });

                // Sort duplicate candidates by name
                dups = dups.sort(function(a, b) {
                    return a.name.localeCompare(b.name);
                });

                component.set('v.output', output);
                component.set('v.dgEntries', dups);
                component.set('v.duplicateCount', dups.length);
            } else {
                console.log("Error from server-side:");
                console.log(response.getState());
            }
        });
        $A.enqueueAction(rpc);
    },

    checkDuplicateCandidates: function(component, duplicatesMap) {
        var candidates = component.get('v.entries'),
            tempMrnMap = {};

        // Find all candidates that have same MRN as other selected candidates and record them in duplicates map
        for (var idx = 0; idx < candidates.length; idx++) {
            var aCandidate = candidates[idx];

            // if candidate has a MRN proceed with duplicate check
            if( aCandidate.mrn ) {
              // if MRN exists add it to the duplicates map
              if (tempMrnMap[aCandidate.mrn]) {
                  var existingDupCan = tempMrnMap[aCandidate.mrn];
                  duplicatesMap[existingDupCan.id] = existingDupCan;
                  duplicatesMap[aCandidate.id] = aCandidate;
              } else {
                  tempMrnMap[aCandidate.mrn] = aCandidate;
              }
            }
        }
    },

    setupHeaders: function(component){
        var nameLabel = $A.get("$Label.HealthCloudGA.Field_Label_Candidate_Patient_Name");
        var mrnLabel = $A.get("$Label.HealthCloudGA.Field_Label_MRN");
        var reasonLabel = $A.get("$Label.HealthCloudGA.Field_Label_Reason");
        var colHeaders = [
            {name:"name", label:nameLabel, sortOrder:""},
            {name:"mrn", label:mrnLabel, sortOrder:""},
            {name:"reason", label:reasonLabel, sortOrder:""},
        ];
        component.set('v.headerColumns',colHeaders);
    },

    sortBy: function(component,colId){
        var ascending = true;
        var columns = component.get('v.headerColumns');
        for (var i = 0; i < columns.length; i++) {
            var column = columns[i];
            if (colId === column.name) {
                if (column.sortOrder == '') {
                    column.sortOrder = 'A';
                } else if (column.sortOrder == 'D') {
                    column.sortOrder = 'A';
                } else {
                    column.sortOrder = 'D';
                    ascending = false;
                }
            }
            else{
                column.sortOrder = '';
            }
        }
        component.set('v.headerColumns',columns);

        var records = component.get('v.dgEntries');
        records.sort(function(a, b) {
            var aVal = a[colId],
                bVal = b[colId],
                ret = 0;

            if (typeof aVal !== 'number') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
                ret = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
            } else {
                ret = parseInt(aVal,10) - parseInt(bVal,10);
            }

            if (!ascending) {
                ret = -ret;
            }

            return ret;
        });
        component.set('v.dgEntries',records);
    }
})