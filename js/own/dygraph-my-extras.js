function zoomGraphX(minDate, maxDate) {
	graph.updateOptions({
		dateWindow : [ minDate, maxDate ]
	});

}

function resetZoom() {

	// TODO: FEHLER!!!

	var start = new Date(dates[0]);
	var end = new Date(dates[dates.length - 1]);
	for (var date = 0; date < dates.length; date++) {
		alert(dates[date]);
	}
	zoomGraphX(start, end);

}

function zoomSeason(season) {

	if (season === "spring") {

		var start = new Date(maxValueDate.toGMTString());
		start.setHours(0);
		start.setMinutes(0);
		start.setMonth(2, 1);

		var end = new Date(start.toGMTString());
		end.setMonth(start.getMonth() + 3);

	} else if (season === "summer") {

		var start = new Date(maxValueDate.toGMTString());
		start.setHours(0);
		start.setMinutes(0);
		start.setMonth(5, 1);

		var end = new Date(start.toGMTString());
		end.setMonth(start.getMonth() + 3);

	} else if (season === "autum") {

		var start = new Date(maxValueDate.toGMTString());
		start.setHours(0);
		start.setMinutes(0);
		start.setMonth(8, 1);

		var end = new Date(start.toGMTString());
		end.setMonth(start.getMonth() + 3);

	} else {

		// safe values
		contentForGraphSafe = contentForGraph;
		datesSafe = dates;

		// reset array
		contentForGraph = new Array();
		dates = new Array();

		// declared here for performance-reasons!
		var tmp = new Array(4);

		// finally, draw the graph

		for (var i = 0; i < values.length - 1; i++) {

			if (getSeason(datesSafe[i].getMonth()) === "winter") {

				if (datesSafe[i].getMonth() == 0 || datesSafe[i].getMonth() == 1) {

					var date = datesSafe[i];
					date.setMonth(date.getMonth() + 12);
					dates.push(date);

					// create one line of data for the graph
					tmp = [ date, values[i], twentyPercentLine, maxValue ];

					// now the tmp-array can go into the data
					contentForGraph.push(tmp);

				} else {

					// create one line of data for the graph
					tmp = [ datesSafe[i], values[i], twentyPercentLine, maxValue ];

					// now the tmp-array can go into the data
					contentForGraph.push(tmp);
					dates.push(datesSafe[i]);

				}
			}// winter

		}// for

		var start = new Date(maxValueDate.toGMTString());
		start.setHours(0);
		start.setMinutes(0);
		start.setMonth(11, 1);

		var end = new Date(start.toGMTString());
		end.setMonth(start.getMonth() + 3);

		graph.updateOptions({
			file : contentForGraph
		});

		// drawGraph();

	}

	zoomGraphX(start, end);

}

function zoomMonth() {

	var start = new Date(maxValueDate.toGMTString());
	start.setDate(1);
	start.setHours(0);
	start.setMinutes(0);

	var end = new Date(start.toGMTString());
	end.setMonth(start.getMonth() + 1);

	zoomGraphX(start, end);

}

function zoomWeek() {

	var start = new Date(maxValueDate.toGMTString());
	start.setDate(start.getDate() - start.getDay() + 1);
	start.setHours(0);
	start.setMinutes(0);

	var end = new Date(start.toGMTString());
	end.setDate(start.getDate() + (7 - start.getDay() + 1));

	zoomGraphX(start, end);

}

function zoomDay() {

	var start = new Date(maxValueDate.toGMTString());
	start.setHours(0);
	start.setMinutes(0);

	var end = new Date(start.toGMTString());
	end.setDate(start.getDate() + 1);
	end.setHours(0);
	end.setMinutes(0);

	zoomGraphX(start, end);

}

function resetYRange() {
	graph.updateOptions({
		valueRange : [ 0, maxValue ]
	});
}