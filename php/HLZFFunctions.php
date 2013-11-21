<?php

/**
 * @author fao
 * @return multitype:string an Array that contains all providers.
 */
function getProviders() {
	
	// $ret = Array (
	// "nil" => "- Keine Auswahl",
	// "Stadtwerke Werniogerode" => "Stadtwerke Werniogerode",
	// "Halberstadtwerke" => "Halberstadtwerke"
	// );
	
	// $mysqlhost = "localhost:3306"; // MySQL-Host angeben
	// $mysqluser = "hlzf"; // MySQL-User angeben
	// $mysqlpwd = "hlzf"; // Passwort angeben
	
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
function addHltw($hltwProcessed) {
	
	// echo $hltwProcessed;
	
	// $retMsg = "OK";
	
	// $link = mysql_connect ( 'localhost', 'hlzf', 'hlzf' );
	// if (! $link) {
	// $retMsg = "Verbindung schlug fehl.";
	// // die ( 'Verbindung schlug fehl: ' . mysql_error () );
	// }
	
	// $result = mysql_query ( 'INSERT INTO `e-scan`.`provider` (`provider_id` , `name` , `inactive`) VALUES (NULL , "' . $providerName . '", "0" );' );
	// if (! $result) {
	// $retMsg = "Ungültige Anfrage.";
	// // die ( 'Ungültige Anfrage: ' . mysql_error () );
	// }
	
	// mysql_close ( $link );
	
	// echo $hltwProcessed;
	
	// $test = array ("test" => "test2");
	$test = $hltwProcessed;
	
	return $test;
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