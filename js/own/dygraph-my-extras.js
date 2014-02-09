function zoomGraphX(minDate, maxDate) {
	graph.updateOptions({
		dateWindow : [ minDate, maxDate ]
	});

}

function resetZoom() {

	// TODO: FEHLER!!!

	var start = new Date(dates[0]);
	var end = new Date(dates[dates.length - 1]);
//	for (var date = 0; date < dates.length; date++) {
//		alert(dates[date]);
//	}
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

	} else if (season ==="winter1") {

		var start = new Date(maxValueDate.toGMTString());
		start.setHours(0);
		start.setMinutes(0);
		start.setMonth(0, 1);

		var end = new Date(start.toGMTString());
		end.setMonth(start.getMonth() + 2);

	}	else {

		var start = new Date(maxValueDate.toGMTString());
		start.setHours(0);
		start.setMinutes(0);
		start.setMonth(11, 1);

		var end = new Date(start.toGMTString());
		end.setMonth(start.getMonth() + 1);

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