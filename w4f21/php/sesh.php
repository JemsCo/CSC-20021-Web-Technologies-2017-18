<?php
/**
* This script starts the session if it is not already started.
* it also requires the functions.php file so that all the other php files has access to the functions. 
*/


require_once("functions.php");
if ( is_session_started() === FALSE ) session_start();
?>