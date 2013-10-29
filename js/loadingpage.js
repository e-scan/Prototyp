var progress = document.querySelector('.percent');
var result;

var g;

var dates;
var values;

var maxValue;
var maxValueDate;
var twentyPercentLine;

var img = new Image();
img.src="data/eSCAN-Logo.png";

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

}
);

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

$("select#providers").change(function(e) {
	var e2 = document.getElementById("providers");
	// use value for "WR" or text for "Wernigerode"
	var strProvider = e2.options[e2.selectedIndex].value;
	
	if (g != null) {
		
	    $.ajax({
	        type: "POST",
	        url: "server.php",
			data : {
				provider : strProvider,
				method : "getHLZF"
			},
	        success: function(data){
	        	
	        	var result = JSON.parse(data);
	        	
	        	alert("Beginn: "+result.spring.begin+"\nEnd: "+result.spring.end);
	       
	        }
	    });
		
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
		 
// var rtime = new Date(1, 1, 2000, 12,00,00);
// var timeout = false;
// var delta = 200;
// $("div#graph").resize(function() {
// rtime = new Date();
// if (timeout == false) {
// timeout = true;
// setTimeout(resizeend, delta);
// }
// });
//
// function resizeend() {
// if (new Date() - rtime < delta) {
// setTimeout(resizeend, delta);
// } else {
// timeout = false;
// g.resize();
// }
// }
//
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
	
	g.resize();
	
}

function resetArrays(){
	dates = new Array();
	values = new Array();

	maxValue = 0;
	maxValueDate = new Date();
	twentyPercentLine = 0;
}