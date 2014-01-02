<?php

/**
 * @author fao
 * @return multitype:string an Array that contains all providers.
 */
function getProviders() {
	
	// $connection = mysql_connect ( $mysqlhost, $mysqluser, $mysqlpwd ) or die ( "Verbindungsversuch fehlgeschlagen" );
	$link = mysql_connect ( 'localhost', 'hlzf', 'hlzf' );
	if (! $link) {
		die ( 'Verbindung schlug fehl: ' . mysql_error () );
	}
	// echo 'Erfolgreich verbunden<br>';
	
	$result = mysql_query ( 'SELECT * FROM `e-scan`.`provider`' );
	if (! $result) {
		die ( 'Ungültige Anfrage: ' . mysql_error () );
	}
	
	while ( $row = mysql_fetch_assoc ( $result ) ) {
		$name = $row ['name'];
		$id = $row ['provider_id'];
		$ret [$name] = $id;
	}
	// echo $ret["Stadtwerke Wernigerode GmbH"];
	mysql_close ( $link );
	
	return $ret;
}
/**
 * Returns the years for which an HLTW exists for the specified provider.
 *
 * @author fao
 * @param unknown $providerId
 *        	The name of the Provider the HLTW belongs to.
 * @return multitype:unknown An array with the years in it.
 */
function getHLTWs($providerId) {
	
	// $connection = mysql_connect ( $mysqlhost, $mysqluser, $mysqlpwd ) or die ( "Verbindungsversuch fehlgeschlagen" );
	$link = mysql_connect ( 'localhost', 'hlzf', 'hlzf' );
	if (! $link) {
		// die ( 'Verbindung schlug fehl: ' . mysql_error () );
		echo "Verbindung fehlgeschlagen!";
	}
	// echo 'Erfolgreich verbunden<br>';
	
	$result = mysql_query ( 'SELECT  `year`, `pav_id` FROM  `e-scan`.`provider_anual_values` WHERE  `provider_id` = "' . $providerId . '" ORDER BY `year`;' );
	if (! $result) {
		// die ( 'Ungültige Anfrage: ' . mysql_error () );
		echo "ungültige Anfrage!";
	}
	
	$years = array ();
	
	// NOTE: use year->id instead of id->year because json.parse sorts the assoc. array by key!
	while ( $row = mysql_fetch_assoc ( $result ) ) {
		$year = $row ['year'];
		$pav_id = $row ['pav_id'];
		$years [$year] = $pav_id;
		// echo $year;
	}
	
	mysql_close ( $link );
	return $years;
}
/**
 * Adds a provider to the DB.
 *
 * @author fao
 * @param unknown $providerName
 *        	Name of the provider.
 * @return unknown The result, wheather the query was usccessfull or not.
 */
function addProvider($providerName) {
	$retMsg = "OK";
	
	$link = mysql_connect ( 'localhost', 'hlzf', 'hlzf' );
	if (! $link) {
		$retMsg = "Verbindung schlug fehl.";
		// die ( 'Verbindung schlug fehl: ' . mysql_error () );
	}
	
	$result = mysql_query ( 'INSERT INTO `e-scan`.`provider` (`provider_id` , `name` , `inactive`) VALUES (NULL , "' . $providerName . '", "0"	);' );
	if (! $result) {
		$retMsg = "Ungültige Anfrage.";
		// die ( 'Ungültige Anfrage: ' . mysql_error () );
	}
	
	mysql_close ( $link );
	
	return $result;
}
/**
 * Deletes the provider from the DB.
 * (Real deleting, not just making inactive!)
 *
 * @param unknown $providerName
 *        	The name of the provider (Primarykey in DB)
 * @return unknown Wheather the request was successfull or not.
 */
