function zoomGraphX(minDate, maxDate) {
	g.updateOptions({
		dateWindow : [ minDate, maxDate ]
	});
	showXDimensions(minDate, maxDate);
}

function zoomMonth() {
	var i = 0;
	var month = maxValueDate.getMonth();

	while (i < dates.length) {
		if (dates[i].getMonth() == month) {
			break;
		} else {
			i++;
		}
	}

	var start = i;

	while (i < dates.length) {
		if (dates[i].getMonth() != month) {
			i--;
			break;
		} else {
			i++;
		}
	}

	var end = i;

	zoomGraphX(dates[start], dates[end]);
}

function zoomWeek() {
	var i = 0;
	var month = maxValueDate.getMonth();

	while (i < dates.length) {
		if (dates[i].getMonth() == month) {
			break;
		} else {
			i++;
		}
	}

	var start = i;

	while (i < dates.length) {
		if (dates[i].getMonth() != month) {
			i--;
			break;
		} else {
			i++;
		}
	}

	var end = i;

	zoomGraphX(dates[start], dates[end]);
}

function zoomDay() {
	var i = 0;
	var month = maxValueDate.getMonth();

	while (i < dates.length) {
		if (dates[i].getMonth() == month) {
			break;
		} else {
			i++;
		}
	}

	var start = i;

	while (i < dates.length) {
		if (dates[i].getMonth() != month) {
			i--;
			break;
		} else {
			i++;
		}
	}

	var end = i;

	zoomGraphX(dates[start], dates[end]);
}