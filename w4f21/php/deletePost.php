<?php
/**
* This file handles deleting a specific post from the 'posts.json' file on the server.
*
* The POST Method takes two variables, finds the post from the user and userpostid values.
* This then splices the array where the post is found, which results in it being deleted.
* The manipulated array is then encoded into json and using the file_put_contents function the file is overridden.
* The file then responds with a message to the user.
*/

    require 'sesh.php';
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        if(!empty($_POST['username'])){
            $username = $_POST['username'];
        }
        if(!empty($_POST['userpostid'])){
            $userpostid = $_POST['userpostid'];
        }

        $inp = file_get_contents('posts.json');
        $tempArray = json_decode($inp, true);
        for($i = 0; $i < sizeof($tempArray); $i++){
            if($tempArray[$i]['username'] == $username){
                if($tempArray[$i]['userpostid'] == $userpostid){
                    array_splice($tempArray, $i, 1);
                }
            }
        }
        $jsonData = json_encode($tempArray);
        file_put_contents('posts.json', $jsonData);
    }
    echo "Post has been deleted";
?>