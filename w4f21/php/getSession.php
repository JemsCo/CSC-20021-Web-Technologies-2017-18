<?php
/**
* This script responds with a json object of the current session variables.
*/
    require 'sesh.php';
    echo json_encode($_SESSION);
?>