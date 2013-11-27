/**
 * Called when the document is loaded.
 */
$(document).ready(function(e) {

    /*
     * Get all needed Information.
     */
    var yearSelect = document.getElementById("chooseHltwSelect");
    var yearValid = yearSelect.options[yearSelect.selectedIndex].value;

    // alert(yearValid);

    var editProviderSelect = document.getElementById("providerEditSelect");
    var providerNameStr = editProviderSelect.options[editProviderSelect.selectedIndex].value;

    $.ajax({
	type : "POST",
	url : "server.php",
	data : {
	    method : "getHLZF",
	    provider : providerNameStr,
	    year : yearValid
	},
	success : function(data) {

	    /*
	     * If ready, process the date (containing the response from the query!)
	     */
	    alert(data);
	    var status = JSON.parse(data);
	    alert(status);

	    document.getElementById("createHltwOKStatus").style.visibility = "visible";

	    // if (status) {
	    // // alert("alles OK!");
	    // document.getElementById("createHltwOKStatus").innerHTML = "Betreiber hinzugef&uuml;gt!";
	    // document.getElementById("createHltwOKStatus").style.backgroundColor = "#77CE63";
	    // } else {
	    // // alert("Fehler!");
	    // document.getElementById("createHltwOKStatus").innerHTML = "Fehler bei DB!";
	    // document.getElementById("createHltwOKStatus").style.backgroundColor = "#E05C5C";
	    // }

	}
    });

    $("button#confirmButton").click(function() {

	/*
	 * First, check if everything is ok!
	 */
	var everythingOk = true;
	var seasonsContained = new Array(false, false, false, false);

	var table = document.getElementById("hltwTable");

	/*
	 * Check, if every season was used at least once!
	 */
	for (var i = 1; i < table.rows.length; i++) {

	    // work with season-index, because
	    // "Frühling" will cause the string
	    // not to be tested correctly!
	    var seasonIndex = table.rows[i].cells[0].getElementsByTagName("select")[0].selectedIndex;

	    // first, check season
	    switch (seasonIndex) {
	    case 0:
		seasonsContained[0] = true;
		break;
	    case 1:
		seasonsContained[1] = true;
		break;
	    case 2:
		seasonsContained[2] = true;
		break;
	    case 3:
		seasonsContained[3] = true;
		break;
	    default:
		break;
	    }
	}

	// check, if every season was found!
	for (var j = 0; j < seasonsContained.length; j++) {
	    if (seasonsContained[j] == false) {
		everythingOk = false;
		break;
	    }
	}

	// now mark the seasons red, if
	// there were not all used!
	for (var j = 1; j < table.rows.length; j++) {
	    if (!everythingOk) {
		// red
		table.rows[j].cells[0].getElementsByTagName("select")[0].style.backgroundColor = "#E05C5C";
	    } else {
		// green (for reset)
		table.rows[j].cells[0].getElementsByTagName("select")[0].style.backgroundColor = "#77CE63";
	    }
	}

	// Check if the times are plausible
	// (begin-time >= end-time.
	// Jump over 0, this is the header, and
	// continue with all others.
	for (var i = 1; i < table.rows.length; i++) {

	    // work with season-index, because
	    // "Frühling" will cause the string
	    // not to be tested correctly!
	    var seasonIndex = table.rows[i].cells[0].getElementsByTagName("select")[0].selectedIndex;

	    // check time
	    var beginTime = table.rows[i].cells[1].getElementsByTagName("input")[0].value.split(":");
	    var endTime = table.rows[i].cells[2].getElementsByTagName("input")[0].value.split(":");

	    if (parseInt(beginTime[0]) > parseInt(endTime[0])) {
		table.rows[i].cells[1].getElementsByTagName("input")[0].style.backgroundColor = "#E05C5C";
		table.rows[i].cells[2].getElementsByTagName("input")[0].style.backgroundColor = "#E05C5C";
	    } else if (parseInt(beginTime[0]) == parseInt(endTime[0]) && parseInt(beginTime[1]) >= parseInt(endTime[1])) {
		table.rows[i].cells[1].getElementsByTagName("input")[0].style.backgroundColor = "#E05C5C";
		table.rows[i].cells[2].getElementsByTagName("input")[0].style.backgroundColor = "#E05C5C";
	    } else {
		table.rows[i].cells[1].getElementsByTagName("input")[0].style.backgroundColor = "#77CE63";
		table.rows[i].cells[2].getElementsByTagName("input")[0].style.backgroundColor = "#77CE63";
	    }

	}

	// for debugging
	everythingOk = true;

	if (everythingOk == true) {

	    var editProviderSelect = document.getElementById("providerEditSelect");
	    var ProviderNameStr = editProviderSelect.options[editProviderSelect.selectedIndex].value;

	    var yearValid = document.getElementById("yearInput")[0].value;
	    alert(yearValid);

	    /*
	     * now create the hltwProcessed; containing all time-Windows and all seasons!
	     */
	    var hltwProcessed = {
		"Hello" : "World"
	    };

	    var hltwProcessedJSON = JSON.stringify(hltwProcessed);

	    // var hltwProcessed = "Test";

	    // inster into DB!
	    $.ajax({
		type : "POST",
		url : "server.php",
		data : {
		    method : "addHltw",
		    hltw : hltwProcessedJSON,
		    year : yearValid,
		    provider : ProviderNameStr
		},
		success : function(data) {

		    /*
		     * If ready, process the date (containing the response from the query!)
		     */
		    // alert(data);
		    var status = JSON.parse(data);
		    // alert(status);

		    document.getElementById("createHltwOKStatus").style.visibility = "visible";

		    // if (status) {
		    // // alert("alles OK!");
		    // document.getElementById("createHltwOKStatus").innerHTML = "Betreiber hinzugef&uuml;gt!";
		    // document.getElementById("createHltwOKStatus").style.backgroundColor = "#77CE63";
		    // } else {
		    // // alert("Fehler!");
		    // document.getElementById("createHltwOKStatus").innerHTML = "Fehler bei DB!";
		    // document.getElementById("createHltwOKStatus").style.backgroundColor = "#E05C5C";
		    // }

		}
	    });
	    loadHltws();
	}

    });

    $("button#addTimeWindow").click(function() {

	addRow();

    });

    function addRow() {

	var table = document.getElementById("hltwTable");

	var newRow = table.insertRow(table.rows.length);

	var seasonCell = newRow.insertCell(0);
	var beginTimeCell = newRow.insertCell(1);
	var endTimeCell = newRow.insertCell(2);

	seasonCell.innerHTML = "<select id=\"seasonSelect\"><option>Fr&uuml;hling</option><option>Sommer</option><option>Herbst</option><option>Winter</option></select>";
	beginTimeCell.innerHTML = "<td><input id=\"beginTime\" type=\"time\" value=\"12:00\" step=\"900\" onchange=\" \"></td>";
	endTimeCell.innerHTML = "<td><input id=\"endTime\" type=\"time\" value=\"12:00\" step=\"900\" onchange=\" \"></td>";
    }

});