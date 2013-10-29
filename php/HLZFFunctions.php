<?php
function getHLZF($provider) {
	if ($provider == "WR") {
		// DO SOMETHING
		$return = (array (
				"spring" => array (
						"begin" => "10:00",
						"end" => "13:30" 
				) 
		));
	} else {
		$return = "nil";
	}
	
	return  $return;
}

?>