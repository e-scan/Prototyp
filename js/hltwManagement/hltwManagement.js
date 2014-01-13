/**
 * @brief: This file contains all necessary js-functions for the "hltwManagement.html"-template!
 * @author: fao
 */

/**
 * Called when the document is loaded.
 */
$(document).ready(function(e) {
    /*
     * Get all providers and connect buttons and functions.
     */

    // get providers and reset
    getProviders("providerEditSelect");

    /*
     * Now connect all inputs and their functions
     */
    $("select#providerEditSelect").change(function(e) {

	var select = document.getElementById("providerEditSelect");

	if (select.selectedIndex == 1) {
	    /*
	     * Create new Provider.
	     */

	    // reset old templates for editing/creating hltw!
	    // TODO: check if anything is to be canceled and ask for input!
	    $("#hltwManagementContainer").html("");

	    $.ajax({
		type : "POST",
		url : "server.php",
		data : {
		    method : "load_hltw-management-createProvider-template"
		},
		success : function(content) {
		    $("#managementContainer").html(content);
		}
	    });

	} else {

	    /*
	     * Edit a Provider.
	     */

	    $.ajax({
		type : "POST",
		url : "server.php",
		data : {
		    method : "load_hltw-management-editProvider-template"
		},
		success : function(content) {
		    $("#managementContainer").html(content);
		}
	    });

	}

	document.getElementById("hltwManagementContainer").innerHTML = "";

    });

});

function getProviders(selectId) {

    var editProviderSelect = document.getElementById(selectId);

    /*
     * Clear all providers in the select before requesting new ones!
     */
    editProviderSelect.options.length = 2;

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
	    jQuery.each(providers, function(text, id) {
		// alert(id);
		// alert(text);
		editProviderSelect.options[editProviderSelect.options.length] = new Option(text, id);
	    });

	}
    });

}