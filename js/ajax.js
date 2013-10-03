$(document).ready(function() {
	// Einfacher AJAX-Aufruf
	$("button#testcall").click(function() {

		$.ajax({
			type : "POST",
			url : "server.php",
			data : {
				method : "testcall"
			},
			success : function(content) {
				$("#content").text(content);
			}
		});

		return false;
	});

});

/**
 * Sendet Ajax-Request
 */
function SendAjaxJsonRequest(url, method, jsonObject) {
	$.ajax({
		type : "POST",
		url : url,
		data : {
			method : method,
			jsonObject : jsonObject
		},
		success : onSuccess
	});
}

/**
 * AJAX-Response auswerten
 */
function onSuccess(content) {
	// Das empfangene Objekt wird wieder zum Objekt geparst
	var response = $.parseJSON(content);

	// geladenes Template im Container "content" austauschen
	$("#content").html(response.template);

	// Pruefen ob die Eingabe richtig ist,
	if (!response.result) {
		// Wenn ein Fehler auftritt wird das Eingabefeld rot gefaerbt
		$(".control-group").addClass("error");
	} else {
		// Wenn ein kein Fehler auftritt wird die vorhandene CSS-Klasse error
		// entfernt (falls gesetzt)
		$(".control-group").removeClass("error");
	}
}