(function() {
  
  // Calculate size of available space and set it as height of iframe
  function resizeIframe() {
    var iframe = document.getElementsByTagName("iframe")[0];
    var header = document.getElementById("AppBodyHeader");
    var footer = document.querySelectorAll("div.bPageFooter")[0];
    var borderTop = 3;
    
    var iframeHeight = getWindowHeight() -
      header.offsetHeight - footer.offsetHeight - borderTop;
    
    iframe.style.height = iframeHeight + "px";
  }
  
  var timeoutId;
  
  // Wrapper to avoid calling resizeIframe too many times during one resize
  function resizeTimeout() {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(resizeIframe,50);
  }
  
  // Remove paddings and borders from around the iframe
  function tweakCss() {
    var iframe = document.getElementsByTagName("iframe")[0];
    var parent = iframe.parentNode;
    
    parent.style.padding = 0;
    
    while(parent.nodeName != "TABLE")
      parent = parent.parentNode;
    
    parent.style.padding = 0;
  }
  
  function getWindowHeight() {
    var height = 0;
    
    if(typeof(window.innerWidth ) == 'number' ) {
      //Non-IE
      height = window.innerHeight;
    } else if(document.documentElement &&
              document.documentElement.clientHeight) {
      //IE 6+ in 'standards compliant mode'
      height = document.documentElement.clientHeight;
    } else if( document.body && document.body.clientHeight) {
      //IE quirks mode
      height = document.body.clientHeight;
    }
    
    return height;
  }
  
  // Cross-browser element.addEventListener
  function listen(evnt,elem,func) {
    if(elem.addEventListener) // W3C DOM
      elem.addEventListener(evnt,func,false);
    else if(elem.attachEvent) // IE DOM
      elem.attachEvent("on"+evnt, func);
  }
  
  // Fire tweakCss on window.load
  listen("load",window,tweakCss);
  listen("load",window,resizeIframe);
  // Fire resizeIframe on window.resize
  listen("resize",window,resizeTimeout);
  
})();


