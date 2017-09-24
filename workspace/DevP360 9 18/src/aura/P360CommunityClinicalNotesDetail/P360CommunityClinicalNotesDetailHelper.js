({
	highlightHelperMethod : function(component, event, helper) {
		var text = component.find("searchText").get("v.value");
        var textContainer = $("#searchdiv");
        if(text != ""){
            var query =  new RegExp("("+text+")", "gim");
            var e = document.getElementById("searchdiv").innerText;
            var enew = e.replace(/(<span>|<\/span>)/igm, "");
            document.getElementById("searchdiv").innerHTML = enew;
            var newe = enew.replace(query, "<span>$1</span>");
            document.getElementById("searchdiv").innerHTML = newe;
        }
        else if(textContainer.find("span").length > 1){
            var tempText = document.getElementById("searchdiv").innerText;
            var newText = tempText.replace(/(<span>|<\/span>)/igm, "");                       
            document.getElementById("searchdiv").innerHTML = newText;
        }
	}
})