<?php
/**
 * This script responds with a json object of the current session variables.
 *
 * @package      Default
 * @subpackage   Common
 * @author       James Copping <w4f21@students.keele.ac.uk>
 */
    require 'sesh.php';
    echo json_encode($_SESSION);
?>