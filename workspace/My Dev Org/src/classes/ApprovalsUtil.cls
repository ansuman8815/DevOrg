/*
* Developed by Timba Software Corp. www.timbasoftware.com admin@timbasoftware.com
*/

/**
* Utility class that contains commonly used methods and constants
* @author Guillermo Lacordelle
*/ 
public class ApprovalsUtil
{
    public static Boolean isTest = false;
    /**
    * @return the users browser name
    */
    public static String getBrowserName()
    {
        String userAgent = ApexPages.currentPage().getHeaders().get('User-Agent');
        if (userAgent.contains('iPhone'))
            return 'iPhone-Safari';
        if (userAgent.contains('Salesforce'))
            return 'Salesforce';
        if (userAgent.contains('BlackBerry'))
            return 'BlackBerry';
        return 'other';
    }
    

    /**
    * @return the domain name
    */
    public static String getDomain()
    {
        // Didn't find a better way of getting the domain.
        // ApexPages.currentPage().getUrl() didn't seem to work.
        return ApexPages.currentPage().getHeaders().get('Host');    
    }
    
    
    /**
    * @param s the string to transform.
    * @return s if s is not null, '' otherwise.
    */
    public static String strValue(String s)
    {
        return (s == null ? '' : s);
    }
    
    
    /**
    * Utility method to make an HTTP request.
    * @param endpoint the request endpoint.
    * @param method the request method.
    * @param cookie the request cookie.
    * @return the http response.
    */
    public static HttpResponse doGetRequest(String endpoint, String cookie)
    {
            HttpRequest req = new HttpRequest();
            req.setEndpoint(endpoint);
            req.setMethod('GET');
            req.setHeader('Cookie', cookie == null ? '' : cookie);
            if (isTest)
            {
                return new HttpResponse();
            }
            else
                return (new Http()).send(req);
                
    }
    
    
    public static final String ENCODING = 'UTF-8';  
    
    /**
    * Utility method to transform a string to its UTF-8 url-encoded version.
    * @param input the input string to transfrom.
    * @return the url-encoded string
    */
    public static String encode(String input)
    {
        return EncodingUtil.urlEncode(strValue(input), ENCODING);
    }
    
    
    /**
    * Utility method to do pattern mathcing.
    * @param str the input string to match against the pattern
    * @param pattStr the pattern string.
    * @return the matcher object
    */
    public static String getMatch(String str, String pattStr, Integer groupNum)
    {
        try
        {
            Pattern patt = Pattern.compile(pattStr); 
            Matcher pattMatcher = patt.matcher(str);
            pattMatcher.find();
            String result = pattMatcher.group(groupNum);
            return result;
        }
        catch (System.StringException e)
        {
            return '';
        }
    }
    
    
    public static String bound(String str, String lowerBound, String upperBound)
    {
        return boundUpper(boundLower(str, lowerBound), upperBound);
    }
    
    
    /**
    * @param str the string to bound
    * @param lowerBound de lower bound.
    * @return the substring of str that starts after the first ocurrence of lowerBound 
    */
    public static String boundLower(String str, String lowerBound)
    {
        String boundedString = str;
        Integer lowerLimit = boundedString.indexOf(lowerBound);
        if (lowerLimit > 0)
            boundedString = boundedString.substring(lowerLimit + lowerBound.length());
        return boundedString;   
    } 
    
    
    /**
    * @param str the string to bound
    * @param upperBound de upper bound.
    * @return the substring of str that ends before the first ocurrence of upperBound 
    */
    public static String boundUpper(String str, String upperBound)
    {
        String boundedString = str;
        Integer upperLimit = boundedString.indexOf(upperBound);
        if (upperLimit > 0)
            boundedString = boundedString.substring(0, upperLimit);
        return boundedString;   
    } 
    
    /**
     * Check whether the user comes from a specific webpage to avoid CSRF attacks. Assumes that the caller page is XSS free
     * A better implementation would be possible if an apex session mechanism was implemented. 
     * @param PageReference caller The webpage from where the user must come from
     * @return Boolean True only if there is no Referer header or not coming from the specified webpage.
     * @author Guillermo Freire<guillermo.freire@gmail.com>
     */
     public static Boolean isCSRF(PageReference caller){
        System.debug('--isTest--'+isTest);
        if(isTest){
            return false;
        }
        
        Map<String,String> headers = System.currentPageReference().getHeaders();
        System.debug('--headers--'+headers);
        if(!headers.containsKey('Referer')){            
            return true;
        }       
        String referer = headers.get('Referer').toLowerCase();
        
        String curPage = System.currentPageReference().getUrl().toLowerCase().replaceFirst('/apex/.+?__','/apex/');     
        curPage = curPage.substring(0, curPage.indexOf('?'));
        System.debug('--curPage--'+curPage);
        
        String domain = ApprovalsUtil.getDomain().toLowerCase();
        System.debug('--domain--'+domain);
        
        String regex; 
        String callerUrl;
        
        if (caller == null){
            regex = '^https?://'+domain+curPage+'(\\?.*)?$';
        }
        else{
            callerUrl = caller.getUrl().toLowerCase().replaceFirst('/apex/.+?__','/apex/');
            regex = '^https?://'+domain+'(('+callerUrl+')|('+curPage+'))(\\?.*)?$';
        }       

        Pattern urlPattern = Pattern.compile(regex);
        System.debug('--urlPattern--'+ urlPattern);
        Matcher finder = urlPattern.matcher(referer);
        System.debug('--urlPattern--'+ finder);
        
        System.debug('--finder.matches()--'+ !finder.matches());
        
        return !finder.matches();   
    }
    
    public static string getGoogleMapsKey(){
    
        /*string domain = ApprovalsUtil.getDomain();
        
        if(domain == 'c.na1.visual.force.com'){
            return 'ABQIAAAAg8vXS5j2GDyVng-4Fo2MqxQ75BL4SlgOt6kyUW2Dew0q0VzSVxTr7WOrMeTzgEuzTsEKROuvrlShxA';
        }
        else if (domain == 'proximitysearch.na6.visual.force.com'){
            return 'ABQIAAAAg8vXS5j2GDyVng-4Fo2MqxSuYVD9BChwjlArfZVU7eONxkYGGRQ06dydxYxtnjVsgZcdEmiI5BpXAw';
        }*/ 
        return 'ABQIAAAAg8vXS5j2GDyVng-4Fo2MqxSaxC92qWpvsfLMnPYt2YVHzVh2whQ53ukTDrrLbVTAu7MMf-TMeKufTA';
    }
}