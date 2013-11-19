/**
 * @brief: This file contains all necessary js-functions for the "hltwManagement.html"-template!
 * @author: fao
 */

$(document).ready(function(e) {
    /*
     * Here all necessary things are done so that all buttons and functions are ready for user-use!
     */

    $("button#createProvider").click(function() {

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

    });

    $("button#editProvider").click(function() {

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

    });

    $("button#createHltw").click(function() {

	$.ajax({
	    type : "POST",
	    url : "server.php",
	    data : {
		method : "load_hltw-management-createHltw-template"
	    },
	    success : function(content) {
		$("#managementContainer").html(content);
	    }
	});

    });

});