<?php
    require 'sesh.php';

    $title = $content = "";
    $error = array("titleErr"=>"", "contentErr"=>"", "error"=>false);

    if($_SESSION['auth']){
        if ($_SERVER["REQUEST_METHOD"] == "POST") {

            if(empty($_POST['title'])){
                $error['titleErr'] = "Please enter a title";
                $error['error'] = true;
            }else{
                $title = SanitizeString($_POST['title']);
            }

            if(empty($_POST['content'])){
                $error['contentErr'] = "Please enter some text to post to the internet";
                $error['error'] = true;
            }else{
                $content = SanitizeString($_POST['content']);
            }

            if(!$error['error']){
                newPost(array("username"=>$_SESSION['uname'], "userpostid"=>(string)(getlastpostid($_SESSION['uname'])+1), "title"=>$title, "content"=>$content, "datePosted"=>date('d-m-Y'), "dateEdited"=>date('d-m-Y')));
            }
        }
        echo json_encode($error);
    }

    function getlastpostid($username){
        $filedata = json_decode(file_get_contents('posts.json'),true);
        $lastid = 0;
        for($i = 0; $i < sizeof($filedata); $i++){
            if($filedata[$i]['username'] == $username){
                if($filedata[$i]['userpostid'] > $lastid){
                    $lastid = $filedata[$i]['userpostid'];
                }
            }
        }
        return $lastid;
    }
    
    function newPost($postjson){
        $inp = file_get_contents('posts.json');
        $tempArray = json_decode($inp);
        $tempArray[] = $postjson;
        $jsonData = json_encode($tempArray);
        file_put_contents('posts.json', $jsonData);
    }

    function SanitizeString($var){
        $var = strip_tags($var);
        $var = htmlentities($var);
        return stripslashes($var);
    }
?>