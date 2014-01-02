/**
 * @class loadingpage
 * @brief Here all JavaScript-functions directly related to the loadingpage-templatea are implemented.
 * @author fao
 * @date 23/11/8
 */
// / Progress (0-100) for the progress-bar when "uploading"
var progress = document.querySelector('.percent');

// / Result from File
var resultFromFile;

// / one day for each of the 4 seasons with 15min-dates and true/false (is critical or not)
// / an array of array: first seasons (spring, summer...) and second associative arrays begin-end and the times (1-*)
var hlzfProcessed;

// / this is the array dygraphs gets to draw the graphs; containing dates, and values for each line
var contentForGraph;

// / an array of annotations if wished, empty if not (not null!)
var annotations = new Array();

// / hlzfFromDB that comes from a php-script and ultimately a db
var hlzfFromDB = null;

// / the graph
var graph = null;

// / contains all dates, for easier and faster use instead of getting dates from graph
var dates;

// / contains all values parsed to float
var values;

// / contains the highest value (peak) of all values
var maxValue;

// / contains the related date for maxValue
var maxValueDate;

// / one value (float) describing the highness of the twentyPercentLine
var twentyPercentLine;

// / defines what values are vertikally shown (start/end)
var yRangeOfGraph;

// / contains the background-Image for the graph
var backgroundImageGraph = new Image();
backgroundImageGraph.src = "data/eSCAN-Logo.png";

/*
 * DEBUG
 */
var showHLZF = false;

/**
 * @brief The inner function is called when the document is loaded completely
 */
