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
		$ret [$name] = $name;
	}
	// echo $ret["Stadtwerke Wernigerode GmbH"];
	mysql_close ( $link );
	
	return $ret;
}
function getHLTWs($provider) {
	
	// $connection = mysql_connect ( $mysqlhost, $mysqluser, $mysqlpwd ) or die ( "Verbindungsversuch fehlgeschlagen" );
	$link = mysql_connect ( 'localhost', 'hlzf', 'hlzf' );
	if (! $link) {
		// die ( 'Verbindung schlug fehl: ' . mysql_error () );
		echo "Verbindung fehlgeschlagen!";
	}
	// echo 'Erfolgreich verbunden<br>';
	
	$result = mysql_query ( 'SELECT  `year` FROM  `e-scan`.`provider_anual_values` WHERE  `provider_id` = ( SELECT `provider_id` FROM  `e-scan`.`provider` WHERE  `name` =  "' . $provider . '");' );
	if (! $result) {
		// die ( 'Ungültige Anfrage: ' . mysql_error () );
		echo "ungültige Anfrage!";
	}
	
	$years = array ();
	
	while ( $row = mysql_fetch_assoc ( $result ) ) {
		$year = $row ['year'];
		$years [$year] = $year;
		// echo $year;
	}
	
	mysql_close ( $link );
	return $years;
}
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
function delProvider($providerName) {
	$retMsg = "OK";
	
	$link = mysql_connect ( 'localhost', 'hlzf', 'hlzf' );
	if (! $link) {
		$retMsg = "Verbindung schlug fehl.";
		// die ( 'Verbindung schlug fehl: ' . mysql_error () );
	}
	
	$result = mysql_query ( "DELETE FROM `e-scan`.`provider` WHERE `provider`.`name` = '" . $providerName . "';" );
	if (! $result) {
		$retMsg = "Ungültige Anfrage.";
		// die ( 'Ungültige Anfrage: ' . mysql_error () );
	}
	
	mysql_close ( $link );
	
	return $result;
}
function addHltw($year, $hltwProcessed) {
	foreach ( $hltwProcessed as $season ) {
		
		foreach ( $season as $timeFrame ) {
			$begin = $timeFrame->begin;
			$end = $timeFrame->end;
		}
	}
	
	$link = mysql_connect ( 'localhost', 'hlzf', 'hlzf' );
	
	if (! $link) {
		$retMsg = "Verbindung schlug fehl.";
		die ( 'Verbindung schlug fehl: ' . mysql_error () );
	}
	
	$result = mysql_query ( 'INSERT INTO  `e-scan`.`provider_anual_values` (`pav_id` ,`provider_id` ,`year` ,`info`) VALUES (NULL ,  "1",  "' . $year . '",  "");' );
	
	if (! $result) {
		$retMsg = "Ungültige Anfrage.";
		die ( 'Ungültige Anfrage: ' . mysql_error () );
	}
	
	return $result;
}
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
		// die ( 'Ungültige Anfrage: ' . mysql_error () );
	}
	
	mysql_close ( $link );
	
	return $result;
}

/**
 *
 * @author fao
 * @param unknown $provider
 *        	Name of the Provider to identify the hltw related to it.
 * @return Ambigous <string, multitype:multitype:multitype:string >
 */
function getHLZF($provider) {
	if ($provider == "Stadtwerke Wernigerode GmbH") {
		
		// $mysqlhost = "localhost"; // MySQL-Host angeben
		// $mysqluser = "hlzf"; // MySQL-User angeben
		// $mysqlpwd = "hlzf"; // Passwort angeben
		
		// $connection = mysql_connect ( $mysqlhost, $mysqluser, $mysqlpwd );
		
		// DO SOMETHING
		$return = array (
				"spring" => array (
						array (
								"begin" => "10:00",
								"end" => "13:30" 
						),
						array (
								"begin" => "18:00",
								"end" => "19:30" 
						) 
				),
				"summer" => array (
						array (
								"begin" => "11:00",
								"end" => "12:30" 
						) 
				),
				"autum" => array (
						array (
								"begin" => "17:00",
								"end" => "18:45" 
						) 
				),
				"winter" => array (
						array (
								"begin" => "11:15",
								"end" => "12:45" 
						),
						array (
								"begin" => "17:00",
								"end" => "19:15" 
						) 
				) 
		);
	} else {
		$return = "nil";
	}
	
	return $return;
}

?>