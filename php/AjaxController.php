<?php
include_once 'HLZFFunctions.php';
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
				// $result = "Einfacher AJAX-Aufruf war erfolgreich!";
				$result = file_get_contents ( "./templates/html5test.html" );
				
				break;
			
			case "load_localgraph-template" :
				
				// Template in Variable laden und als Rueckgabewert setzen
				$result = file_get_contents ( "./templates/localgraph.html" );
				
				break;
			
			case "load_loadingpage-template" :
				
				// Template in Variable laden und als Rueckgabewert setzen
				$result = file_get_contents ( "./templates/loadingpage.html" );
				
				break;
			
			case "load_loadingpageDEV-template" :
				
				// Template in Variable laden und als Rueckgabewert setzen
				$result = file_get_contents ( "./templates/loadingpageDEV.html" );
				
				break;
			
			case "load_monitoring-template" :
				
				// Template in Variable laden und als Rueckgabewert setzen
				$result = file_get_contents ( "./templates/monitoring.html" );
				
				break;
			
			case "load_hltw-management-template" :
				
				// Template in Variable laden und als Rueckgabewert setzen
				$result = file_get_contents ( "./templates/hltwManagement/hltwManagement.html" );
				
				break;
			
			case "load_hltw-management-createProvider-template" :
				
				// Template in Variable laden und als Rueckgabewert setzen
				$result = file_get_contents ( "./templates/hltwManagement/hltwManagementCreateProvider.html" );
				
				break;
			
			case "load_hltw-management-createHltw-template" :
				
				// Template in Variable laden und als Rueckgabewert setzen
				$result = file_get_contents ( "./templates/hltwManagement/hltwManagementCreateHltw.html" );
				
				break;
			
			case "load_hltw-management-editProvider-template" :
				
				// Template in Variable laden und als Rueckgabewert setzen
				$result = file_get_contents ( "./templates/hltwManagement/hltwManagementEditProvider.html" );
				
				break;
			
			case "getProviders" :
				
				$ret = getProviders ();
				
				$result = json_encode ( $ret );
				
				break;
			
			case "getHLZF" :
				
				$provider = $_POST ['provider'];
				
				$result = json_encode ( getHLZF ( $provider ) );
				
				break;
			
			case "addProvider" :
				
				$providerName = $_POST ['providerName'];
				
				$result = json_encode ( addProvider ( $providerName ) );
				
				break;
			
			case "changeProviderInformation" :
				
				$oldProviderName = $_POST ['oldProviderName'];
				$newProviderName = $_POST ['newProviderName'];
				
				$result = json_encode ( changeProviderInformation ( $oldProviderName, $newProviderName ) );
				
				break;
			
			case "addHltw" :
				
				$hltwProcessed = json_decode ( $_POST ['hltw'] );
				
				$result = json_encode ( addHltw ( $hltwProcessed ) );
				
				break;
			
			default :
				$result = "Ein Fehler ist aufgetreten!";
				
				break;
		}
		
		return $result;
	}
}

?>
