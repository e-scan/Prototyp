/**
 * Called when the Button to add a Provider is pressed. Changes the "createProviderOKStatus"-Label to give the user a feedback!
 */
$("button#createProviderOK").click(function() {

    var strProviderName = document.getElementById('providerName').value;
    // alert(strProviderName);

    $.ajax({
	type : "POST",
	url : "server.php",
	data : {
	    providerName : strProviderName,
	    method : "addProvider"
	},
	success : function(data) {

	    /*
	     * If ready, process the date (containing the response from the query!)
	     */
	    var status = JSON.parse(data);

	    document.getElementById("createProviderOKStatus").style.visibility = "visible";

	    if (status) {
		// alert("alles OK!");
		document.getElementById("createProviderOKStatus").innerHTML = "Betreiber hinzugef&uuml;gt!";
		document.getElementById("createProviderOKStatus").style.backgroundColor = "#77CE63";
	    } else {
		// alert("Fehler!");
		document.getElementById("createProviderOKStatus").innerHTML = "Fehler!";
		document.getElementById("createProviderOKStatus").style.backgroundColor = "#E05C5C";
	    }

	}
    });

});