/**
 * Called when the document is loaded.
 */
$(document).ready(function(e) {

    /*
     * add 4 rows; one for each season!
     */

    this.table = new Table("tableDiv");

    initTable();

    $("button#confirmButton").click(function() {
	saveInDB();
    });

    function saveInDB() {

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
		everythingOk = false;
	    } else if (parseInt(beginTime[0]) == parseInt(endTime[0]) && parseInt(beginTime[1]) >= parseInt(endTime[1])) {
		table.rows[i].cells[1].getElementsByTagName("input")[0].style.backgroundColor = "#E05C5C";
		table.rows[i].cells[2].getElementsByTagName("input")[0].style.backgroundColor = "#E05C5C";
		everythingOk = false;
	    } else {
		table.rows[i].cells[1].getElementsByTagName("input")[0].style.backgroundColor = "#FFFFFF";
		table.rows[i].cells[2].getElementsByTagName("input")[0].style.backgroundColor = "#FFFFFF";
	    }

	}

	// for debugging
	// everythingOk = true;

	alert(everythingOk);

	if (everythingOk) {

	    /*
	     * Get all needed Information.
	     */
	    var yearValid = document.getElementById("yearInput").value;

	    var editProviderSelect = document.getElementById("providerEditSelect");
	    var providerNameStr = editProviderSelect.options[editProviderSelect.selectedIndex].value;

	    /*
	     * now create the hltwProcessed; containing all time-Windows and all seasons!
	     */

	    var hltwProcessed = {
		"spring" : Array(),
		"summer" : Array(),
		"autum" : Array(),
		"winter" : Array()
	    };

	    for (var i = 1; i < table.rows.length; i++) {
		switch (table.rows[i].cells[0].getElementsByTagName("select")[0].selectedIndex) {
		case 0:
		    // alert("spring");
		    hltwProcessed["spring"][hltwProcessed["spring"].length] = {
			"begin" : table.rows[i].cells[1].getElementsByTagName("input")[0].value,
			"end" : table.rows[i].cells[2].getElementsByTagName("input")[0].value
		    };
		    break;
		case 1:
		    // alert("summer");
		    hltwProcessed["summer"][hltwProcessed["summer"].length] = {
			"begin" : table.rows[i].cells[1].getElementsByTagName("input")[0].value,
			"end" : table.rows[i].cells[2].getElementsByTagName("input")[0].value
		    };
		    break;
		case 2:
		    // alert("autum");
		    hltwProcessed["autum"][hltwProcessed["autum"].length] = {
			"begin" : table.rows[i].cells[1].getElementsByTagName("input")[0].value,
			"end" : table.rows[i].cells[2].getElementsByTagName("input")[0].value
		    };
		    break;
		case 3:
		    // alert("winter");
		    hltwProcessed["winter"][hltwProcessed["winter"].length] = {
			"begin" : table.rows[i].cells[1].getElementsByTagName("input")[0].value,
			"end" : table.rows[i].cells[2].getElementsByTagName("input")[0].value
		    };
		    break;

		default:
		    break;
		}
	    }

	    var hltwProcessedJSON = JSON.stringify(hltwProcessed);
	    // alert(hltwProcessedJSON);
	    alert(providerNameStr);
	    // inster into DB!
	    $.ajax({
		type : "POST",
		url : "server.php",
		data : {
		    method : "addHltw",
		    providerStr : providerNameStr,
		    year : yearValid,
		    hltw : hltwProcessedJSON
		},
		success : function(data) {

		    loadHltws();

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

	}

    }

});