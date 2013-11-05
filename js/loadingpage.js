var progress = document.querySelector('.percent');
var result;
var daysInHLZF;

var hlzf = null;

var g;

var dates;
var values;

var maxValue;
var maxValueDate;
var twentyPercentLine;

var annotations;

var img = new Image();
img.src="data/eSCAN-Logo.png";

/*
 * DEBUG
 */
var showHLZF = false;

$(document).ready(function(e) {
	
	// get the "combobox" for the providers
	var select = document.getElementById("providers");
	
	/*
	 * Now send an ajax-request to a php-script to get all providers (later on
	 * from database!)
	 */
    $.ajax({
        type: "POST",
        url: "server.php",
		data : {
			method : "getProviders"
		},
        success: function(data){
        	
        	// the array transformed back to json
        	var providers = JSON.parse(data);
        	
        	// and add each provider (incl. "nil") to the select-form as option
        	jQuery.each(providers, function(i, val) {
        		select.options[select.options.length] = new Option(val, i);
        	});
       
        }
    });
    
    $("select#providers").change(function(e) {
    	var e2 = document.getElementById("providers");
    	// use value for "WR" or text for "Wernigerode"
    	var strProvider = e2.options[e2.selectedIndex].value;
    	
        $.ajax({
            type: "POST",
            url: "server.php",
    		data : {
    			provider : strProvider,
    			method : "getHLZF"
    		},
            success: function(data){
            	
            	hlzf = JSON.parse(data);;
            	
    		    /*
				 * Generate daysInHLZF for later checking!
				 */
            	
    		    /*
				 * IMPORTAMT: because of conversion- and performance-reasons,
				 * will the time not be corresponding to the UTC-time "12:00",
				 * but "12:0"!!!! (handle hour and minutes as integers
				 * separatly!
				 */
            	daysInHLZF = new Array(4);
            	daysInHLZF["spring"] = new Array();
            	daysInHLZF["summer"] = new Array();
            	daysInHLZF["autum"] = new Array();
            	daysInHLZF["winter"] = new Array();
            	
		    	
            	for (var season in daysInHLZF){
            		
			    	for (var hour = 0; hour < 24; hour++) {
			    		
			    		var isInHLZF = new Array();
			    		isInHLZF['0'] = false;
			    		isInHLZF['15'] = false;
			    		isInHLZF['30'] = false;
			    		isInHLZF['45'] = false;
			    		
			    		// Look through all time-windows of the HLZF
			    		for (var i = 0; i < hlzf[season].length; i++) {
			    			
			    			var hlzfHourBegin = parseInt(hlzf[season][i].begin.split(':')[0]);
			    			var hlzfHourEnd = parseInt(hlzf[season][i].end.split(':')[0]);
			    			
			    			var hlzfMinuteBegin = parseInt(hlzf[season][i].begin.split(':')[1]);
			    			var hlzfMinuteEnd = parseInt(hlzf[season][i].end.split(':')[1]);
			    			
			    			if (hour > hlzfHourBegin && hour < hlzfHourEnd) {
			    				// This hour is within the HLZF, no need for
								// scanning minute, because the edges (hour)
								// have to be scanned, not inside the hours!
			    				isInHLZF['0'] = true;
				    			isInHLZF['15'] = true;
				    			isInHLZF['30'] = true;
				    			isInHLZF['45'] = true;
				    			
			    			} else if (hour == hlzfHourBegin) {
			    				// the hour is exactly at the beginning of the
								// hlzf
			    				if (0 >= hlzfMinuteBegin)
			    					isInHLZF['0'] = true;
			    				if (15 >= hlzfMinuteBegin)
				    				isInHLZF['15'] = true;
			    				if (30 >= hlzfMinuteBegin)
				    				isInHLZF['30'] = true;
			    				if (45 >= hlzfMinuteBegin)
				    				isInHLZF['45'] = true;
			    				
			    			} else if (hour == hlzfHourEnd) {
			    				// the hour is exactly at the end of the hlzf
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
			    		
					    daysInHLZF[season][hour+':'+'0'] = isInHLZF['0'];
					    daysInHLZF[season][hour+':'+'15'] = isInHLZF['15'];
					    daysInHLZF[season][hour+':'+'30'] = isInHLZF['30'];
					    daysInHLZF[season][hour+':'+'45'] = isInHLZF['45'];
			    		
			    	}
		    	
            	}
           
            }
        });
    		
    	
    });

}
);

function getSeason(month){
	var season = "spring";
	if (month == 5 || month == 6|| month == 7)
		season = "summer";
	else if (month == 8 || month == 9|| month == 10)
		season = "autum";
	else if (month == 11 || month == 0|| month == 1)
		season = "winter";
	return season;
}

$("input[name='wattageGroup']").change(function(e) {
	if(result != null){
		// doesnt work properly yet!
		// var dateWindowSafe = g.getOption("dateWindow");
		generateGraph(result);
		// g.updateOptions({
		// dateWindow : dateWindowSafe
		// });
	}
});

function abortRead() {
	reader.abort();
	alert("reading aborted!");
}

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

function handleFileSelect(evt) {
	// Reset progress indicator on new file selection.
	progress.style.width = '0%';
	progress.textContent = '0%';

	// Reset all arrays and Data!
	resetArrays();
	
	reader = new FileReader();
	reader.onerror = errorHandler;
	reader.onprogress = updateProgress;

	reader.onabort = function(e) {
		alert('File read cancelled');
	};

	reader.onloadstart = function(e) {
		document.getElementById('progress_bar').className = 'loading';
	};

	reader.onload = function(e) {
		// Ensure that the progress bar displays 100% at the end.
		progress.style.width = '100%';
		progress.textContent = '100%';
		setTimeout("document.getElementById('progress_bar').className='';",
				2000);

		// result contains the textfile as a string
		result = e.target.result;

		generateGraph(result);
		
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
			g.updateOptions({
				valueRange : [ twentyPercentLine, maxValue ]
			});
		});

		$("button#restore_position").click(function() {
			
			g.resetZoom();
			
			resetYRange();
		});
		
		<!-- now the logic for saving as png and svg -->
		
		$("button#generate_png").click(function() {

			var png = document.getElementById('graph_png');
			Dygraph.Export.asPNG(g, png);

			return false;
		});
		
		 $("div#graph").resize(function(e){
			 g.resize($("#graph").innerWidth()-5, $("#graph").innerHeight()-5);
		 });

	}

	// Read in the image file as a binary string.
	reader.readAsBinaryString(evt.target.files[0]);
}