$(document).ready(function(e) {
	/*
	 * Here all necessary things are done so that all buttons and functions are ready for user-use!
	 */

	// reset all arrays if the template is realoaded and some things are still in the cache
	resetArrays();

	/*
	 * Add function to the wattageGroup-Listener
	 */
	$("input[name='wattageGroup']").change(function(e) {
		if (resultFromFile != null) {
			generateGraph(resultFromFile);
		}
	});

	/*
	 * Fill the provider-select with a message to first upload a "Lastgang".
	 */
	// get the "combobox" for the providers
	var select = document.getElementById("providers");
	select.options[0] = new Option("Zuerst einen Lastgang hochladen!", 0);

	/*
	 * Fill the year-select with a message to first upload a "Lastgang".
	 */
	// get the "combobox" for the year
	var selectYear = document.getElementById("year");
	selectYear.options[0] = new Option("Zuerst einen Lastgang hochladen!", 0);

	/*
	 * Add the function below to the select as a listener!
	 */
	$("select#providers").change(function(e) {

		var select = document.getElementById("providers");

		if (select.selectedIndex != 0) {
			// use value for "WR" or text for "Wernigerode"
			var idProvider = select.options[select.selectedIndex].value;
			// alert(idProvider);
			/*
			 * Send the selected Provider (eg. WR) and receive the hlzf if correctly defined, else "nil" (string)
			 */
			$.ajax({
				type : "POST",
				url : "server.php",
				data : {
					method : "getHLTWs",
					provider : idProvider,
				},
				success : function(data) {

					// alert(data);

					// the array transformed back to json
					var years = JSON.parse(data);

					var selectYear = document.getElementById("year");
					selectYear.options.length = 1;

					// and add each provider (incl. "nil") to the select-form as option
					jQuery.each(years, function(text, id) {
						// alert(id);
						// alert(val);
						selectYear.options[selectYear.options.length] = new Option(text, id);
					});

				}
			});
		} else {
			// reset everything that was changed!
			graph.setAnnotations(new Array());
			var selectYear = document.getElementById("year");
			selectYear.options.length = 1;
		}

	});

	/*
	 * Add the function below to the select as a listener!
	 */
	$("select#year").change(function(e) {
		var selectYear = document.getElementById("year");
		var pavID = selectYear.options[selectYear.selectedIndex].value;
		// alert(idProvider);
		/*
		 * Send the selected Provider (eg. WR) and receive the hlzf if correctly defined, else "nil" (string)
		 */
		// alert("provider: " + idProvider + "\nyear: " + year);
		$.ajax({
			type : "POST",
			url : "server.php",
			data : {
				method : "getHLZF",
				pavID : pavID
			},
			success : function(data) {

				// alert(data);

				/*
				 * If ready, process the date
				 */
				// alert(data);
				// alert(data);
				hlzfFromDB = JSON.parse(data);

				if (hlzfFromDB != "nil") {

					/*
					 * Generate hlzfProcessed for later checking!
					 */

					/*
					 * IMPORTAMT: because of conversion- and performance-reasons, will the time not be corresponding to the UTC-time "12:00", but "12:0"!!!! (handle hour and minutes as integers separatly!
					 */
					hlzfProcessed = new Array(4);
					hlzfProcessed["spring"] = new Array();
					hlzfProcessed["summer"] = new Array();
					hlzfProcessed["autum"] = new Array();
					hlzfProcessed["winter"] = new Array();

					for ( var season in hlzfProcessed) {

						for (var hour = 0; hour < 24; hour++) {

							var isInHLZF = new Array();
							isInHLZF['0'] = false;
							isInHLZF['15'] = false;
							isInHLZF['30'] = false;
							isInHLZF['45'] = false;

							// Look through
							// all
							// time-windows
							// of the HLZF
							for (var i = 0; i < hlzfFromDB[season].length; i++) {

								var hlzfHourBegin = parseInt(hlzfFromDB[season][i].begin.split(':')[0]);
								var hlzfHourEnd = parseInt(hlzfFromDB[season][i].end.split(':')[0]);

								var hlzfMinuteBegin = parseInt(hlzfFromDB[season][i].begin.split(':')[1]);
								var hlzfMinuteEnd = parseInt(hlzfFromDB[season][i].end.split(':')[1]);

								if (hour > hlzfHourBegin && hour < hlzfHourEnd) {
									/*
									 * This hour is within the HLZF, no need for scanning minute, because the edges (hour) have to be scanned, not inside the hours!
									 */
									isInHLZF['0'] = true;
									isInHLZF['15'] = true;
									isInHLZF['30'] = true;
									isInHLZF['45'] = true;

								} else if (hour == hlzfHourBegin) {
									/*
									 * the hour is exactly at the beginning of the hlzfFromDB
									 */
									if (0 >= hlzfMinuteBegin)
										isInHLZF['0'] = true;
									if (15 >= hlzfMinuteBegin)
										isInHLZF['15'] = true;
									if (30 >= hlzfMinuteBegin)
										isInHLZF['30'] = true;
									if (45 >= hlzfMinuteBegin)
										isInHLZF['45'] = true;

								} else if (hour == hlzfHourEnd) {
									/*
									 * the hour is exactly at the end of the hlzfFromDB
									 */
									if (0 < hlzfMinuteEnd)
										isInHLZF['0'] = true;
									if (15 < hlzfMinuteEnd)
										isInHLZF['15'] = true;
									if (30 < hlzfMinuteEnd)
										isInHLZF['30'] = true;
									if (45 < hlzfMinuteEnd)
										isInHLZF['45'] = true;
								}
							}

							hlzfProcessed[season][hour + ':' + '0'] = isInHLZF['0'];
							hlzfProcessed[season][hour + ':' + '15'] = isInHLZF['15'];
							hlzfProcessed[season][hour + ':' + '30'] = isInHLZF['30'];
							hlzfProcessed[season][hour + ':' + '45'] = isInHLZF['45'];

						}

					}

				}

				// redraw the graph if it has been drawn yet (to show the markings and annotations if wanted
				if (values != null)
					drawGraph();

			}
		});

		// redraw the graph if it has been drawn yet (to show the markings and annotations if wanted
		if (values != null)
			drawGraph();

	});

});

/**
 * @brief Makes the use of selecting a Provider possible
 * 
 * Fetches all known Providers from DB and add's them to the Select and registers an listener-function that processes the hlzfFromDB into hlzfProcessed
 */
function readyProviders() {

	// get the "combobox" for the providers
	var select = document.getElementById("providers");

	select.options.length = 1;

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

			// first, overwrite the first "Zuerst Lastgang auswählen" option and say "Keine Auswahl".
			select.options[0] = new Option("Keine Auswahl", 0);

			// the array transformed back to json
			var providers = JSON.parse(data);

			// and add each provider (incl. "nil") to the select-form as option
			jQuery.each(providers, function(text, id) {
				// alert(id);
				// alert(val);
				select.options[select.options.length] = new Option(text, id);
			});

			var selectYear = document.getElementById("year");
			selectYear.options[0] = new Option("Bitte Jahr auswaehlen!", 0);

		}
	});

}

