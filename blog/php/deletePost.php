<?php

/**
 * This script handles deleting a specific post from the 'posts.json' file on the server.
 *
 * The POST Method takes two variables, finds the post from the user and userpostid values
 * this then splices the array where the post is found, which results in it being deleted
 * the manipulated array is then encoded into json and using the file_put_contents function
 * the file is overridden the file then responds with a message to the user.
 *
 * @package      Default
 * @subpackage   Post
 * @author       James Copping <w4f21@students.keele.ac.uk>
 */

/**
 * Sets up the session.
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