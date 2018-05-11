<?php

/**
* This script handles the signup modal input, responds to the post method request with a json object that determines
* if the request had any errors in the input forms on the signup modal.
* If not then the new users details will be appeded to the userdata.json file.
*/

    require 'sesh.php';

    // define variables and set to empty values
    $uname = $email = $password = $repassword = $fname = $surname = "";
    $error = array("usernameErr"=>"", "emailErr"=>"", "passwordErr"=>"", "repasswordErr"=>"", "fname"=>"", "surname"=>"","error"=>false);
    
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        if(empty($_POST['username'])){
            $error['usernameErr'] = "Username is required";
            $error['error'] = true;
        }else{
            $uname = strtolower(test_input($_POST["username"]));
            if (!preg_match('/^[A-Za-z]{1}[A-Za-z0-9]{4,24}$/', $uname)) {
                $error['usernameErr'] = "Must start with a letter, 5-24 characters, Letters and numbers only";
                $error['error'] = true;
            }else if(exists($uname,"username")){
                $error['usernameErr'] = "Username already exists";
                $error['error'] = true;
            }
        }

        if(empty($_POST['fname'])){
            $error['fnameErr'] = "Firstname is required";
            $error['error'] = true;
        }else{ 
            $fname = ucfirst(test_input($_POST["fname"]));
            if (!preg_match("/^[A-Za-z]+(((\'|\-|\.)?([A-Za-z])+))?$/", $fname)) {
                $error['fnameErr'] = "Invalid firstname format";
                $error['error'] = true;
            }
        }
        if(empty($_POST['surname'])){
            $error['surnameErr'] = "Surname is required";
            $error['error'] = true;
        }else{ 
            $surname = ucfirst(test_input($_POST["surname"]));
            if (!preg_match("/^[A-Za-z]+(((\'|\-|\.)?([A-Za-z])+))?$/", $surname)) {
                $error['surnameErr'] = "Invalid surname format";
                $error['error'] = true;
            }
        }

        if(empty($_POST['email'])){
            $error['emailErr'] = "Email is required";
            $error['error'] = true;
        }else{ 
            $email = strtolower(test_input($_POST["email"]));
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $error['emailErr'] = "Invalid email format";
                $error['error'] = true;
            }elseif(exists($email,"email")){
                    $error['emailErr'] = "Email is already in use";
                    $error['error'] = true;
            }
        }
        
        if(empty($_POST['password'])){
            $error['passwordErr'] = "Password is required";
            $error['error'] = true;
        }else{
            $password = test_input($_POST["password"]);
            if(!preg_match('/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/', $password)){
                $error['passwordErr'] = "Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters";
                $error['error'] = true;
            }
        }

        if(empty($_POST['repassword'])){
            $error['repasswordErr'] = "Re-enter password is required";
            $error['error'] = true;
        }else{
            $repassword = test_input($_POST["repassword"]);
            if($repassword != $password){
                $error['repasswordErr'] = "Passwords do not match";
                $error['error'] = true;
            }
        }

        if(!$error['error']){
            $inp = file_get_contents('userdata.json');
            $tempArray = json_decode($inp);
            $tempArray[] = array("username"=>$uname, "password"=>$password, "email"=>$email, "fname"=>$fname, "surname"=>$surname, "datejoined"=>date("d-m-Y"));
            $jsonData = json_encode($tempArray);
            file_put_contents('userdata.json', $jsonData);
        }
        echo json_encode($error);
    }

/**
* This function checks if a part of the userser details that they entered already exist on file.
* meaning there is an error and the user will have to try again.
* @param str $userdata The First parameter
* @param str &key The Second parameter
* @return bool
*/
    function exists($userdata, $key){
        $filedata = json_decode(file_get_contents('userdata.json'),true);
        for($i = 0; $i < sizeof($filedata); $i++){
            if($filedata[$i][$key] == $userdata){
                return true;
            }
        }
        return false;
    }

?>