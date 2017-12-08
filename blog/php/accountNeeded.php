<?php
    require 'sesh.php';
    $account = false;
    if(isset($_SESSION['auth'])){
        if($_SESSION['auth'] == true){
            echo json_encode($_SESSION);
        }else{
            echo json_encode($_SESSION);
        }
    }else{
        echo json_encode($_SESSION);
    }
?>