function generateGraph(result) {
	
	if (g != null) {
		g.destroy();
		resetArrays();
	}
		
	// lines contains the textfile but splittet into single lines [array]
	var lines = result.split('\n');

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
	
	if (document.wattage.wattageGroup[0].checked){
		// for all other, split into groups and push into loose
		// and while doing that, find the maxValue
		for (var i = 1; i < lines.length-1; i++) {
	
			tmp = lines[i].split(",");
			dates.push(new Date(tmp[0]));
			values.push(parseFloat(tmp[1]*4));
	
			// finding MaxValue
			if (parseFloat(tmp[1]*4) > maxValue) {
				maxValue = parseFloat(tmp[1]*4);
				maxValueDate = new Date(tmp[0]);
			}
		}
	} else {
		// for all other, split into groups and push into loose
		// and while doing that, find the maxValue
		for (var i = 1; i < lines.length-1; i++) {
	
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

	// this is the array dygraphs gets to draw the graphs
	var content = new Array();

	twentyPercentLine = maxValue * 0.8;
	// var twentyPercentLine=200;

	// declared here for performance-reasons!
	var tmp = new Array (4);
	
	for (var i = 0; i < dates.length - 1; i++) {
		// better this way with the transition from one graph to the next,
		// but not nearly perfect!
		tmp = [dates[i], values[i], twentyPercentLine,
				maxValue];

		// now the tmp-array can go into the data
		content.push(tmp);
	}

	var yRange = [ 0, maxValue * 1.1 ];

	// var canvas = document.getElementById("graph");
    // var context = canvas.getContext("2d");
    // context.drawImage("/data/eScan-Logo.jpg",10,10);
	
	g = new Dygraph(document.getElementById("innerGraph"), content, {
		// customBars: true,
		valueRange : yRange,
		// showRoller: true,
		rollPeriod : 0,
		animatedZooms : true,
		title : 'Lastgang',
		ylabel : 'KW',
		underlayCallback: function(canvas, area, g) {
			
			canvas.drawImage(img,0,0,area.w,area.h);

		    canvas.fillStyle = "rgba(252, 251, 194, 1.0)";
		    // comment later...
		    
		    if (hlzf != null && hlzf != "nil" && showHLZF) {

		    	/*
				 * Now draw marks if necessary!
				 */
			    for (var i = 0; i < values.length;) {
	
			    	var season = getSeason(dates[i].getMonth());
			    	
			    	if (daysInHLZF[season][dates[i].getHours()+':'+dates[i].getMinutes()]) {
			    		// Found a value over 20%; seach for the end of the
						// continuing values over 20%
			    		var start = i;
			    		
			    		while (daysInHLZF[season][dates[i].getHours()+':'+dates[i].getMinutes()]) {
			    			i++;
			    		}
			    		
			    		var end = i;
			    		
			    		/*
						 * Now fill the area
						 */
			            var canvas_left_x = g.toDomXCoord(dates[start]);
			            var canvas_right_x = g.toDomXCoord(dates[end]);
			            var canvas_width = canvas_right_x - canvas_left_x;
			            var canvas_y = g.toDomYCoord(maxValue);
			            var canvas_height = g.toDomYCoord(twentyPercentLine) - canvas_y;
			            canvas.fillRect(canvas_left_x, canvas_y, canvas_width, canvas_height);
			    		
			    	}
			    	else {
			    		// No value over 20% found, jump to next!
			    		i++;
			    	}
			    }

		    	// for (var i = 0; i < hlzf.spring.length; i++) {
		    	// alert("Beginn: "+hlzf.spring[i].begin+"\nEnd:
				// "+hlzf.spring[i].end);
		    	// }
		    	
		    } if (hlzf != null && hlzf != "nil") {

		    	/*
				 * Now draw marks if necessary!
				 */
			    for (var i = 0; i < values.length;) {
	
			    	var season = getSeason(dates[i].getMonth());
			    	
			    	if (values[i]>=twentyPercentLine && daysInHLZF[season][dates[i].getHours()+':'+dates[i].getMinutes()]) {
			    		// Found a value over 20%; seach for the end of the
						// continuing values over 20%
			    		var start = i;
			    		
			    		while (values[i]>=twentyPercentLine && daysInHLZF[season][dates[i].getHours()+':'+dates[i].getMinutes()]) {
			    			i++;
			    		}
			    		
			    		var end = i;
			    		
			    		/*
						 * Now fill the area
						 */
			            var canvas_left_x = g.toDomXCoord(dates[start]);
			            var canvas_right_x = g.toDomXCoord(dates[end]);
			            var canvas_width = canvas_right_x - canvas_left_x;
			            var canvas_y = g.toDomYCoord(maxValue);
			            var canvas_height = g.toDomYCoord(twentyPercentLine) - canvas_y;
			            canvas.fillRect(canvas_left_x, canvas_y, canvas_width, canvas_height);
			    		
			    	}
			    	else {
			    		// No value over 20% found, jump to next!
			    		i++;
			    	}
			    }

		    	// for (var i = 0; i < hlzf.spring.length; i++) {
		    	// alert("Beginn: "+hlzf.spring[i].begin+"\nEnd:
				// "+hlzf.spring[i].end);
		    	// }
		    	
		    }
		    else {
		    	
			    for (var i = 0; i < values.length;) {
			    	
			    	if (values[i]>=twentyPercentLine) {
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
			            var canvas_left_x = g.toDomXCoord(dates[start]);
			            var canvas_right_x = g.toDomXCoord(dates[end]);
			            var canvas_width = canvas_right_x - canvas_left_x;
			            var canvas_y = g.toDomYCoord(maxValue);
			            var canvas_height = g.toDomYCoord(twentyPercentLine) - canvas_y;
			            canvas.fillRect(canvas_left_x, canvas_y, canvas_width, canvas_height);
			    		
			    	}
			    	else {
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
		colors : [ "rgba(0,128,128,1.0)", "rgba(31,173,23,1.0)",
				"rgba(219,59,42,1.0)" ],
		labelsDivStyles : {
			'textAlign' : 'left'
		},
		labelsDivWidth : 120,
		labelsSeparateLines : "<br/>",
		labels : [ loose[0], loose[1], '20%', 'MaxValue' ],
		// isZoomedIgnoreProgrammaticZoom : true
	});
	
//    annotations = new Array();
//    
//    for (var i = 0; i < values.length; i++) {
//    	if (values[i] >= twentyPercentLine) {
//	      annotations.push( {
//	        series: 'Verbrauch',
//	        x: date[i],
//	        shortText: "!",
//	        text: 'Zu hoch!'
//	      } );
//    	}
//    }
//
//    g.setAnnotations(annotations);
	
	g.resize();
	
}

function resetArrays(){
	dates = new Array();
	values = new Array();

	maxValue = 0;
	maxValueDate = new Date();
	twentyPercentLine = 0;
}