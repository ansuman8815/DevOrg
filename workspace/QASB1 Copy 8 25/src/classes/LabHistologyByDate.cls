global class LabHistologyByDate Implements Database.Batchable<sObject> {

    global Database.QueryLocator start(Database.BatchableContext BC){
        String query = 'SELECT Id, HealthCloudGA__ValuePeriodStartDate__c FROM HealthCloudGA__EhrObservation__c LIMIT 50000000';
        return Database.getQueryLocator(query);
    }
    
    global void execute(Database.BatchableContext BC, List<HealthCloudGA__EhrObservation__c> lstLabs) {
        
        LabCount__c labCounts = new LabCount__c(
            JobId__c = String.valueOf(BC.getJobId()), 
            ChildJobId__c = String.valueOf(BC.getChildJobId()),
            Ctr3mos__c = 0,
            Ctr6mos__c = 0,
            Ctr9mos__c = 0,
            Ctr12mos__c = 0,
            Ctr15mos__c = 0,
            Ctr18mos__c = 0,
            Ctr21mos__c = 0,
            Ctr24mos__c = 0,
            Ctr27mos__c = 0,
            Ctr30mos__c = 0,
            Ctr33mos__c = 0,
            Ctr36mos__c = 0,
            CtrOlder__c = 0
        );
 
        DateTime current = DateTime.now();
        DateTime dt3mos = current.addMonths(-3);
        DateTime dt6mos = current.addMonths(-6);
        DateTime dt9mos = current.addMonths(-9);
        DateTime dt12mos = current.addMonths(-12);
        DateTime dt15mos = current.addMonths(-15);
        DateTime dt18mos = current.addMonths(-18);
        DateTime dt21mos = current.addMonths(-21);
        DateTime dt24mos = current.addMonths(-24);
        DateTime dt27mos = current.addMonths(-27);
        DateTime dt30mos = current.addMonths(-30);
        DateTime dt33mos = current.addMonths(-33);
        DateTime dt36mos = current.addMonths(-36);
        
        for(HealthCloudGA__EhrObservation__c obs : lstLabs) {
            if (obs.HealthCloudGA__ValuePeriodStartDate__c > dt3mos) {
                // within 3 mos.  Add to the Ctr3mos variable:
                labCounts.Ctr3mos__c++;
            }
            else if (obs.HealthCloudGA__ValuePeriodStartDate__c > dt6mos) {
                labCounts.Ctr6mos__c++;
            }
            else if (obs.HealthCloudGA__ValuePeriodStartDate__c > dt9mos) {
                labCounts.Ctr9mos__c++;
            }
            else if (obs.HealthCloudGA__ValuePeriodStartDate__c > dt12mos) {
                labCounts.Ctr12mos__c++;
            }
            else if (obs.HealthCloudGA__ValuePeriodStartDate__c > dt15mos) {
                labCounts.Ctr15mos__c++;
            }
            else if (obs.HealthCloudGA__ValuePeriodStartDate__c > dt18mos) {
                labCounts.Ctr18mos__c++;
            }
            else if (obs.HealthCloudGA__ValuePeriodStartDate__c > dt21mos) {
                labCounts.Ctr21mos__c++;
            }
            else if (obs.HealthCloudGA__ValuePeriodStartDate__c > dt24mos) {
                labCounts.Ctr24mos__c++;
            }
            else if (obs.HealthCloudGA__ValuePeriodStartDate__c > dt27mos) {
                labCounts.Ctr27mos__c++;
            }
            else if (obs.HealthCloudGA__ValuePeriodStartDate__c > dt30mos) {
                labCounts.Ctr30mos__c++;
            }
            else if (obs.HealthCloudGA__ValuePeriodStartDate__c > dt33mos) {
                labCounts.Ctr33mos__c++;
            }
            else if (obs.HealthCloudGA__ValuePeriodStartDate__c > dt36mos) {
                labCounts.Ctr36mos__c++;
            }
            else {
                labCounts.CtrOlder__c++;
            }
                    
        }
        insert labCounts;
    }
    
    global void finish(Database.BatchableContext BC) {
        
    }
    
}