/**
 * @brief Returns the Sesons that the given month is in
 * @param month
 *            The Month as a int
 * @returns {String} The season ("Spring", "Summer", "autum", "Winter"
 */
function getSeason(month) {
	var season = "spring";
	if (month == 5 || month == 6 || month == 7)
		season = "summer";
	else if (month == 8 || month == 9 || month == 10)
		season = "autum";
	else if (month == 11 || month == 0 || month == 1)
		season = "winter";
	return season;
}

/**
 * @brief Abording the reading-process of the local file containing the "Lastgang"
 */
function abortRead() {
	reader.abort();
	alert("reading aborted!");
}

/**
 * @brief Handles the different Errors that can occur when trying to read a file through the file-select
 * @param evt
 *            The Event that happened
 */
function errorHandler(evt) {
	switch (evt.target.error.code) {
	case evt.target.error.NOT_FOUND_ERR:
		alert('File Not Found!');
		break;
	case evt.target.error.NOT_READABLE_ERR:
		alert('File is not readable');
		break;
	case evt.target.error.ABORT_ERR:
		break; // noop
	default:
		alert('An error occurred reading this file.');
	}
	;
}

/**
 * @brief Updates the progress-bar when reading a "Lastgang"
 * @param evt
 *            the Event that happened
 */
function updateProgress(evt) {
	// evt is an ProgressEvent.
	if (evt.lengthComputable) {
		var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
		// Increase the progress bar length.
		if (percentLoaded < 100) {
			progress.style.width = percentLoaded + '%';
			progress.textContent = percentLoaded + '%';
		}
	}
}

/**
 * Is called when a file is chosen for 'uploading' ("Lastgang")
 * 
 * @param evt
 */
function handleFileSelect(evt) {
	// Reset progress indicator on new file selection.
	progress.style.width = '0%';
	progress.textContent = '0%';

	// Reset all arrays and Data!
	resetArrays();

	reader = new FileReader();
	reader.onerror = errorHandler;
	reader.onprogress = updateProgress;

	/**
	 * @brief Is called when the reading-process is to be aborted
	 */
	reader.onabort = function(e) {
		alert('File read cancelled');
	};

	/**
	 * @brief Is called when the reading-process is started
	 */
	reader.onloadstart = function(e) {
		document.getElementById('progress_bar').className = 'loading';
	};

	/**
	 * @brief Is called when the file is completely loaded
	 */
	reader.onload = function(e) {
		// Ensure that the progress bar displays 100% at the end.
		progress.style.width = '100%';
		progress.textContent = '100%';
		setTimeout("document.getElementById('progress_bar').className='';", 2000);

		// now get the providers
		readyProviders();

		// resultFromFile contains the textfile as a string
		resultFromFile = e.target.result;

		generateGraph(resultFromFile);

		/*
		 * Connect Buttons and functions.
		 */
		$("button#zoom_month").click(function() {
			zoomMonth();
			resetYRange();
		});

		$("button#zoom_week").click(function() {
			zoomWeek();
			resetYRange();
		});

		$("button#zoom_day").click(function() {
			zoomDay();
			resetYRange();
		});

		$("button#zoom_20_max").click(function() {
			graph.updateOptions({
				valueRange : [ twentyPercentLine, maxValue ]
			});
		});

		$("button#restore_position").click(function() {

			graph.resetZoom();

			resetYRange();
		});

		// now the logic for saving as png and svg

		$("button#generate_png").click(function() {

			var png = document.getElementById('graph_png');
			Dygraph.Export.asPNG(graph, png);

			// var canvas = document.getElementById("innerGraph");
			// var dataUrl = canvas.toDataURL();
			//			
			// window.open(dataUrl, "toDataURL() image", "width=600, height=200");
			//			
			// var canvas = document.getElementById("graph");
			// var png = document.getElementById("graph_png");
			//
			// png.src = canvas.toDataURL("image/png");

			return false;
		});

		$("div#graph").resize(function(e) {
			graph.resize($("#graph").innerWidth() - 5, $("#graph").innerHeight() - 5);
		});

	};

	// Read in the image file as a binary string.
	reader.readAsBinaryString(evt.target.files[0]);
}

