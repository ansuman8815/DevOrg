({
	handleEvent : function(component, event, helper) {
        var item = event.getParam("SelOp");
        component.set("v.SelectedOption", item);
        
        //var patientId = "{!$CurrentPage.parameters.recId}";
        //var selected = component.find("sel").get("v.value");
        
       //component.set("v.SelectedOption", selected);
     
        var evntVar = $A.get("e.c:ClinicalSummarySelectOptionEvent");
        
        if(item == 'Allergies'){
        evntVar.setParams({"strQuery":'SELECT HealthCloudGA__Reaction255__c ,HealthCloudGA__StatusLabel__c,HealthCloudGA__CriticalityLabel__c, HealthCloudGA__SourceSystem__c, Source_System_MRN__c FROM HealthCloudGA__EhrAllergyIntolerance__c '});
        evntVar.setParams({"whereQuery":' WHERE HealthCloudGA__Account__c = :patientId' });
        evntVar.setParams({"lstFieldLabel":["Allergen" , "Status", "Criticality Label" , "Source System", "Source System MRN"]}); 
        evntVar.setParams({"headerLabel": 'Allergies'});
        evntVar.setParams({"pageName": 'Allergy'});
        evntVar.setParams({"patientId": patientId});
    	}
        
        else if(item == 'Patient Problem List'){
        evntVar.setParams({"strQuery":'SELECT HealthCloudGA__CodeLabel__c, HealthCloudGA__Code__c, HealthCloudGA__DateAsserted__c, HealthCloudGA__AbatementDetail255__c, HealthCloudGA__SourceSystem__c FROM HealthCloudGA__EhrCondition__c '});
        evntVar.setParams({"whereQuery":' WHERE HealthCloudGA__Account__c = :patientId AND Condition_Type__c = \'Patient Problem\' '});
        evntVar.setParams({"lstFieldLabel":["Name" , "Code", "Start Date" , "End Date", "Source"]}); 
        evntVar.setParams({"headerLabel": 'Patient Problem List'});
        evntVar.setParams({"pageName": 'Problem'}); 
        evntVar.setParams({"patientId": patientId});
        }
        
        else if(item == 'Medical History'){
        evntVar.setParams({"strQuery":'SELECT HealthCloudGA__CodeLabel__c, HealthCloudGA__Code__c, Condition_Date__c, HealthCloudGA__SourceSystem__c FROM HealthCloudGA__EhrCondition__c '});
        evntVar.setParams({"whereQuery":' WHERE HealthCloudGA__Account__c = :patientId AND Condition_Type__c = \'Medical History\' '});
        evntVar.setParams({"lstFieldLabel":["Description" , "Code", "Date" , "Source"]}); 
        evntVar.setParams({"headerLabel": 'Medical History'});
        evntVar.setParams({"pageName": 'MedicalHistory'}); 
        evntVar.setParams({"patientId": patientId});
            }
        
             
       
        
        /*Surgical Histories
        $Lightning.use("c:EHRClinicalSummaryApp", function() {
          $Lightning.createComponent(
              "c:dynamicRelatedList",
              {"strQuery" : 'SELECT Code_Label__c, Code__c, Date_Performed__c, Source_System__c FROM EHR_Procedure__c ',
               "whereQuery" : ' WHERE Patient__c = :patientId ',
               "lstFieldLabel" : ["Description" , "Code", "Date", "Source"],
               "patientId" : patientId,
               "recordLimit" : recordLimit,
               "headerLabel" : 'Surgical History',
               "pageName" : 'SurgicalHistory'
              },
              "surgDiv"
          );
        });  */
        
        else if(item == 'Medication'){
        evntVar.setParams({"strQuery":'SELECT HealthCloudGA__MedicationName__c, SIG__c, Route__c, Medication_Start_Date__c, Medication_End_Date__c, HealthCloudGA__SourceSystem__c, HealthCloudGA__DispenseQuantityValue__c, HealthCloudGA__DispenseNumberOfRepeatAllowed__c FROM HealthCloudGA__EhrMedicationPrescription__c '});
        evntVar.setParams({"whereQuery":' WHERE HealthCloudGA__Account__c = :patientId '});
        evntVar.setParams({"lstFieldLabel":["Name" , "SIG", "Route" , "Start Date", "End Date", "Source", "Quantity", "Refill"]}); 
        evntVar.setParams({"headerLabel": 'Medication'});
        evntVar.setParams({"pageName": 'Medication'});
            evntVar.setParams({"patientId": patientId});
            //evntVar.setParams({"patientId": 'Medication'});
            //evntVar.setParams({"recordLimit": 'Medication'});
            }
        
        else if(item == 'Immunization'){
        evntVar.setParams({"strQuery":'SELECT HealthCloudGA__VaccineTypeLabel__c, HealthCloudGA__DateAdministered__c, HealthCloudGA__VaccineTypeCode__c, HealthCloudGA__DoseQuantityValue__c, HealthCloudGA__SiteLabel__c, HealthCloudGA__RouteLabel__c, HealthCloudGA__SourceSystem__c FROM HealthCloudGA__EhrImmunization__c  '});
        evntVar.setParams({"whereQuery":' WHERE HealthCloudGA__Account__c = :patientId '});
        evntVar.setParams({"lstFieldLabel":["Name", "Date" , "Type", "Dose", "Site", "Route", "Source"]}); 
        evntVar.setParams({"headerLabel": 'Immunization'});
        evntVar.setParams({"pageName": 'Immunization'}); 
            evntVar.setParams({"patientId": patientId});
            }
        
        else if(item == 'Surgical History'){
        evntVar.setParams({"strQuery":'SELECT Code_Label__c, Code__c, Date_Performed__c, Source_System__c FROM EHR_Procedure__c '});
        evntVar.setParams({"whereQuery":' WHERE Patient__c = :patientId '});
        evntVar.setParams({"lstFieldLabel":["Description" , "Code", "Date", "Source"]}); 
        evntVar.setParams({"headerLabel": 'Surgical History'});
        evntVar.setParams({"pageName": 'SurgicalHistory'}); 
            evntVar.setParams({"patientId": patientId});
            }
        
        
        
        evntVar.fire();
        
        
        
         //helper.loadSobjects(component);
    }
})