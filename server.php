<?php

// Benoetigter AjaxController wird eingebunden
require_once 'php/AjaxController.php';

// Neue Instanz des Controllers anlegen
$ajaxController = new AjaxController();

// Controller ausfuehren
echo $ajaxController->execute();
?>