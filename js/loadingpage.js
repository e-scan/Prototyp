var progress = document.querySelector('.percent');

var dates = new Array();
var values = new Array();

var maxValue = 0;

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
		var result = e.target.result;

		generateGraph(result);

		$("button#restore_position").click(function() {

			g.resetZoom();

		});
		
		$("button#generate_png").click(function() {

			g.resetZoom();

		});
		
		$("button#generate_png").click(function() {

			g.resetZoom();

		});
		
		<!-- now the logic for saving as png and svg -->
		
		$("button#generate_png").click(function() {

			var png = document.getElementById('graph_png');
			Dygraph.Export.asPNG(g, png);

			return false;
		});

	}

	// Read in the image file as a binary string.
	reader.readAsBinaryString(evt.target.files[0]);
}

function generateGraph(result) {
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
	
	// for all other, split into groups and push into loose
	// and while doing that, find the maxValue
	for (var i = 1; i < lines.length; i++) {

		tmp = lines[i].split(",");
		dates.push(new Date(tmp[0]));
		values.push(parseFloat(tmp[1]));

		// finding MaxValue
		if (parseFloat(tmp[1]) > maxValue) {
			maxValue = parseFloat(tmp[1]);
		}
	}

	// this is the array dygraphs gets to draw the graphs
	var content = new Array();

	var twentyPercentLine = maxValue * 0.8;
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
	
	g = new Dygraph(document.getElementById("graph"), content, {
		// customBars: true,
		valueRange : yRange,
		// showRoller: true,
		rollPeriod : 0,
		animatedZooms : true,
		title : 'Lastgang',
		ylabel : 'KWh',
		underlayCallback: function(canvas, area, g) {

            canvas.fillStyle = "rgba(255, 0, 220, 0.5)";

            function highlight_period(x_start, x_end) {
              var canvas_left_x = g.toDomXCoord(x_start);
              var canvas_right_x = g.toDomXCoord(x_end);
              var canvas_width = canvas_right_x - canvas_left_x;
              canvas.fillRect(canvas_left_x, area.y, canvas_width, area.h);
            }

            // comment later...
            
            for (var i = 0; i < values.length;) {
            	
            	if (values[i]>=twentyPercentLine) {
            		
            		var start = i;
            		
            		while (i < values.length && values[i] >= twentyPercentLine) {
            			i++;
            		}
            		
            		var end = i;
            		
            		highlight_period(dates[start], dates[end]);
            		
            	}
            	else {
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
		labels : [ loose[0], loose[1], '20%', 'MaxValue' ]
	});
}