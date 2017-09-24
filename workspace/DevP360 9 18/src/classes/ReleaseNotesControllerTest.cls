/**
	@Author      :	Cognizant Technology Solutions
	@name        :	ReleaseNotesControllerTest
	@CreateDate  :	4/19/2017  
	@Description :  Test Class to validate display the P360 Release Notes document on UI
	@Version     :	1.0
*/
@isTest
public class ReleaseNotesControllerTest {
    static testMethod void validategetReleaseNoteUrl() {
    	List<Folder> lstFolder = [select id from folder where name = 'Shared Documents'];
        if(lstFolder.size()>0){
            Document doc = new Document();
            doc.Body = Blob.valueOf('/services/data/v39.0/sobjects/Document/01563000000E3mkAAC/Body');
            doc.ContentType = 'application/pdf';
            doc.DeveloperName = 'Shradha';
            doc.IsPublic = true;
            doc.Name = 'Patient360AnnouncementsPage'; 
            doc.FolderId = lstFolder[0].id;
            insert doc;
            String docId = doc.Id;
            String  strDocId=string.valueof(doc.Id).substring(0, 15);
            test.startTest(); 
            string url = ReleaseNotesController.getReleaseNoteUrl();
            test.stopTest();
            System.assertEquals(url.contains(strDocId), true);
            
        }
	}
}