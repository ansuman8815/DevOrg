public class StringUtil {
    
    public static String getStrFromDate(Date theDate) {
        return String.valueOf(theDate.day()) + '-' + String.valueOf(theDate.month()) + '-' + String.valueOf(theDate.year());
    }
    
    public static String buildStdDateTime(String vDT) {
        // Processes a string that looks like this:  '19-01-16 10:43:00 AM'
        // Day first, then month, then 2-digit year.  Hours are < 13, and there's an AM/PM designator.
		String year = '20' + vDT.substring(6,8);
		String day = vDT.substring(0,2);
		String month = vDT.substring(3,5);
        
        // Hour may be 1 or 2 digits.  If character at position 10 (0-based) is a ':',
        //   then it's a single digit hour.  Need to accommodate offsets.
        Integer offsetStart;
        Integer offsetEnd;
        Integer ampmStart;
        String hour;
        
        offsetStart = 9;
        // ':' = 58
        if (vDT.charAt(10) == 58) {
            offsetEnd = 10;
            ampmStart = 17;
        } else {
            offsetEnd = 11;
            ampmStart = 18;
        }
        
        String ampm = vDT.substring(ampmStart,ampmStart + 2);
        
        if (ampm.equalsIgnoreCase('PM')) {
            // Need to convert hour
            Integer theHour = Integer.valueOf(vDT.substring(offsetStart,offsetEnd)) + 12;
            hour = String.valueOf(theHour);
        } else {
            hour = vDT.substring(offsetStart,offsetEnd);
        }
        
        offsetStart = offsetEnd + 1;
		
		String minute = vDT.substring(offsetStart,offsetStart + 2);
        offsetStart += 3;
		String second = vDT.substring(offsetStart,offsetStart + 2);

		String strDT = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
		return strDT;
    }
    
    public static DateTime getDTFromString(String vDT) {
        String newDT = buildStdDateTime(vDT);
        return DateTime.valueOf(newDT);
    }
    
    public static Date getDTFromMMDDYYYY(String dateString) {
        String month = dateString.substring(0,2);
        String day = dateString.substring(3,5);
        String year = dateString.substring(6,10);
        return Date.valueOf(year + '-' + month + '-' + day);
    }
    
    public static DateTime getDTFromDDMMYYYY(String dateString) {
        
        // Find the first '-'
        Integer firstHyphen = dateString.indexOf('-');
        // Find the second '-'
        Integer secondHyphen = dateString.indexOf('-', firstHyphen + 1);
        
        System.debug('first: ' + firstHyphen + '; second: ' + secondHyphen);
        
        String day = dateString.substring(0, firstHyphen);
        String month = dateString.substring(firstHyphen+1, secondHyphen);
        String year = dateString.substring(secondHyphen+1);
        
        System.debug('day: ' + day);
        System.debug('month: ' + month);
        System.debug('year: ' + year);

        return Date.valueOf(year + '-' + month + '-' + day);        
        //String month = dateString.substring(0,2);
        //String day = dateString.substring(3,5);
        //String year = dateString.substring(6,10);
        //return Date.valueOf(year + '-' + month + '-' + day);
    }
    
    public static Date getDateFromDDMMYYYY(String dateString) {
        
        // Find the first '-'
        Integer firstHyphen = dateString.indexOf('-');
        // Find the second '-'
        Integer secondHyphen = dateString.indexOf('-', firstHyphen + 1);
        
        System.debug('first: ' + firstHyphen + '; second: ' + secondHyphen);
        
        String day = dateString.substring(0, firstHyphen);
        String month = dateString.substring(firstHyphen+1, secondHyphen);
        String year = dateString.substring(secondHyphen+1);
        
        System.debug('day: ' + day);
        System.debug('month: ' + month);
        System.debug('year: ' + year);

        return Date.valueOf(year + '-' + month + '-' + day);    
    }

}