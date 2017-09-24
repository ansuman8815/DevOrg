/**
	@Author      :	Cognizant Technology Solutions
	@name        :	ReleaseNotesController
	@CreateDate  :	4/13/2017
	@Description :	All display the P360 Release Notes document on Ui
	@Version     :  1.0
*/
public without sharing class ReleaseNotesController {
    
    /**
	*  Description of the purpose of the class's method. 
	*  @name	:	getReleaseNoteUrl
	*  @return  :	String i.e return the document id with url
	*  @purpose :	To fetch documentId and url to display P360 Release note on Ui.
	*/
    @AuraEnabled 
    public static String getReleaseNoteUrl(){
    	String label = System.Label.P360CommunityReleaseNoteDocumentName; 
        String docId=null,url=null,DocumentId=null,urlId=null;
        List <Document> doc=[SELECT Id, Name FROM Document where Name=:label limit 1];
        if (doc != null && doc.size()>0)
        {
            docId = doc[0].Id;
            url = System.Label.P360CommunityDocumentURL; 
            DocumentId=docId.substring(0, 15);
        }
        urlId=url + DocumentId;
        return urlId;
    }
}