function delProvider($providerID) {
	$retMsg = "OK";
	
	$link = mysql_connect ( 'localhost', 'hlzf', 'hlzf' );
	if (! $link) {
		$retMsg = "Verbindung schlug fehl.";
		// die ( 'Verbindung schlug fehl: ' . mysql_error () );
	}
	
	$result = mysql_query ( "DELETE FROM `e-scan`.`provider` WHERE `provider`.`provider_id` = '" . $providerID . "';" );
	if (! $result) {
		$retMsg = "Ungültige Anfrage.";
		// die ( 'Ungültige Anfrage: ' . mysql_error () );
	}
	
	mysql_close ( $link );
	
	return $result;
}
/**
 * Deletes the pavID and through cascading all entries connected to it.
 *
 * @param int $pavID        	
 * @return string Query-result
 */
function delPavID($pavID) {
	$retMsg = "OK";
	
	$link = mysql_connect ( 'localhost', 'hlzf', 'hlzf' );
	if (! $link) {
		$retMsg = "Verbindung schlug fehl.";
		// die ( 'Verbindung schlug fehl: ' . mysql_error () );
	}
	
	$result = mysql_query ( "DELETE FROM `e-scan`.`provider_anual_values` WHERE `provider_anual_values`.`pav_id` = '" . $pavID . "';" );
	if (! $result) {
		$retMsg = "Ungültige Anfrage.";
		die ( 'Ungültige Anfrage: ' . mysql_error () );
	}
	
	$result2 = mysql_query ( "DELETE FROM `e-scan`.`hp_anual_window` WHERE `hp_anual_window`.`pav_id` = '" . $pavID . "';" );
	if (! $result2) {
		$retMsg2 = "Ungültige Anfrage.";
		die ( 'Ungültige Anfrage: ' . mysql_error () );
	}
	
	mysql_close ( $link );
	
	return $result2;
}
/**
 * Adds an HLTW to the DB in hp_anual_values and provider_anual_values.
 *
 * @param unknown $year
 *        	The year this HLTW is valid.
 * @param unknown $hltwProcessed        	
 * @return unknown
 */
function addHltw($providerID, $year, $hltwProcessed) {
	$link = mysql_connect ( 'localhost', 'hlzf', 'hlzf' );
	
	if (! $link) {
		$retMsg = "Verbindung schlug fehl.";
		die ( 'Verbindung schlug fehl: ' . mysql_error () );
	}
	
	/*
	 * Add the newyear-provider-config to DB (into "provider_anual_values").
	 */
	$result1 = mysql_query ( 'INSERT INTO  `e-scan`.`provider_anual_values` (`pav_id` ,`provider_id` ,`year` ,`info`) VALUES (NULL ,  ' . $providerID . ',  "' . $year . '",  "");' );
	
	if (! $result1) {
		$retMsg = "Ungültige Anfrage.";
		die ( 'Ungültige Anfrage: ' . mysql_error () );
	}
	
	/*
	 * Get pav-id to use it for the next and final insert-query!
	 */
	$result2 = mysql_query ( 'SELECT `pav_id` FROM `e-scan`.`provider_anual_values` WHERE `provider_id` = "' . $providerID . '" && `year` = "' . $year . '"' );
	
	if (! $result2) {
		$retMsg = "Ungültige Anfrage.";
		die ( 'Ungültige Anfrage: ' . mysql_error () );
	}
	
	while ( $row = mysql_fetch_assoc ( $result2 ) ) {
		$pavID = $row ['pav_id'];
	}
	
	/*
	 * Now send the data to the DB!
	 */
	$insertQuery = "INSERT INTO `e-scan`.`hp_anual_window` (`pav_id`, `season`, `begin`, `end`) VALUES ";
	
	$first = true;
	
	foreach ( $hltwProcessed as $season => $value ) {
		
		foreach ( $value as $timeFrame ) {
			$begin = $timeFrame->begin;
			$end = $timeFrame->end;
			
			if ($first) {
				$insertQuery = $insertQuery . '( "' . $pavID . '", "' . $season . '", "' . $begin . ':00", "' . $end . ':00")';
				$first = false;
			} else {
				$insertQuery = $insertQuery . ',( "' . $pavID . '", "' . $season . '", "' . $begin . ':00", "' . $end . ':00")';
			}
		}
	}
	
	// Now add the HLTW-Frames into "hp_anual_window".
	$result3 = mysql_query ( $insertQuery );
	
	if (! $result3) {
		$retMsg = "Ungültige Anfrage.";
		die ( 'Ungültige Anfrage: ' . mysql_error () );
	}
	
	return $insertQuery;
}
/**
 * Changes all information for a provider when editing it.
 *
 * @param unknown $oldProviderName
 *        	The old name to uniquly identify the provider in the DB.
 * @param unknown $newProviderName
 *        	The new name of the provider.
 * @return unknown Weather the query was successful or not.
 */
