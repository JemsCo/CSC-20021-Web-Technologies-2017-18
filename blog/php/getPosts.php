<?php 
/**
 * This script responds to the GET Method with the posts.json file from the server.
 *
 * @package      Default
 * @subpackage   Post
 * @author       James Copping <w4f21@students.keele.ac.uk>
 */

/**
 * Sets up the session.
 */
require 'sesh.php';
echo  file_get_contents('posts.json');
?>