/**
 * @brief Is called when the "Lastgang" is read and can be processed!
 * @param resultFromFile
 *            The Result from reading the file
 */
function generateGraph(resultFromFile) {

	// destroy graph and reset if there is old stuff in cache
	if (graph != null) {
		graph.destroy();
		resetArrays();
		// TODO: delete all providers and request them!
	}

	// lines contains the textfile but splittet into single lines [array]
	var lines = resultFromFile.split('\n');

	// loose contains lines but date and value are separated [array]
	var loose = new Array();

	// maxValue of the values for further use
	maxValue = 0;

	// handle the first line separatly, because this contains the
	// header-string
	var tmp = lines[0].split(",");
	// loose.push(tmp[0]);
	loose.push('Date');
	loose.push(tmp[1]);

	// declared here for performance-reasons!
	var tmp = new Array(2);

	if (document.wattage.wattageGroup[0].checked) {
		// for all other, split into groups and push into loose
		// and while doing that, find the maxValue
		for (var i = 1; i < lines.length - 1; i++) {

			tmp = lines[i].split(",");
			dates.push(new Date(tmp[0]));
			values.push(parseFloat(tmp[1] * 4));

			// finding MaxValue
			if (parseFloat(tmp[1] * 4) > maxValue) {
				maxValue = parseFloat(tmp[1] * 4);
				maxValueDate = new Date(tmp[0]);
			}
		}
	} else {
		// for all other, split into groups and push into loose
		// and while doing that, find the maxValue
		for (var i = 1; i < lines.length - 1; i++) {

			tmp = lines[i].split(",");
			dates.push(new Date(tmp[0]));
			values.push(parseFloat(tmp[1]));

			// finding MaxValue
			if (parseFloat(tmp[1]) > maxValue) {
				maxValue = parseFloat(tmp[1]);
				maxValueDate = new Date(tmp[0]);
			}
		}
	}

	// reset array
	contentForGraph = new Array();

	// define the value of the 20%-line
	twentyPercentLine = maxValue * 0.8;

	// declared here for performance-reasons!
	var tmp = new Array(4);

	for (var i = 0; i < dates.length - 1; i++) {
		// create one line of data for the graph
		tmp = [ dates[i], values[i], twentyPercentLine, maxValue ];

		// now the tmp-array can go into the data
		contentForGraph.push(tmp);
	}

	yRangeOfGraph = [ 0, maxValue * 1.1 ];

	// finally, draw the graph
	drawGraph();

}

/**
 * @brief Creates and draws the graph into the "innerGraph"-div
 */
