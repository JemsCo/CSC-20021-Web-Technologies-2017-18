<?php
/**
 * This script starts the session if it is not already started.
 *
 * It also requires the functions.php file so that all the other php files has access to the functions. 
 *
 * @package      Default
 * @subpackage   Common
 * @author       James Copping <w4f21@students.keele.ac.uk>
 */


require_once("functions.php");
if ( is_session_started() === FALSE ) session_start();
?>