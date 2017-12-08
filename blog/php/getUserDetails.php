<?php

$name = "dufault_name";

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        if(!empty($_POST['username'])){
            $username = $_POST['username'];
        }

        $filedata = json_decode(file_get_contents('userdata.json'),true);
        for($i = 0; $i < sizeof($filedata); $i++){
        if($filedata[$i]['username'] == $username){
                $name = $filedata[$i]['fname'];
                //$name = $name + " " + $filedata[$i]['surname'];
                break;
            }   
        }
    }

    echo json_encode($name);
?>