<?php
class AjaxController {
	
	/**
	 * Standard-Konstruktor
	 */
	public function __construct() {
	}
	
	/**
	 * AJAX-Methode ausfuehren
	 */
	public function execute() {
		// Aufgerufene Methode
		$method = "";
		
		// JSON-Objekt falls vorhanden
		$jsonObject = null;
		
		// Rueckgabeobjekt
		$result = "";
		
		// Rueckgabe als JSON-Objekt
		$responseJson = false;
		
		// Unsichere Methode um POST-Variablen zu speichern, sollte jedoch
		// fuer unser Tutorial ausreichend sein. Die POST-Variablen sollten aus
		// Sicherheitsgruenden immer escaped werden!
		if (isset ( $_POST ['method'] )) {
			$method = $_POST ['method'];
		}
		
		// Pruefen ob ein JSON-Objekt gesetzt ist
		if (isset ( $_POST ['jsonObject'] )) {
			// JSON-String parsen damit auf das Objekt zugegriffen werden kann
			$jsonObject = json_decode ( $_POST ['jsonObject'] );
			
			// Ausgabe soll als JSON-Objekt erfolgen
			$responseJson = true;
		}
		
		// Springt in die jeweilige Methode, welche beim AJAX-Aufruf angegeben wurde
		switch ($method) {
			case "testcall" :
				
				// Meldung als Rueckgabewert setzen
				$result = "Einfacher AJAX-Aufruf war erfolgreich!";
				
				break;
			
			default :
				$result = "Ein Fehler ist aufgetreten!";
				
				break;
		}
		
		return $result;
	}
}

?>
