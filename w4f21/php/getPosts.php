<?php    
/**
* This script responds to the GET Method with the posts.json file from the server.
*/
    require 'sesh.php';
    echo  file_get_contents('posts.json');
?>