/**
 * Called when the document is loaded.
 */
$(document).ready(function(e) {

    var editProviderSelect = document.getElementById("providerEditSelect");
    // alert(strProviderName);

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
		editProviderSelect.options[editProviderSelect.options.length] = new Option(val, i);
	    });

	}
    });

});

/**
 * Called when the Button to add a Provider is pressed. Changes the "createProviderOKStatus"-Label to give the user a feedback!
 */
$("button#editProviderOK").click(function() {

    var providerNameInput = document.getElementById("providerName");
    var editProviderNewNameStatusLabel = document.getElementById("editProviderNewNameStatus");

    var providerEditSelect = document.getElementById("providerEditSelect");
    var editProviderSelectedProviderStatusLabel = document.getElementById("editProviderSelectedProviderStatus");

    var editProviderOkStatusLabel = document.getElementById("editProviderOkStatus");

    var everythingOk = true;

    var newProviderNameStr = providerNameInput.value;
    var oldProviderNameStr = providerEditSelect.options[providerEditSelect.selectedIndex].value;

    if (newProviderNameStr == "") {
	editProviderNewNameStatusLabel.innerHTML = "Bitte einen neuen Namen eingeben!";
	editProviderNewNameStatusLabel.style.backgroundColor = "#E05C5C";
	editProviderNewNameStatusLabel.style.visibility = "visible";
	everythingOk = false;
    } else {
	editProviderNewNameStatusLabel.innerHTML = "OK!";
	editProviderNewNameStatusLabel.style.backgroundColor = "#77CE63";
	editProviderNewNameStatusLabel.style.visibility = "visible";
    }

    if (oldProviderNameStr == "") {
	editProviderSelectedProviderStatusLabel.innerHTML = "Bitte einen Betreiber ausw&auml;hlen!";
	editProviderSelectedProviderStatusLabel.style.backgroundColor = "#E05C5C";
	editProviderSelectedProviderStatusLabel.style.visibility = "visible";
	everythingOk = false;
    } else {
	editProviderSelectedProviderStatusLabel.innerHTML = "OK!";
	editProviderSelectedProviderStatusLabel.style.backgroundColor = "#77CE63";
	editProviderSelectedProviderStatusLabel.style.visibility = "visible";
    }

    if (everythingOk) {

	$.ajax({
	    type : "POST",
	    url : "server.php",
	    data : {
		oldProviderName : oldProviderNameStr,
		newProviderName : newProviderNameStr,
		method : "changeProviderInformation"
	    },
	    success : function(data) {

		/*
		 * If ready, process the date (containing the response from the query!)
		 */
		var status = JSON.parse(data);

		editProviderOkStatusLabel.style.visibility = "visible";

		if (status) {
		    // alert("alles OK!");
		    editProviderOkStatusLabel.innerHTML = "Werte ge&auml;ndert!";
		    editProviderOkStatusLabel.style.backgroundColor = "#77CE63";
		    editProviderOkStatusLabel.style.visibility = "visible";
		} else {
		    // alert("Fehler!");
		    editProviderOkStatusLabel.innerHTML = "Fehler bei Datenbank!";
		    editProviderOkStatusLabel.style.backgroundColor = "#E05C5C";
		    editProviderOkStatusLabel.style.visibility = "visible";
		}

	    }
	});

	/*
	 * Clear all providers in the select before requesting new ones!
	 */
	providerEditSelect.options.length = 0;

	/*
	 * Now send an ajax-request to a php-script to get all providers (from Database!) and set signal to show the user a change was made!
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
		    providerEditSelect.options[providerEditSelect.options.length] = new Option(val, i);
		});

		for (var i = 0, j = providerEditSelect.options.length; i < j; ++i) {
		    if (providerEditSelect.options[i].innerHTML === newProviderNameStr) {
			providerEditSelect.selectedIndex = i;
			break;
		    }
		}

	    }
	});
    } else {
	editProviderOkStatusLabel.innerHTML = "Bitte erst Fehler korrigieren!";
	editProviderOkStatusLabel.style.backgroundColor = "#E05C5C";
	editProviderOkStatusLabel.style.visibility = "visible";
    }

});