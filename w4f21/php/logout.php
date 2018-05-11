<?php
/**
* This script destroys the current session variables and responds to the get method with a
* message to the user.
*/

    require 'sesh.php';
    unset($SESSION);
    session_destroy();
	echo"Logged out!";
?>