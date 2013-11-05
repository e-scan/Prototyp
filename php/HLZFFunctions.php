<?php
function getHLZF($provider) {
	if ($provider == "WR") {
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