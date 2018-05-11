<?php

/**
 * This script handles the weather widgit on the home page.
 *
 * It responds to the ajax request in session.js with the xml from the rss url that is provided
 * through the GET Method.
 *
 * @package      Default
 * @subpackage   Weather
 * @author       James Copping <w4f21@students.keele.ac.uk>
 */

require 'sesh.php';
if(isset($_GET['url'])){
    $xml = file_get_contents(SanitizeString($_GET['url']));
    $xml = simplexml_load_string($xml);
    echo json_encode($xml);
    unset($xml);
}
?>