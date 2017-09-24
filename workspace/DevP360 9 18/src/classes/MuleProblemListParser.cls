public class MuleProblemListParser implements IFHIRParser
{
    private String empi;
    List<Account> accts;
    
    public MuleProblemListParser() {
    }
    
    /**
		*  Description of the purpose of the class's method. 
		*  @name	:	parseResponse
		*  @param	:	1.theService	:	Captures the value for theService
						2.empi			:	Captures the value for empi
						3.selectedId	:	Captures the value for encounterId
						4.json			:	Captures the json value					
						5.fqResults		:	Captures the fqResults object	
						6.observations	:	Captures the observations object	
		*  @purpose :	To parse the json response & store value in Ehr Condition object.
	*/
    public void parseResponse(String theService, String empi,String selectedId,String json,
                              FHIRQueryResults fqResults, List<SObject> sObjectData) {
        
        this.empi = empi;
        
        Integer start = 0;
        Integer newStart = 0;
        Integer strEnd = 0;
        
        accts = PatientUtil.getRelatedAccountsByEMPI(empi);
         while (true) {
            newStart = json.indexOf(UtilityData.labelforRscTypeProbList, start);
            if (newStart == -1) {
                System.debug('done');
                break;
            }
            strEnd = json.indexOf(UtilityData.labelforRscTypeProbList, newStart + 1);
            if (strEnd == -1) {
                strEnd = json.length() - 1;
            }
            
           	String problemList = json.substring(newStart, strEnd);
            processProblemList(problemList, sObjectData);
            
            start = newStart + 4;
            
            Integer myTime = Limits.getCpuTime();
            if (myTime > 9500) {
                fqResults.addError(theService, 'CPU', 'ERROR', 'Apex CPU time limit exceeded');
                throw new CPUTimeException('Apex CPU time: ' + myTime);
            }
        }
        return;
    }
    
    private void processProblemList(String problemList, List<HealthCloudGA__EhrCondition__c> sObjectData) {
       	Integer codeOffset;
        String 	description;         
        String 	code;
        String  codingSystem;
        Date 	startDate;
        String 	endDate;
        String 	sourceSysName;
        String 	sourceSysId;
        String 	problemListID;
        String 	patientID;
        
        sourceSysId   	= 	UtilityGeneral.getSourceVal(problemList,'','','id":',0);
        sourceSysName 	= 	UtilityGeneral.getSourceVal(problemList,'identifier":','assigner":','reference":',0);
        problemListID 	= 	UtilityGeneral.getSourceVal(problemList,'','identifier":','"value"',0);
        patientID     	=	UtilityGeneral.getSourceVal(problemList,'','subject":','reference":',0);
        
        codeOffset = problemList.indexOf('category": [');
        if(codeOffset > 0)
        {
            startDate 		= 	Date.parse(UtilityGeneral.getSourceVal(problemList,'onset":','onsetPeriod":','start":',codeOffset));
            endDate 		= 	UtilityGeneral.getSourceVal(problemList,'abatement":','abatementPeriod":','end":',codeOffset);
            description		=	UtilityGeneral.getSourceVal(problemList,'','code":','text":',codeOffset);
            code			=	UtilityGeneral.getSourceVal(problemList,'code":','coding":','code":',codeOffset);
            codingSystem	=	UtilityGeneral.getSourceVal(problemList,'code":','coding":','system":',codeOffset);
        }
        
        System.debug('sourceSysId ::'+sourceSysId);
        System.debug('sourceSysName ::'+sourceSysName);
        System.debug('problemListID ::'+problemListID);
        System.debug('patientID ::'+patientID);
        System.debug('startDate ::'+startDate);
        System.debug('endDate ::'+endDate);
        System.debug('description ::'+description);
        System.debug('code ::'+code);
        System.debug('codingSystem ::'+codingSystem);
 
       	HealthCloudGA__EhrCondition__c ehrCond 			= 	new HealthCloudGA__EhrCondition__c();
        ehrCond.HealthCloudGA__Account__c 				= 	getAccount(sourceSysName,patientID) == null ? '' : getAccount(sourceSysName,patientID);
        ehrCond.HealthCloudGA__SourceSystem__c  		= 	sourceSysName;
        ehrCond.HealthCloudGA__SourceSystemId__c		= 	sourceSysId;
        ehrCond.HealthCloudGA__Code__c 					= 	code;
        ehrCond.HealthCloudGA__CodeSystem__c 			= 	codingSystem;
        //ehrCond.HealthCloudGA__DateAsserted__c			= 	startDate;
        //ehrCond.HealthCloudGA__AbatementDetail255__c	=   endDate;
        ehrCond.Condition_Type__c                       =   'Patient Problem';
        ehrCond.HealthCloudGA__CodeLabel__c		    	= 	description;
        sObjectData.add(ehrCond);        
        System.debug('sourceSysId 2 ::'+ehrCond.HealthCloudGA__SourceSystemId__c);
        System.debug('sourceSysName 2 ::'+ehrCond.HealthCloudGA__SourceSystem__c);
        System.debug('problemListID 2::'+problemListID);
        System.debug('startDate 2 ::'+ehrCond.HealthCloudGA__DateAsserted__c);
        System.debug('endDate 2::'+ehrCond.HealthCloudGA__AbatementDetail255__c);
        System.debug('description 2::'+ehrCond.HealthCloudGA__CodeLabel__c	);
        System.debug('code 2::'+ehrCond.HealthCloudGA__Code__c);
        System.debug('codingSystem 2::'+ ehrCond.HealthCloudGA__CodeSystem__c);
    }
    
    private Id getAccount(String sourceSystem, String patientID) {
        for(Account acct : this.accts) {
            if(acct.HealthCloudGA__SourceSystem__c.compareTo(sourceSystem) ==0) {
                if(acct.HealthCloudGA__MedicalRecordNumber__c.compareTo(patientID) == 0) {
                    return acct.Id;
                }
            }
        }
        return (Id)null;
    }
}