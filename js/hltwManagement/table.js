/**
 * This class represents a table for creating and editing a HLTW.
 * 
 * @author Fabian
 */
var Table = function(divId) {

    /*
     * First, all Methods and then method-calls, because the interpreter just runs once over the "class".
     */

    /**
     * This function adds a row to the table at the given index and moves all following rows by one.
     */
    Table.prototype.addRow = function(index) {

	// alert(index);

	for (var int = this.htmlTable.rows.length - 1; int >= index; int--) {

	    var row = this.htmlTable.rows[int];

	    var buttons = row.getElementsByTagName("button");
	    // Buttons[0] = addButton
	    buttons[0].setAttribute("value", parseInt(int) + 1);
	    // Buttons[1] = delButton
	    buttons[1].setAttribute("value", parseInt(int) + 1);

	}

	var newRow = this.htmlTable.insertRow(index);

	var seasonCell = newRow.insertCell(0);
	var beginTimeCell = newRow.insertCell(1);
	var endTimeCell = newRow.insertCell(2);
	var addTimeCell = newRow.insertCell(3);
	var delTimeCell = newRow.insertCell(4);

	seasonCell.innerHTML = "<select id=\"seasonSelect\"><option>Fr&uuml;hling</option><option>Sommer</option><option>Herbst</option><option>Winter</option></select>";
	beginTimeCell.innerHTML = "<td><input id=\"beginTime\" type=\"time\" value=\"12:00\" step=\"900\" onchange=\" \"></td>";
	endTimeCell.innerHTML = "<td><input id=\"endTime\" type=\"time\" value=\"12:00\" step=\"900\" onchange=\" \"></td>";
	addTimeCell.innerHTML = "<td><button value=" + index + " title=\"Danach hinzuf&uuml;gen\" onClick=\"table.addRow(parseInt(this.value)+1)\" >+</button></td>";
	// var button = new Document().createElement("button");
	// alert(button);
	// button.setAttribute("value", index);
	// button.setAttribute("onClick", "table.addRow(parseInt(this.value)+1)");
	// addTimeCell.appendChild(button);
	delTimeCell.innerHTML = "<td><button value=" + index + " title=\"Diese Zeile entfernen\" onClick=\"table.delRow(parseInt(this.value))\" >x</button></td>";

    };

    /**
     * This function deletes the row at the given index and moves all other rows by one.
     */
    Table.prototype.delRow = function(index) {

	if (this.htmlTable.rows.length > 2) {

	    this.htmlTable.deleteRow(index);

	    for (var int = this.htmlTable.rows.length - 1; int >= index; int--) {

		if (int != 1) {

		    var row = this.htmlTable.rows[int];

		    var buttons = row.getElementsByTagName("button");
		    // Buttons[0] = addButton
		    buttons[0].setAttribute("value", parseInt(int) - 1);
		    // Buttons[1] = delButton
		    buttons[1].setAttribute("value", parseInt(int) - 1);

		}// if

	    }// for

	}// if

    };

    /**
     * This function creates the table with header and adds it into the div.
     */
    Table.prototype.createTable = function() {
	/**
	 * Now create the table.
	 */
	// TODO: Add header.
	this.htmlTable = document.createElement("table");
	this.htmlTable.setAttribute("border", "1px");
	var newRow = this.htmlTable.insertRow(0);

	var seasonCell = newRow.insertCell(0);
	var beginTimeCell = newRow.insertCell(1);
	var endTimeCell = newRow.insertCell(2);
	var addTimeCell = newRow.insertCell(3);
	var delTimeCell = newRow.insertCell(4);

	seasonCell.innerHTML = "Jahreszeit";
	beginTimeCell.innerHTML = "Beginn (Uhrzeit)";
	endTimeCell.innerHTML = "Ende (Uhrzeit)";
	addTimeCell.innerHTML = "";
	delTimeCell.innerHTML = "";

	this.div.appendChild(this.htmlTable);

	this.confirmButton = document.createElement("button");
	this.confirmButton.setAttribute("onClick", "table.saveInDB()");
	this.confirmButton.innerHTML = "OK";
	this.div.appendChild(this.confirmButton);

    };

    /**
     * This function checks if everything in the table is correct (all seasons appear at least onece and the end-time is greater then the begin-time).
     */
    Table.prototype.saveInDB = function() {

	/*
	 * First, check if everything is ok!
	 */
	var everythingOk = true;
	var seasonsContained = new Array(false, false, false, false);

	/*
	 * Check, if every season was used at least once!
	 */
	for (var i = 1; i < this.htmlTable.rows.length; i++) {

	    // work with season-index, because
	    // "Frühling" will cause the string
	    // not to be tested correctly!
	    var seasonIndex = this.htmlTable.rows[i].cells[0].getElementsByTagName("select")[0].selectedIndex;

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
	for (var j = 1; j < this.htmlTable.rows.length; j++) {
	    if (!everythingOk) {
		// red
		this.htmlTable.rows[j].cells[0].getElementsByTagName("select")[0].style.backgroundColor = "#E05C5C";
	    } else {
		// white (for reset)
		this.htmlTable.rows[j].cells[0].getElementsByTagName("select")[0].style.backgroundColor = "#FFFFFF";
	    }
	}

	// Check if the times are plausible
	// (begin-time >= end-time.
	// Jump over 0, this is the header, and
	// continue with all others.
	for (var i = 1; i < this.htmlTable.rows.length; i++) {

	    // check time
	    var beginTime = this.htmlTable.rows[i].cells[1].getElementsByTagName("input")[0].value.split(":");
	    var endTime = this.htmlTable.rows[i].cells[2].getElementsByTagName("input")[0].value.split(":");

	    if (parseInt(beginTime[0]) > parseInt(endTime[0])) {
		this.htmlTable.rows[i].cells[1].getElementsByTagName("input")[0].style.backgroundColor = "#E05C5C";
		this.htmlTable.rows[i].cells[2].getElementsByTagName("input")[0].style.backgroundColor = "#E05C5C";
		everythingOk = false;
	    } else if (parseInt(beginTime[0]) == parseInt(endTime[0]) && parseInt(beginTime[1]) >= parseInt(endTime[1])) {
		this.htmlTable.rows[i].cells[1].getElementsByTagName("input")[0].style.backgroundColor = "#E05C5C";
		this.htmlTable.rows[i].cells[2].getElementsByTagName("input")[0].style.backgroundColor = "#E05C5C";
		everythingOk = false;
	    } else {
		this.htmlTable.rows[i].cells[1].getElementsByTagName("input")[0].style.backgroundColor = "#FFFFFF";
		this.htmlTable.rows[i].cells[2].getElementsByTagName("input")[0].style.backgroundColor = "#FFFFFF";
	    }

	}

	// for debugging
	// everythingOk = true;

	// alert(everythingOk);

	if (everythingOk) {

	    /*
	     * Get all needed Information.
	     */
	    var selectYear = document.getElementById("chooseHltwSelect");
	    // alert(selectYear);
	    // TODO: think of using pavID (is at the moment for loadingPage not possible! (no year-select!))
	    // alert(selectYear.selectedIndex);
	    if (parseInt(selectYear.selectedIndex) == 1) {
		// alert("new HLTW");
		var yearValid = document.getElementById("yearInput").value;
		// alert(yearValid);
	    } else {
		// alert("update HLTW");
		var yearValid = selectYear.options[selectYear.selectedIndex].text;
		// alert(yearValid);
		var pavID = selectYear.options[selectYear.selectedIndex].value;
		// alert(yearValid);
	    }

	    var editProviderSelect = document.getElementById("providerEditSelect");
	    var providerID = editProviderSelect.options[editProviderSelect.selectedIndex].value;
	    // alert(providerID);

	    /*
	     * now create the hltwProcessed; containing all time-Windows and all seasons!
	     */

	    var hltwProcessed = {
		"spring" : Array(),
		"summer" : Array(),
		"autum" : Array(),
		"winter" : Array()
	    };

	    for (var i = 1; i < this.htmlTable.rows.length; i++) {
		switch (this.htmlTable.rows[i].cells[0].getElementsByTagName("select")[0].selectedIndex) {
		case 0:
		    // alert("spring");
		    hltwProcessed["spring"][hltwProcessed["spring"].length] = {
			"begin" : this.htmlTable.rows[i].cells[1].getElementsByTagName("input")[0].value,
			"end" : this.htmlTable.rows[i].cells[2].getElementsByTagName("input")[0].value
		    };
		    break;
		case 1:
		    // alert("summer");
		    hltwProcessed["summer"][hltwProcessed["summer"].length] = {
			"begin" : this.htmlTable.rows[i].cells[1].getElementsByTagName("input")[0].value,
			"end" : this.htmlTable.rows[i].cells[2].getElementsByTagName("input")[0].value
		    };
		    break;
		case 2:
		    // alert("autum");
		    hltwProcessed["autum"][hltwProcessed["autum"].length] = {
			"begin" : this.htmlTable.rows[i].cells[1].getElementsByTagName("input")[0].value,
			"end" : this.htmlTable.rows[i].cells[2].getElementsByTagName("input")[0].value
		    };
		    break;
		case 3:
		    // alert("winter");
		    hltwProcessed["winter"][hltwProcessed["winter"].length] = {
			"begin" : this.htmlTable.rows[i].cells[1].getElementsByTagName("input")[0].value,
			"end" : this.htmlTable.rows[i].cells[2].getElementsByTagName("input")[0].value
		    };
		    break;

		default:
		    break;
		}
	    }

	    /*
	     * Delete pavID if necessary!
	     */
	    if (parseInt(selectYear.selectedIndex) != 1) {
		// alert("delete: " + pavID);
		$.ajax({
		    type : "POST",
		    url : "server.php",
		    data : {
			method : "delPavID",
			pavID : pavID
		    },
		    success : function(data) {

			loadHltws();

			/*
			 * If ready, process the date (containing the response from the query!)
			 */
//			alert(data);
			var status = JSON.parse(data);
//			alert(status);

		    }
		});
	    }

	    var hltwProcessedJSON = JSON.stringify(hltwProcessed);
	    // alert(hltwProcessedJSON);
	    // alert(providerID);
	    // inster into DB!
	    $.ajax({
		type : "POST",
		url : "server.php",
		data : {
		    method : "addHltw",
		    providerID : providerID,
		    year : yearValid,
		    hltw : hltwProcessedJSON
		},
		success : function(data) {

		    loadHltws();

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

	}

    };

    /**
     * This function changes the information of a indexed row.
     * 
     * @param index
     *                int The index of the row in the table.
     * @param season
     *                String The season of the time-window
     * @param beginTime
     *                String The beginning time: "HH:MM".
     * @param endTime
     *                String The ending time: "HH:MM".
     */
    Table.prototype.changeRowInformation = function(index, season, beginTime, endTime) {

	var row = this.htmlTable.rows[index];

	// TODO: change key of input for seasons to "spring" and value to "Frühling"!

	if (season != null)
	    row.cells[0].getElementsByTagName("select")[0].selectedIndex = season;

	if (beginTime != null)
	    row.cells[1].getElementsByTagName("input")[0].value = beginTime;

	if (endTime != null)
	    row.cells[2].getElementsByTagName("input")[0].value = endTime;

    };

    /**
     * This function initializes the Table with 4 rows, one for each season. (Done when createing, not editing!)
     */
    Table.prototype.initTable = function() {

	// for (var index = 1; index < 5; index++) {
	// alert(index);
	// this.addRow(index);
	// }

	this.addRow(1);
	this.addRow(2);
	this.changeRowInformation(2, 1, null, null);
	this.addRow(3);
	this.changeRowInformation(3, 2, null, null);
	this.addRow(4);
	this.changeRowInformation(4, 3, null, null);

    };

    /**
     * This function loads information about the HLTW from the Database and creates the corresponding table.
     */
    Table.prototype.loadInformation = function() {

	var selectProvider = document.getElementById("providerEditSelect");
	var idProvider = selectProvider.options[selectProvider.selectedIndex].value;
	// alert(idProvider);

	var selectYear = document.getElementById("chooseHltwSelect");
	// TODO: think of using pavID (is at the moment for loadingPage not possible! (no year-select!))
	var year = selectYear.options[selectYear.selectedIndex].text;
	// alert(year);

	var that = this;

	// DANGER: DO NOT USE $!!!! USE "jQuery."!!!!!!!!!!!!!
	jQuery.ajax({
	    type : "POST",
	    url : "server.php",
	    data : {
		method : "getHLZF",
		provider : idProvider,
		year : year
	    },
	    success : function(data) {

		// alert(data);

		/*
		 * If ready, process the date
		 */
		// alert(data);
		var hlzfFromDB = JSON.parse(data);

		that.fillTable(hlzfFromDB);

	    }.bind(this)
	// success
	});

    };

    Table.prototype.fillTable = function(hlzfFromDB) {

	var lastIndex = 1;

	if (hlzfFromDB != "nil") {

	    // TODO: USE SPRING ETC. FOR VALUE/TEXT!
	    // TODO: ADD "0" to "0" to get "00"

	    var seasonIndex = 0;

	    for ( var season in hlzfFromDB) {

		// alert(season);

		for (var i = 0; i < hlzfFromDB[season].length; i++) {

		    var hlzfHourBegin = parseInt(hlzfFromDB[season][i].begin.split(':')[0]);
		    var hlzfHourEnd = parseInt(hlzfFromDB[season][i].end.split(':')[0]);

		    var hlzfMinuteBegin = parseInt(hlzfFromDB[season][i].begin.split(':')[1]);
		    var hlzfMinuteEnd = parseInt(hlzfFromDB[season][i].end.split(':')[1]);

		    this.addRow(lastIndex);
		    this.changeRowInformation(lastIndex, seasonIndex, hlzfHourBegin + ":" + (hlzfMinuteBegin == 0 ? "00" : hlzfMinuteBegin), hlzfHourEnd + ":" + (hlzfMinuteEnd == 0 ? "00" : hlzfMinuteEnd));

		    lastIndex++;

		}// for
		seasonIndex++;
	    }// for
	}// if

    };

    /**
     * This function returns a reference to the instance for use in calls from somewhere outside this class.
     */
    Table.prototype.getInstance = function() {
	return this;
    };

    /**
     * This function alerts the divId.
     */
    Table.prototype.alertDivId = function() {
	alert(divId);
	// alert(div);
	// div.innerHTML = "<p>test</p>";
    };

    /*
     * Now all constructor-calls.
     */

    /** Contains the divId the table will go into in the html-document. */
    this.divId = divId;
    this.div = document.getElementById(divId);

    this.createTable();

};