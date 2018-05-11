

<?php
/**
 * This script contains the functions that are used throughout the rest of the php files.
 *
 * @package      Default
 * @subpackage   Common
 * @author       James Copping <w4f21@students.keele.ac.uk>
 */

/**
 * This function checks if the session has been or not.
 * @return bool returns the state of the session.
 */
function is_session_started()
{
    if ( php_sapi_name() !== 'cli' ) {
        if ( version_compare(phpversion(), '5.4.0', '>=') ) {
            return session_status() === PHP_SESSION_ACTIVE ? TRUE : FALSE;
        } else {
            return session_id() === '' ? FALSE : TRUE;
        }
    }
    return FALSE;
}

/**
* This returns a sanitized version of the input string.
*
* This means that is stripped of all possible harmful tags and slashes, so that no code is injected into the server through an input element. 
*
* @param string $var input string
* @return string output string is sanitized
*/
function SanitizeString($var){
	$var = strip_tags($var);
	$var = htmlentities($var);
	return stripslashes($var);
}


/**
* This returns a sanitized version of the input string.
*
* This means that is stripped of all possible harmful tags and slashes, so that no code is injected into the server through an input element. 
*
* @param string $data input string 
* @return string output string is sanitized
*/
function test_input($data) {
	$data = trim($data);
	$data = stripslashes($data);
	$data = htmlspecialchars($data);
	return $data;
}
?>