function changeProviderInformation($oldProviderName, $newProviderName) {
	$retMsg = "OK";
	
	$link = mysql_connect ( 'localhost', 'hlzf', 'hlzf' );
	if (! $link) {
		$retMsg = "Verbindung schlug fehl.";
		// die ( 'Verbindung schlug fehl: ' . mysql_error () );
	}
	
	$result = mysql_query ( 'UPDATE `e-scan`.`provider` SET `name`="' . $newProviderName . '" WHERE `name`="' . $oldProviderName . '";' );
	
	if (! $result) {
		$retMsg = "Ungültige Anfrage.";
		// die ( 'UngültigeAnfrage: ' . mysql_error () );
	}
	
	mysql_close ( $link );
	
	return $result;
}

/**
 *
 * @author fao
 * @param unknown $providerId
 *        	Id of the provider
 * @return Ambigous <string, multitype:multitype:multitype:string >
 */
function getHLZF($pavID) {
	
	// SELECT * FROM `hp_anual_window` WHERE `pav_id` = (SELECT `pav_id` FROM `provider_anual_values` WHERE `provider_id` = (SELECT `provider_id` FROM `provider` WHERE `name` = "Halberstadtwerke"));
	$link = mysql_connect ( 'localhost', 'hlzf', 'hlzf' );
	if (! $link) {
		die ( 'Verbindung schlug fehl: ' . mysql_error () );
		// echo "Verbindung fehlgeschlagen!";
	}
	// echo 'Erfolgreich verbunden<br>';
	
	$result = mysql_query ( 'SELECT * FROM `e-scan`.`hp_anual_window` WHERE `pav_id` = "' . $pavID . '";' );
	if (! $result) {
		die ( 'Ungültige Anfrage: ' . mysql_error () );
		// echo "ungültige Anfrage!";
	}
	
	// $return = array (
	// "spring" => array (
	// array (
	// "begin" => "10:00",
	// "end" => "13:30"
	// ),
	// array (
	// "begin" => "18:00",
	// "end" => "19:30"
	// )
	// ),
	// "summer" => array (
	// array (
	// "begin" => "11:00",
	// "end" => "12:30"
	// )
	// ),
	// "autum" => array (
	// array (
	// "begin" => "17:00",
	// "end" => "18:45"
	// )
	// ),
	// "winter" => array (
	// array (
	// "begin" => "11:15",
	// "end" => "12:45"
	// ),
	// array (
	// "begin" => "17:00",
	// "end" => "19:15"
	// )
	// )
	// );
	
	$return = array (
			"spring" => array (),
			"summer" => array (),
			"autum" => array (),
			"winter" => array () 
	);
	
	while ( $row = mysql_fetch_assoc ( $result ) ) {
		$season = $row ['season'];
		$begin = $row ['begin'];
		$end = $row ['end'];
		
		$return [$season] [count ( $return [$season] )] = array (
				"begin" => $begin,
				"end" => $end 
		);
	}
	
	return $return;
	// return $return;
}

?>