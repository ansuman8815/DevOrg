public with sharing  class PatientSearchController {

    @AuraEnabled
    public static List<Account> getSearchAccountData(String firstName , String lastName , String gender, String cinNo, string dob)    
    {
        system.debug('gender:' + gender);
        String fn = '%' + firstName + '%';
        String ln = '%' + lastName + '%';
        String gd;
        if(gender != null && gender.length() > 1)
            gd = gender.substring(0,1) + '%';
        else
            gd = gender + '%';
        //String cin =  '%' + cinNo + '%'; 
        String cin =  cinNo;
        date dateOfBirth;
        
        system.debug('dateOfBirth ' + dateOfBirth);
        
        String sWhereclause = '';
        String finalQuery = ' SELECT Id , Name, Last_Name__c, Date_of_Birth__c, GenderLabel__c, Medicaid_CIN__c FROM Account ';
        
        if (firstName != null && firstName != '')
            sWhereclause = ' WHERE First_Name__c LIKE : fn ';
        if (lastName != null && lastName != ''){
            if(sWhereclause != null && sWhereclause != '')
                sWhereclause = sWhereclause + ' AND Last_Name__c like : ln ';
            else
                sWhereclause = ' WHERE Last_Name__c like : ln ';
        }
        if (cinNo != null && cinNo != ''){
            if(sWhereclause != null && sWhereclause != '')
                sWhereclause = sWhereclause + ' AND Medicaid_CIN__c like : cin ';
            else
                sWhereclause = ' WHERE Medicaid_CIN__c like : cin ';
        }
        
        if (gender != null && gender != ''){
            if(sWhereclause != null && sWhereclause != '')
                sWhereclause = sWhereclause + ' AND GenderLabel__c like : gd ';
            else
                sWhereclause = ' WHERE GenderLabel__c like : gd ';
        }
        if (dob != null && dob != ''){
            dateOfBirth = date.valueOf(dob);
            if(sWhereclause != null && sWhereclause != '')
                sWhereclause = sWhereclause + ' AND Date_of_Birth__c = : dateOfBirth ';
            else
                sWhereclause = ' WHERE Date_of_Birth__c = : dateOfBirth ';
        }
        
        finalQuery = finalQuery + sWhereclause;
        system.debug('gd ' + gd);
        system.debug('dob ' + dob);
        system.debug('final query ' + finalQuery);
        List<Account> accntList = Database.query(finalQuery);
        system.debug('Account fetched' + accntList);
        return accntList;
    }
}