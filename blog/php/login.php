<?php //login.php
  require 'sesh.php';
  $_SESSION['auth'] = false;
  $_SESSION['uname'] = false;
  $_SESSION['error'] = false;
  if(isset($_POST['username'])){
    if(isset($_POST['password'])){
      // get form data
      $user = test_input(strtolower($_POST['username']));
      $pass = test_input($_POST['password']);
      //check the userdata for the username and then that password to see if they match
      $filedata = json_decode(file_get_contents('userdata.json'),true);
      for($i = 0; $i < sizeof($filedata); $i++){
        if($filedata[$i]['username'] == $user){
          if($filedata[$i]['password'] == $pass){
            //set user session variables
            $_SESSION['auth'] = true;
            $_SESSION['uname'] = $user;  
          }else{
            $_SESSION['error'] = "Input error - password entered incorrectly!";
          }
          break;
        }else{
          $_SESSION['error'] = "Input error - Username entered incorrectly!";
        }
      }
    }else{
      $_SESSION['error'] = "Input error - please enter your password!";
    }
  }else{
    $_SESSION['error'] = "Input error - please enter your username!";
  }
  require 'getSession.php';


  function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
  }
?>