function drawGraph() {

	// create Graph
	graph = new Dygraph(document.getElementById("innerGraph"), contentForGraph, {
		// customBars: true,
		valueRange : yRangeOfGraph,
		// showRoller: true,
		rollPeriod : 0,
		animatedZooms : true,
		title : 'Lastgang',
		ylabel : 'KW',
		zoomCallback : function(minDate, maxDate, yRangeOfGraph) {
			// TODO: set minima and maxima!
		},
		underlayCallback : function(canvas, area, graph) {

			canvas.drawImage(backgroundImageGraph, 0, 0, area.w, area.h);

			canvas.fillStyle = "rgba(252, 251, 194, 1.0)";
			// comment later...

			if (hlzfFromDB != null && hlzfFromDB != "nil" && showHLZF) {

				/*
				 * Now draw marks if necessary!
				 */
				for (var i = 0; i < values.length;) {

					var season = getSeason(dates[i].getMonth());

					if (hlzfProcessed[season][dates[i].getHours() + ':' + dates[i].getMinutes()]) {
						// Found a value over 20%; seach for the end of the
						// continuing values over 20%
						var start = i;

						while (hlzfProcessed[season][dates[i].getHours() + ':' + dates[i].getMinutes()]) {
							i++;
						}

						var end = i;

						/*
						 * Now fill the area
						 */
						var canvas_left_x = graph.toDomXCoord(dates[start]);
						var canvas_right_x = graph.toDomXCoord(dates[end]);
						var canvas_width = canvas_right_x - canvas_left_x;
						var canvas_y = graph.toDomYCoord(maxValue);
						var canvas_height = graph.toDomYCoord(twentyPercentLine) - canvas_y;
						canvas.fillRect(canvas_left_x, canvas_y, canvas_width, canvas_height);

					} else {
						// No value over 20% found, jump to next!
						i++;
					}
				}

				// for (var i = 0; i < hlzfFromDB.spring.length; i++) {
				// alert("Beginn: "+hlzfFromDB.spring[i].begin+"\nEnd:
				// "+hlzfFromDB.spring[i].end);
				// }

			} else if (hlzfFromDB != null && hlzfFromDB != "nil") {

				/*
				 * Now draw marks if necessary!
				 */
				for (var i = 0; i < values.length;) {

					var season = getSeason(dates[i].getMonth());

					if (values[i] >= twentyPercentLine) {
						if (hlzfProcessed[season][dates[i].getHours() + ':' + dates[i].getMinutes()]) {
							// Found a value over 20%; seach for the end of the
							// continuing values over 20%
							var start = i;

							annotations.push({
								series : 'MaxValue',
								x : Date.parse(dates[start]),
								shortText : "!",
								text : 'Anfang',
							// cssClass:
							});

							while (values[i] >= twentyPercentLine && hlzfProcessed[season][dates[i].getHours() + ':' + dates[i].getMinutes()]) {
								i++;
							}

							var end = i - 1;

							annotations.push({
								series : 'MaxValue',
								x : Date.parse(dates[end]),
								shortText : "!",
								text : 'Ende',
							// cssClass:
							});

							/*
							 * Now fill the area
							 */
							var canvas_left_x = graph.toDomXCoord(dates[start]);
							var canvas_right_x = graph.toDomXCoord(dates[end]);
							var canvas_width = canvas_right_x - canvas_left_x;
							var canvas_y = graph.toDomYCoord(maxValue);
							var canvas_height = graph.toDomYCoord(twentyPercentLine) - canvas_y;
							canvas.fillRect(canvas_left_x, canvas_y, canvas_width, canvas_height);

						} else {
							i++;
						}
					} else {
						// No value over 20% found, jump to next!
						i++;
					}
				}

			} else {

				for (var i = 0; i < values.length;) {

					if (values[i] >= twentyPercentLine) {
						// Found a value over 20%; seach for the end of the
						// continuing values over 20%
						var start = i;

						while (i < values.length && values[i] >= twentyPercentLine) {
							i++;
						}

						var end = i;

						/*
						 * Now fill the area
						 */
						var canvas_left_x = graph.toDomXCoord(dates[start]);
						var canvas_right_x = graph.toDomXCoord(dates[end]);
						var canvas_width = canvas_right_x - canvas_left_x;
						var canvas_y = graph.toDomYCoord(maxValue);
						var canvas_height = graph.toDomYCoord(twentyPercentLine) - canvas_y;
						canvas.fillRect(canvas_left_x, canvas_y, canvas_width, canvas_height);

					} else {
						// No value over 20% found, jump to next!
						i++;
					}
				}

			}

		},
		// legend : 'always',
		// showRangeSelector : true,
		// rangeSelectorPlotStrokeColor: 'yellow',
		// rangeSelectorPlotFillColor: 'lightyellow',
		// rangeSelectorHeight: 30,
		colors : [ "rgba(0,128,128,1.0)", "rgba(31,173,23,1.0)", "rgba(219,59,42,1.0)" ],
		labelsDivStyles : {
			'textAlign' : 'left'
		},
		labelsDivWidth : 120,
		labelsSeparateLines : "<br/>",
		labels : [ 'Datum', 'Verbrauch', '20%', 'MaxValue' ],
	// isZoomedIgnoreProgrammaticZoom : true
	});

	if (hlzfFromDB != 'nil' && !showHLZF)
		graph.setAnnotations(annotations);
	else
		graph.setAnnotations(new Array());

	graph.resize();
}

/**
 * @brief Resets some arrays to get rid of old stuff
 */
function resetArrays() {
	dates = new Array();
	values = new Array();

	maxValue = 0;
	maxValueDate = new Date();
	twentyPercentLine = 0;
}