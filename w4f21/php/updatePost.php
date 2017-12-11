<?php

/**
* This script updates a given post's content with the one changed by the user.
* also responds to the request with a message for the user.
*/

    require 'sesh.php';

    $content = "";

    if($_SESSION['auth']){
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $content = SanitizeString($_POST['content']);
            $username = SanitizeString($_POST['username']);
            $userpostid = SanitizeString($_POST['userpostid']);
		//if the user is the one who created the post then the change can be commited
            if($_SESSION['uname'] == $username || $_SESSION['accesslv'] == 1){
                updatePostContents($content, $username,$userpostid);
            }else{
 		//if not then the user is told that they are not allowed to change this post
                echo "<strong>You are not authorised</strong> to commit changes to this post... try reloading the page";
            }
        }
    }
/**
* This function finds the post that is in question and changes the content to the one passed by the post method
* then overrides the post.json file with the new changed one.
*/
    function updatePostContents($c, $username, $userpostid){
        $filedata = json_decode(file_get_contents('posts.json'),true);
        for($i = 0; $i < sizeof($filedata); $i++){
            if($filedata[$i]['username'] == $username){
                if($filedata[$i]['userpostid'] == $userpostid){
                    $filedata[$i]['content'] = $c;
                }
            }
        }
        file_put_contents('posts.json', json_encode($filedata));
        echo "<strong>Changes saved!</strong>";
    }

?>