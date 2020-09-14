// Purpose - This file contains all the logic relevant to the extension such as getting the URL, calling the server
// side clientServer.php which then calls the core logic.

function transfer(){	
	var tablink;
	chrome.tabs.getSelected(null,function(tab) {
	   	tablink = tab.url;
		var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //$("#p1").text("The URL being tested is - "+tablink);
		var server = JSON.parse(this.responseText)
		$("#div1").text(server.decision);
    }
  };
  xhttp.open("GET", "http://localhost:5000/test/" + tablink, true);
  xhttp.send();
		// Uncomment this line if you see some error on the extension to see the full error message for debugging.
		
		
		return xhttp.responseText;
	});
}


$(document).ready(function(){
    $("button").click(function(){	
		var val = transfer();
    });
});


