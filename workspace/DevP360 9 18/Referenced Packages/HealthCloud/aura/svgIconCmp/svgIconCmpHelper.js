({
    setSVG: function(component) {
        var xmlns = "http://www.w3.org/2000/svg";
        var svgElem = document.createElementNS(xmlns, "svg");
        var svgPath = component.get("v.svgPath");
        // W-3336231: We use only relative paths so to sanitize the URL we just need to make sure
        // it has a "/" prefix before using it.
        if (!$A.util.isUndefinedOrNull(svgPath) && svgPath.charAt(0) !== "/") {
            svgPath = "/" + svgPath;
        }
        svgElem.setAttributeNS(null, "class", component.get("v.class"));
        svgElem.setAttributeNS(null, "style", component.get("v.style"));
        var useElem = document.createElementNS(xmlns, "use");
        useElem.setAttributeNS("http://www.w3.org/1999/xlink", "href", svgPath);
        svgElem.appendChild(useElem);
        var svg = component.find("svg_content");
        svg.getElement().appendChild(svgElem);
    }
})