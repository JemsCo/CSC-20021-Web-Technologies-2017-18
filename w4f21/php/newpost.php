<?php
/**
* This script handles the infomation for a new post from a user.
* The requested post method takes four variables with make up the post.
* it also handles all the validation for the html form while resposing with error messages for those forms entered incorrectly
*/

    require 'sesh.php';

    $title = $summary = $content = $image= "";
    $response  = array("titleErr"=>"", "summaryErr"=>"", "contentErr"=>"", "error"=>false ,"message"=>"");

    if($_SESSION['auth']){
        if ($_SERVER["REQUEST_METHOD"] == "POST") {

            if(empty($_POST['title'])){
                $response ['titleErr'] = "Please enter a title";
                $response ['error'] = true;
            }else{
                $title = strtoupper(SanitizeString($_POST['title']));
            }

            if(empty($_POST['summary'])){
                $response ['summaryErr'] = "Please enter some text to summarize your post";
                $response ['error'] = true;
            }else{
                $summary = SanitizeString($_POST['summary']);
            }

            if(empty($_POST['content'])){
                $response ['contentErr'] = "Please enter some text to post to the internet";
                $response ['error'] = true;
            }else{
                $content = SanitizeString($_POST['content']);
            }

            if(empty($_POST['image'])){
            }else{
                $image = SanitizeString($_POST['image']);
            }
		//if there where no errors then the new post funciton is called with an array of the post infomation
            if(!$response ['error']){
                newPost(array("username"=>$_SESSION['uname'], "userpostid"=>(string)(getlastpostid($_SESSION['uname'])+1), "title"=>$title, "summary"=>$summary, "content"=>$content, "image"=>$image, "datePosted"=>date('d-m-Y'), "dateEdited"=>date('d-m-Y')));
            }
        }
        echo json_encode($response);
    }

/**
* This function takes in a string variable which is a username and returns the value of the
* greatest userpostid so that all the posts for one user have a unique identifier.
* @param str $username The First parameter
* @return int 
*/
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
    
/**
* This function pushes the new post infomation onto the array of the post.json file.
* then overrides file with the new post data array.
* @param array $postjson The first parameter
*/
    function newPost($postjson){
        $inp = file_get_contents('posts.json');
        $tempArray = json_decode($inp);
        $tempArray[] = $postjson;
        $jsonData = json_encode($tempArray);
        file_put_contents('posts.json', $jsonData);
        $response['message'] = "New post has been uploaded!";
    }

?>