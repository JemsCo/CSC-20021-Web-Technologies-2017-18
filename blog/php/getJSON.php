<?php //getXML
    if(isset($_GET['url'])){
        $xml = file_get_contents(SanitizeString($_GET['url']));
        $xml = simplexml_load_string($xml);
        echo json_encode($xml);
        unset($xml);
    }

    function SanitizeString($var){
        $var = strip_tags($var);
        $var = htmlentities($var);
        return stripslashes($var);
    }
?>