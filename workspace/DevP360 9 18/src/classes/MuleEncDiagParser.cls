/**
@Author      :   Cognizant Technology Solutions
@name        :   MuleEncDiagParser
@CreateDate  :   9/8/2017
@Description :   The purpose of this class is to parse a JSON stream of Encounter Diagnosis.
@Version     :   1.0
*/
public class MuleEncDiagParser implements IFHIRParser {
    
    private String empi;
    List<Account> accts;
    List<HealthCloudGA__EhrEncounter__c> encounter;
    
    public MuleEncDiagParser() {
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
    public void parseResponse(String theService, String empi,String selectedId,String json, FHIRQueryResults fqResults, List<SObject> sObjectData) {
        
        this.empi = empi;
        
        Integer start = 0;
        Integer newStart = 0;
        Integer strEnd = 0;
        
        accts       =   PatientUtil.getRelatedAccountsByEMPI(empi);
        encounter   =   PatientUtil.getEncounterByEncID(selectedId);
        while (true) {
            
            newStart = json.indexOf(UtilityData.labelforRscTypeEnc, start);
            if (newStart == -1) {
                System.debug('done');
                break;
            }
            strEnd = json.indexOf(UtilityData.labelforRscTypeEnc, newStart + 1);
            if (strEnd == -1) {
                strEnd = json.length() - 1;
            }
            
            String encDiagnosis = json.substring(newStart, strEnd);
            processEncDiagnosis(encDiagnosis, sObjectData);
            
            start = newStart + 20;
            
            Integer myTime = Limits.getCpuTime();
            if (myTime > 9500) {
                fqResults.addError(theService, 'CPU', 'ERROR', 'Apex CPU time limit exceeded');
                throw new CPUTimeException('Apex CPU time: ' + myTime);
            }
        }
        return;
    }
    
    private void processEncDiagnosis(String diag, List<HealthCloudGA__EhrCondition__c> encDiagnosis) {
        Integer codeOffset;
        String 	sourceSystem;
        String 	SourceSysID;
        String 	DiagName;
        String 	codingCode;
        String 	codingSystem;
        String 	EncounterId;
        String 	mrn;
        
        SourceSysID     =   UtilityGeneral.getSourceVal(diag,'','','id":',0);
        sourceSystem    =   UtilityGeneral.getSourceVal(diag,'identifier":','assigner":','reference":',0);
        mrn             =   UtilityGeneral.getSourceVal(diag,'','subject":','reference":',0);
        EncounterId     =   UtilityGeneral.getSourceVal(diag,'','context":','reference":',0);
        
        codeOffset = diag.indexOf('"context": {');
        if(codeOffset > 0){
            DiagName    =   UtilityGeneral.getSourceVal(diag,'','code":','text":',codeOffset);
            codingCode  =   UtilityGeneral.getSourceVal(diag,'code":','coding":','code":',codeOffset);
            codingSystem=   UtilityGeneral.getSourceVal(diag,'code":','coding":','system":',codeOffset);      
        }
        
        system.debug('Encounter'+encounter);
        HealthCloudGA__EhrCondition__c ehrCond = new HealthCloudGA__EhrCondition__c();
        ehrCond.HealthCloudGA__Account__c           = getAccount(sourceSystem,mrn) == null ? '' : getAccount(sourceSystem,mrn);
        ehrCond.HealthCloudGA__SourceSystem__c      = sourceSystem;
        ehrCond.HealthCloudGA__SourceSystemId__c    = SourceSysID;
        ehrCond.HealthCloudGA__Code__c              = codingCode;
        ehrCond.HealthCloudGA__CodeSystem__c        = codingSystem;
		ehrCond.HealthCloudGA__Encounter__c         = getEncounter(sourceSystem,EncounterId) == null ? '' : getEncounter(sourceSystem,EncounterId);
        ehrCond.HealthCloudGA__CodeLabel__c         = DiagName;
        ehrCond.Condition_Type__c                   = 'Encounter Diagnosis';
        encDiagnosis.add(ehrCond);
    }
    
    private Id getAccount(String sourceSystem, String mrn) {
        for(Account acct : this.accts) {
            if(acct.HealthCloudGA__SourceSystem__c.compareTo(sourceSystem) ==0) {
                if(acct.HealthCloudGA__MedicalRecordNumber__c.compareTo(mrn) == 0) {
                    return acct.Id;
                }
            }
        }
        return (Id)null;
    }
    
    
    private Id getEncounter(String sourceSystem, String EncounterId) {
        for(HealthCloudGA__EhrEncounter__c encounterObj : this.encounter) {
            if(encounterObj.HealthCloudGA__SourceSystem__c.compareTo(sourceSystem) ==0) {
                if(encounterObj.Encounter_ID__c.compareTo(EncounterId) == 0) {
                    return encounterObj.Id;
                }
            }
        }
        return (Id)null;
    }
}