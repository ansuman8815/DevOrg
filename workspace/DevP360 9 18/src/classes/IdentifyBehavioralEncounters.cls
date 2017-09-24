global class IdentifyBehavioralEncounters implements Database.Batchable<sObject> {

    global final String query = 'SELECT Code__c FROM Dx_Master__c';
    global final String progRun;
    global final Integer intMonth;
    
    global IdentifyBehavioralEncounters(Integer iMonth, String programRun) {
        intMonth = iMonth;
        progRun = programRun;
    }
    
    global Database.QueryLocator start(Database.BatchableContext BC) {
        return Database.getQueryLocator(query);
    }
    
    global void execute(Database.BatchableContext BC, List<Dx_Master__c> diags) {
        
        //This is the list that we'll insert at the end of this method.
        List<Behavioral_Health_Encounters__c> bhVisitList = new List<Behavioral_Health_Encounters__c>();
        
        for(Dx_Master__c dx : diags) {
            // Generates the list of encounters that are from the selected Month:
            List<HealthCloudGA__EhrEncounter__c> visits = [SELECT Id, HealthCloudGA__PeriodStart__c FROM HealthCloudGA__EhrEncounter__c WHERE CALENDAR_MONTH(HealthCloudGA__PeriodStart__c) = :intMonth AND Id IN (SELECT HealthCloudGA__Encounter__c FROM HealthCloudGA__EhrCondition__c WHERE HealthCloudGA__Code__c = :dx.Code__c AND Hospital_Problem__c = true)];
            // Populate the BehavioralHealthEncounter table with these.
            for (HealthCloudGA__EhrEncounter__c visit : visits) {
                Behavioral_Health_Encounters__c bhe = new Behavioral_Health_Encounters__c(Encounter__c = visit.Id, Version__c = progRun);
                bhVisitList.add(bhe);
            }

        }
        
        insert bhVisitList;
        
    } 
    
    global void finish(Database.BatchableContext BC) {
        
    }

}