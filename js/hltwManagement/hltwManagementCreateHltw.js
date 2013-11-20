/**
 * Called when the document is loaded.
 */
$(document).ready(function(e) {

    // get the "combobox" for the providers
    var providerSelect = document.getElementById("providerSelect");

    // get the "combobox" for the seasons
    var seasonSelect = document.getElementById("seasonSelect");

    /*
     * Now send an ajax-request to a php-script to get all providers (from Database!)
     */
    $.ajax({
	type : "POST",
	url : "server.php",
	data : {
	    method : "getProviders"
	},
	success : function(data) {

	    // the array transformed back to json
	    var providers = JSON.parse(data);

	    // and add each provider (incl. "nil") to the select-form as option
	    jQuery.each(providers, function(i, val) {
		providerSelect.options[providerSelect.options.length] = new Option(val, i);
	    });

	}
    });

    $("button#confirmButton").click(function() {

	/*
	 * First, check if everything is ok!
	 */
	var everythingOk = true;
	var seasonsContained = new Array(false, false, false, false);

	var table = document.getElementById("hltwTable");

	// Check if the times are plausible (begin-time >= end-time.
	// Jump over 0, this is the header, and continue with all others.
	for (var i = 1; i < table.rows.length; i++) {

	    // work with season-index, because "Fr�hling" will cause the string not to be tested correctly!
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

	    // check, if every season was found!
	    for (var j = 0; j < seasonsContained.length; j++) {
		if (!seasonsContained[j]) {
		    everythingOk = false;
		}
	    }

	    // TODO: not getting green!
	    for (var j = 1; j < table.rows.length; j++) {
		if (!everythingOk) {
		    // red
		    table.rows[j].cells[0].getElementsByTagName("select")[0].style.backgroundColor = "#E05C5C";
		} else {
		    // green (for reset)
		    table.rows[j].cells[0].getElementsByTagName("select")[0].style.backgroundColor = "#77CE63";
		}
	    }

	    // now mark the seasons red, if there were not all used!

	    // second, check time
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