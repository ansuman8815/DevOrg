public without sharing class ReleaseNotesController {
    
    @AuraEnabled public static String getReleaseNoteUrl ()
    {
        String label = System.Label.P360CommunityReleaseNoteDocumentName; 
        String docId=null,url=null,DocumentId=null,urlId=null;
        System.debug('Custom Label'+label);
        List <Document> doc=[SELECT Id, Name FROM Document where Name=:label limit 1];
        if (doc != null && doc.size()>0)
        {
            docId = doc[0].Id;
            url = System.Label.P360CommunityDocumentURL; 
            DocumentId=docId.substring(0, 15);
            System.debug('Document Id '+ DocumentId);     
        }
        urlId=url + DocumentId;
        System.debug('URL' +urlId);
        return urlId;
    }
}