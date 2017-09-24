public class BehavioralHealthEncounters {

    public static void getEncounters() {
    	List<Dx_Master__c> dxCodes = [SELECT Code__c FROM Dx_Master__c];
    	System.debug('Got ' + dxCodes.size() + ' codes');
    }
}