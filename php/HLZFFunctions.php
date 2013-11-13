<?php
function getProviders() {
	$ret = Array (
			"nil" => "- Keine Auswahl",
			"Stadtwerke Werniogerode" => "Stadtwerke Werniogerode",
			"Halberstadtwerke" => "Halberstadtwerke" 
	);
	
	// $mysqlhost = "localhost"; // MySQL-Host angeben
	// $mysqluser = "hlzf"; // MySQL-User angeben
	// $mysqlpwd = "hlzf"; // Passwort angeben
	
	// $connection = mysql_connect ( $mysqlhost, $mysqluser, $mysqlpwd ) or die ( "Verbindungsversuch fehlgeschlagen" );
	
	return $ret;
}

/**
 *
 * @author fao
 * @param unknown $provider        	
 * @return Ambigous <string, multitype:multitype:multitype:string >
 */
function getHLZF($provider) {
	if ($provider == "Stadtwerke Werniogerode") {
		
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