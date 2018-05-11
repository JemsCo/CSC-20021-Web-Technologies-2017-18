<?php
/**
 * This script destroys the current session variables and responds to the get method with a message to the user.
 *
 * @package      Default
 * @subpackage   Common
 * @author       James Copping <w4f21@students.keele.ac.uk>
 */

    require 'sesh.php';
    unset($SESSION);
    session_destroy();
	echo"Logged out!";
?>