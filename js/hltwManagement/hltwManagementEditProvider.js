/**
 * Called when the document is loaded.
 */
$(document).ready(function(e) {

	/*
	 * Load the hltw's that are already stored in DB for this provider! (if any)
	 */
	loadHltws();

	/*
	 * Now connect all inputs and their functions
	 */
	$("select#chooseHltwSelect").change(function(e) {

		var select = document.getElementById("chooseHltwSelect");

		if (select.selectedIndex == 1) {
			$.ajax({
				type : "POST",
				url : "server.php",
				data : {
					method : "load_hltw-management-createHltw-template"
				},
				success : function(content) {
					$("#hltwManagementContainer").html(content);
				}
			});

		} else {
			$.ajax({
				type : "POST",
				url : "server.php",
				data : {
					method : "load_hltw-management-editHltw-template"
				},
				success : function(content) {
					$("#hltwManagementContainer").html(content);
				}
			});

		}

	});

	/*
	 * Load all information about the privider and past them into the mask for editing information
	 */
	var providerEditSelect = document.getElementById("providerEditSelect");
	var providerName = providerEditSelect.options[providerEditSelect.selectedIndex].text;
	document.getElementById("providerName").value = providerName;

});

/**
 * Loads all hltw for the specifiedrpovider.
 */
function loadHltws() {
	var chooseHltwSelect = document.getElementById("chooseHltwSelect");
	chooseHltwSelect.options.length = 2;

	var providerEditSelect = document.getElementById("providerEditSelect");
	var providerId = providerEditSelect.options[providerEditSelect.selectedIndex].value;

	// alert(strProviderName);

	$.ajax({
		type : "POST",
		url : "server.php",
		data : {
			method : "getHLTWs",
			provider : providerId
		},
		success : function(data) {

			// alert(data);

			// the array transformed back to json
			var years = JSON.parse(data);

			// and add each provider (incl. "nil") to the select-form as option
			// jQuery.each(years, function(i, val) {
			// chooseHltwSelect.options[chooseHltwSelect.options.length] = new Option(val, i);
			// });
			jQuery.each(years, function(text, id) {
				// alert(id);
				// alert(val);
				chooseHltwSelect.options[chooseHltwSelect.options.length] = new Option(id, text);
			});

			// TODO: sorting does not work because "hinzufügen" and "Bitte auswählen" nehmen sonderpositionen ein!
			// sortSelect(chooseHltwSelect);

		}
	});
}

/**
 * Called when the Button to add a Provider is pressed. Changes the "createProviderOKStatus"-Label to give the user a feedback!
 */
$("button#editProviderOK").click(function() {

	var providerNameInput = document.getElementById("providerName");
	var editProviderNewNameStatusLabel = document.getElementById("editProviderNewNameStatus");

	var providerEditSelect = document.getElementById("providerEditSelect");

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
		editProviderNewNameStatusLabel.style.visibility = "hidden";
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
					getProviders("providerEditSelect");
				} else {
					// alert("Fehler!");
					editProviderOkStatusLabel.innerHTML = "Fehler bei Datenbank!";
					editProviderOkStatusLabel.style.backgroundColor = "#E05C5C";
					editProviderOkStatusLabel.style.visibility = "visible";
				}

			}
		});

		/*
		 * Now send an ajax-request to a php-script to get all providers (from Database!) and set signal to show the user a change was made!
		 */
		getProviders();
	} else {
		editProviderOkStatusLabel.innerHTML = "Bitte erst Fehler korrigieren!";
		editProviderOkStatusLabel.style.backgroundColor = "#E05C5C";
		editProviderOkStatusLabel.style.visibility = "visible";
	}

});

$("button#editProviderDEL").click(function() {

	var editProviderSelect = document.getElementById("providerEditSelect");
	var editProviderDelStatusLabel = document.getElementById("editProviderDelStatus");

	var providerID = editProviderSelect.options[editProviderSelect.selectedIndex].value;

	$.ajax({
		type : "POST",
		url : "server.php",
		data : {
			providerID : providerID,
			method : "delProvider"
		},
		success : function(data) {

			/*
			 * If ready, process the date (containing the response from the query!)
			 */
			var status = JSON.parse(data);

			editProviderDelStatusLabel.style.visibility = "visible";

			if (status) {
				// alert("alles OK!");
				editProviderDelStatusLabel.innerHTML = "Betreiber gel&ouml;scht!";
				editProviderDelStatusLabel.style.backgroundColor = "#77CE63";
				editProviderDelStatusLabel.style.visibility = "visible";
				getProviders("providerEditSelect");
			} else {
				// alert("Fehler!");
				editProviderDelStatusLabel.innerHTML = "Fehler bei Datenbank!";
				editProviderDelStatusLabel.style.backgroundColor = "#E05C5C";
				editProviderDelStatusLabel.style.visibility = "visible";
			}

		}
	});

});