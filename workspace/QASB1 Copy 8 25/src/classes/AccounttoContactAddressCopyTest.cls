@isTest
private class AccounttoContactAddressCopyTest{
    @isTest static void testMethod1(){
        //Create Account records using data factory
        List<Account> lstAccounts = TestDataFactory.createAccount(1);
        //Execute batch class with the above data
        Test.startTest();
        AccounttoContactAddressCopy newBatch = new AccounttoContactAddressCopy();
        Database.executeBatch(newBatch,200);
        Test.stopTest();
    }
}