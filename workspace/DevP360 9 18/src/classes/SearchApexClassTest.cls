@istest
public class SearchApexClassTest {
static testMethod void validateSearchApexClass() {
     test.startTest();
     Id [] fixedSearchResults= new Id[1];
       fixedSearchResults[0] = '0036300000FKRFXAA5';
       SearchApexClass.findAll();
    List<List<SObject>> searchList = [FIND 'John' IN ALL FIELDS RETURNING Contact(ID,Name)];
    
     test.stopTest();
}
}