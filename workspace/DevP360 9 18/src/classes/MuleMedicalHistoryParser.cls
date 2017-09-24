/**
@Author      :   Cognizant Technology Solutions
@name        :   MuleMedicalHistoryParser
@CreateDate  :   09/12/2017
@Description :   To Parse the Json Response for Medical History.
@Version     :   1.0
*/
public class MuleMedicalHistoryParser implements IFHIRParser {

	private String empi;
	List<Account> accts;

	public MuleMedicalHistoryParser() {
	}

	/**
	*  Description of the purpose of the class's method. 
	*  @name	:	parseResponse
	*  @param	:	1.theService	:	Captures the value for theService
					2.empi			:	Captures the value for empi
					3.selectedId	:	Captures the value for encounterId
					4.json			:	Captures the json value					
					5.fqResults		:	Captures the fqResults object	
					6.observations	:	Captures the condition object	
	*  @purpose :	To parse the json response.
	*/
	public void parseResponse(String theService, String empi,String selectedId,String json, FHIRQueryResults fqResults, List<SObject> sObjectData) {

	this.empi = empi;
	
	Integer start = 0;
	Integer newStart = 0;
	Integer strEnd = 0;
	
	accts = PatientUtil.getRelatedAccountsByEMPI(empi);
	System.debug('accts'+accts);	
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
		
		String medicalHistory= json.substring(newStart, strEnd);
		processMedicalHistory(medicalHistory, sObjectData);
		
		start = newStart + 20;
		
		Integer myTime = Limits.getCpuTime();
		if (myTime > 9500) {
			fqResults.addError(theService, 'CPU', 'ERROR', 'Apex CPU time limit exceeded');
			throw new CPUTimeException('Apex CPU time: ' + myTime);
		}
	}
	return;
	}
    
	/**
	*  Description of the purpose of the class's method. 
	*  @name	:	processMedicalHistory
	*  @param	:	1.medical				:	Captures the value for medical
					2.medicalHistory		:	Captures the value for list of ehrCondition
	*  @purpose :	To process the json response.
	*/
	private void processMedicalHistory(String medical, List<HealthCloudGA__EhrCondition__c> medicalHistory) {
	Integer codeOffset;
	String sourceSystem;
	String medicalName;
	String codingCode;
	String codingSystem;
	String assertedDate;
	String mrn;
    List<String> mrnum;
	String description;
    String sourceSystemId;
    
    sourceSystemId  =   UtilityGeneral.getSourceVal(medical,'','','id":',0);
    sourceSystem    =   UtilityGeneral.getSourceVal(medical,'identifier":','assigner":','reference":',0);
    mrn             =   UtilityGeneral.getSourceVal(medical,'','subject":','reference":',0);
    if(!String.isEmpty(mrn))
        mrnum = mrn.split('/');
    mrn=mrnum[1];
    codeOffset      =   medical.indexOf('"code": {');

    if (codeOffset > 0) {    
    		medicalName =   UtilityGeneral.getSourceVal(medical,'','code":','text":',codeOffset);
    		codingCode  =   UtilityGeneral.getSourceVal(medical,'code":','coding":','code":',codeOffset);
    		codingSystem=   UtilityGeneral.getSourceVal(medical,'code":','coding":','system":',codeOffset);
    		assertedDate=   UtilityGeneral.getSourceVal(medical,'','','assertedDate":',codeOffset);
    		description =   UtilityGeneral.getSourceVal(medical,'code":','coding":','display":',codeOffset);
            
            HealthCloudGA__EhrCondition__c ehrCondition=new HealthCloudGA__EhrCondition__c();
            if(!String.isEmpty(sourceSystem) && !String.isEmpty(mrn))
                ehrCondition.HealthCloudGA__Account__c      =   getAccount(sourceSystem,mrn);
            ehrCondition.HealthCloudGA__CodeLabel__c        =   description;
            ehrCondition.HealthCloudGA__Code__c             =   codingCode;
            ehrCondition.Condition_Date__c                  =   assertedDate;
            ehrCondition.HealthCloudGA__SourceSystem__c     =   sourceSystem;
            ehrCondition.HealthCloudGA__CodeSystem__c       =   codingSystem;
            ehrCondition.Condition_Type__c                  =   'Medical History';
            ehrCondition.HealthCloudGA__SourceSystemId__c   =   sourceSystemId;
            medicalHistory.add(ehrCondition);
        }
	}
  
	/**
	*  Description of the purpose of the class's method. 
	*  @name	:	getAccount
	*  @param	:	1.sourceSystem	:	Captures the sourceSytem value
					2.mrn			:	Captures the mrn value 
	*  @return	:	Id
	*  @purpose :	To get account for response mrn.
	*/
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
}