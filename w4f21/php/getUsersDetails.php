<?php

/**
* This script responds with a json object of all the requested user details.
*/

    require 'sesh.php';
    if ($_SERVER["REQUEST_METHOD"] == "GET") {
        if(!empty($_GET['username'])){
            $username = $_GET['username'];
        }
        $userdetail = array();

        $filedata = json_decode(file_get_contents('userdata.json'),true);
        for($i = 0; $i < sizeof($filedata); $i++){
            if($filedata[$i]['username'] == $username){
                $userdetail['fname'] = $filedata[$i]['fname'];
                $userdetail['surname'] = $filedata[$i]['surname'];
                $userdetail['email'] = $filedata[$i]['email'];
                $userdetail['datejoined'] = $filedata[$i]['datejoined'];
            }   
        }
    }

    echo json_encode($userdetail);
?>