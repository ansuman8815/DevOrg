@isTest
public class CustomSearchControllerTest {
    public static testMethod void unitTestOne()
    {
        Test.startTest();
        String con ='{"inUserContext": false,"OpenSearchMetaData"	: true,"OpenObjectSchema":true}';
		String s = CustomSearchController.doIntSetup(con);
        CustomSearchController.StaticDataWrapper d = (CustomSearchController.StaticDataWrapper)JSON.deserialize(s, CustomSearchController.StaticDataWrapper.class);
    	CustomSearchController.searchRecord('test',d.fastQuery,con);
        CustomSearchController.getPrefixMap(con);
        CustomSearchController.getMetaObjectSet();
    	Test.stopTest();
	}	 

}