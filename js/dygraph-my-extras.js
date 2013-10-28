function zoomGraphX(minDate, maxDate) {
	g.updateOptions({
		dateWindow : [ minDate, maxDate ]
	});

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
	g.updateOptions({
		valueRange : [ 0, maxValue ]
	});
}