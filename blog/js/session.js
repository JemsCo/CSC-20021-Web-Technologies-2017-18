$(document).ready(function () {
    //setting the global alert message that is kept in local storage.
    message();
    //setting the users local preferences font size and heading background color
    if (localStorage.getItem("headerSize") !== null) {
        setFontSize(localStorage.getItem("headerSize"));
    }
    if (localStorage.getItem("headerColor") !== null) {
        setHeaderColor(localStorage.getItem("headerColor"));
    }

	//maintain the users username for later use
    var username = "";
	//init the windo scroll bar var for later use, this is used to maintain the uses postion on a page even after dynamic elements are added to the window.
    var tempScrollTop = $(window).scrollTop();
	//simple call back function from the logged in function below that passes the logged in username , if there is on. used throughout the anonymous function.
    loggedin(function (session) {
		//store the session username.
        username = session['uname'];
		//limit what functions are called depending on the currently loaded page
        if (location.href.includes("index.html")) {
			//if on index.html then display a summary of the last 2 post from any user 
			displaySummaryPostList('#recentposts', 2, "");
			//set interval for auto checking that a new post has been uploaded
            setInterval(function () {
				//tempScrollTop maintains the users position on the page
                tempScrollTop = $(window).scrollTop();
				//refresh the element every 10 seconds
                displaySummaryPostList('#recentposts', 2, "");
				//reset scroll location
				$(window).scrollTop(tempScrollTop);
            }, 10000);
        } else if (location.href.includes("posts.html")) {
			//if the page is posts.html, this the last 100 posts from all users in the #allposts element
            displaySummaryPostList('#allposts', 100, "");
        } else if (location.href.includes("account.html")) {
			//is the location is account.html then the page will load the currently logged in user by defualt.
            var usernameLook = "";
			//but if the url contains a different username then their account will be loaded instead.
            if (!location.href.includes("?")) {
                usernameLook = username;
            } else {
                //get the username of the account that you are looking for from the url
                usernameLook = location.href.substring(location.href.indexOf("=") + 1, location.href.length);
            }
			//display users account profile
            $('#pageTitle').text("~" + usernameLook);
			//displays a summary of all the specific users posts on the page
            displaySummaryPostList('#recentposts', 100, usernameLook);
			//fills in userinfo element with all relevent user details
            fillUserInfo(usernameLook);
        } else if (location.href.includes("post.html")) {
			//displays full post.
            displayFullPost();
        }

		//uploading image from the new post modal
		//user selects img and pressed upload for the img to be used in the post as a cover photos
        $("#uploadimage").on('submit', (function (e) {
            e.preventDefault();
            $("#pimageErr").empty();
            $.ajax({
                url: "php/uploadImage.php", // Url to which the request is send
                type: "POST", // Type of request to be send, called as method
                data: new FormData(this), // Data sent to server, a set of key/value pairs (i.e. form fields and values)
                contentType: false, // The content type used when sending data to the server.
                cache: false, // To unable request pages to be cached
                processData: false, // To send DOMDocument or non processed data file it is set to false
                success: function (data) // A function to be called if request succeeds
                {
                    $("#pimageErr").show();
                    $("#pimageErr").html(data);
                }
            });
        }));

        // Function to preview image after validation
        $(function () {
            $("#file").change(function () {
                var file = this.files[0];
                var imagefile = file.type;
                var match = ["image/jpeg", "image/png", "image/jpg"];
                if (!((imagefile == match[0]) || (imagefile == match[1]) || (imagefile == match[2]) || (imagefile == match[2]))) {
                    $('#previewing').attr('src', 'noimage.png');
                    return false;
                } else {
                    var reader = new FileReader();
                    reader.onload = imageIsLoaded;
                    reader.readAsDataURL(this.files[0]);
                }
            });
        });

        function imageIsLoaded(e) {
            $("#file").css("color", "green");
            $('#image_preview').css("display", "block");
            $('#previewing').attr('src', e.target.result);
            $('#previewing').attr('width', '250px');
            $('#previewing').attr('height', '250px');
        };
    });
});

//generic php handler function
//returns either plain text or an array with keys, depending on the php file requested.
function handlePHP(url, callback) {
	//open new request
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
		//when the server has completed the request and a response is given
        if (this.readyState == 4 && this.status == 200) {
			//returns the callback perameter and parses it to an arry, if it is a json object.
			if(this.responseText.startsWith("{")||this.responseText.startsWith("[")){
				callback(JSON.parse(this.responseText));
			}else{
				//or it just passes the plain text echo'ed from the php file.
				callback(this.responseText);
			}
        }
    };
	//sends get request to the specified server file.
    request.open("GET", "php/" + url, true);
    request.send();
}

//this function checks is the user is logged in or not, then populates the current page with
//login and sign up buttons if the user is not logged in. Other wize it will populate the page
//with 'new post, and account buttons as well as logout option.

function loggedin(callback) {
	//gets session info to check if the user is logged in or not.
    handlePHP("getSession.php", function (session) {
        $('#navbarRight').html("");
        if (session['auth']) {
			//define new post button which handles the new post modal
            var newPost = "<button class='btn btn-success' type='button' data-toggle='modal' data-target='#newpostModal'><i class='fa fa-plus-square' aria-hidden='true'></i> New Post</button>"
			
			//define the account button and the logout drop down box
			//logout function defined below is called on click of the log out button
            var dropdown = "<button type='button' class='btn btn-info' onclick='gotoAccount()'><i class='fa fa-user'> </i> " + session.uname.toUpperCase() + "</button><button type='button' class='btn btn-info dropdown-toggle dropdown-toggle-split' data-toggle='dropdown'><span class='caret'></span></button><div class='dropdown-menu dropdown-menu-right'><button class='dropdown-item' >Settings</button><div class='dropdown-divider'></div><button class='dropdown-item' onclick='logout()'>Logout</button></div>";

			//this modal fades in when the user clicks on the newpost button.
			//this is where the user can enter all the information that they want
			//to include in their post. title, summary, content, image.
			
            var newpostModal = "<!-- Modal --><div class='modal fade' id='newpostModal' role='dialog'><div class='modal-dialog modal-lg'><!-- Modal content--><div class='modal-content'><div class='modal-header'><h4 class='modal-title'>New Post Form</h4><button type='button' class='close' data-dismiss='modal'>&times;</button></div><div class='modal-body'><div id='newpostForm'><div class='form-group'><label class='control-label col-sm-offset-2' for='ptitle'>Title:</label><div class='col-sm-12'><input type='text' maxlength='30' class='form-control' id='ptitle' placeholder='Enter title'><div id='ptitleErr' class='alert alert-danger' style='display:none;'></div></div></div><div class='form-group'><label class='control-label col-sm-offset-2' for='psummary'>Summary:</label><div class='col-sm-12'><input type='text' maxlength='140' class='form-control' id='psummary' placeholder='Enter summary'><div id='psummaryErr' class='alert alert-danger' style='display:none;'></div></div></div><div class='form-group'><label class='control-label col-sm-offset-2' for='pcontent'>Post Content:</label><div class='col-sm-12'><textarea type='text' class='form-control' id='pcontent' placeholder='Enter content'></textarea><div id='pcontentErr' class='alert alert-danger' style='display:none;'></div></div></div><form id='uploadimage' action='' method='post' enctype='multipart/form-data'><div id='image_preview' class='d-flex justify-content-center'><img id='previewing' style='height: 200px; object-fit: cover' src='' /></div><hr id='line'><div id='selectImage'><label>Select Your Image</label><br/><input type='file' name='file' id='file' /><input type='submit' value='Upload' class='submit' /><div id='pimageErr' class='alert alert-danger' style='display:none;'></div></div></form><div class='modal-footer'><div id='newpostErr' class='alert alert-success' style='display:none;'></div><div class='form-group btn-group float-right'><button id='postbutton' type='submit' class='btn btn-success' onclick='newpost()'>Post</button><button type='button' class='btn btn-danger' data-dismiss='modal'>Close</button></div></div></div></div></div></div></div>";
			//adds all the elements needed
            $('body').append(newpostModal);
            $('#navbarRight').append(newPost);
            $('#navbarRight').append(dropdown);

        } else {
			
			//define signup button which controls the the signup modal
            var signupButton = "<button type='button' class='btn btn-primary' data-toggle='modal' data-target='#signupModal'><i class='fa fa-user-plus' aria-hidden='true'></i>  Sign-Up</button>";
			//define login button which controls the login modal.
            var loginButton = "<button type='button' class='btn btn-primary' data-toggle='modal' data-target='#loginModal'><i class='fa fa-sign-in' aria-hidden='true'></i>  Login</button>";
			
			//add butons to nav bar
            $('#navbarRight').append(signupButton);
            $('#navbarRight').append(loginButton);
			
			//define both the signup and login modals in one
			//signup conatins first and last name, email, username and password fields for the user to enter.
			//login modal requires username and the matching password.
			//both modals handle validation of each input.
            var signloginModal = "<!-- Modal --><div class='modal fade' id='loginModal' role='dialog'><div class='modal-dialog'><!-- Modal content--><div class='modal-content'><div class='modal-header'><h4 class='modal-title'>Login Form</h4><button type='button' class='close' data-dismiss='modal'>&times;</button></div><div class='modal-body'><div id='loginForm'><div class=' form-group'><label class='control-label col-sm-offset-2' for='lusername'>Username:</label><div class='col-sm-12'><input type='text' class='form-control' id='lusername' placeholder='Enter username'></div></div><div class='form-group'><label class='control-label col-sm-offset-2' for='lpassword'>Password:</label><div class='col-sm-12'><input type='password' class='form-control' id='lpassword' placeholder='Enter password'></div></div><div class='modal-footer'><div id='loginerror' class='alert alert-danger' style='display:none;'></div><div class='form-group btn-group float-right'><button type='submit' class='btn btn-success' onclick='login()'>Login</button><button type='button' class='btn btn-danger' data-dismiss='modal'>Close</button></div></div></div></div></div></div></div><!-- Modal --><div class='modal fade' id='signupModal' role='dialog'><div class='modal-dialog'><!-- Modal content--><div class='modal-content'><div class='modal-header'><h4 class='modal-title'>Sign-Up Form</h4><button type='button' class='close' data-dismiss='modal'>&times;</button></div><div class='modal-body'><div id='signinForm'><div class='form-group'><label class='control-label col-sm-offset-2' for='sfname'>First Name:</label><div class='col-sm-12'><input type='text' class='form-control' id='sfname' placeholder='Enter first name'></div><div id='fnameErr' class='alert alert-danger' style='display:none;'></div></div><div class='form-group'><label class='control-label col-sm-offset-2' for='ssurname'>Surname:</label><div class='col-sm-12'><input type='text' class='form-control' id='ssurname' placeholder='Enter surname'></div><div id='surnameErr' class='alert alert-danger' style='display:none;'></div></div><div class=' form-group'><label class='control-label col-sm-offset-2' for='semail'>Email:</label><div class='col-sm-12'><input type='email' class='form-control' id='semail' placeholder='Enter email'></div><div id='emailErr' class='alert alert-danger' style='display:none;'></div></div><div class='form-group'><label class='control-label col-sm-offset-2' for='susername'>Username:</label><div class='col-sm-12'><input type='text' class='form-control' id='susername' placeholder='Enter username'></div><div id='usernameErr' class='alert alert-danger' style='display:none;'></div></div><div class='form-group'><label class='control-label col-sm-offset-2' for='spassword'>Password:</label><div class='col-sm-12'><input type='password' class='form-control' id='spassword' placeholder='Enter Password'></div><div id='passwordErr' class='alert alert-danger' style='display:none;'></div></div><div class='form-group'><label class='control-label col-sm-offset-2' for='srepassword'>Re-enter Password:</label><div class='col-sm-12'><input type='password' class='form-control' id='srepassword' placeholder='Re-enter Password'></div><div id='repasswordErr' class='alert alert-danger' style='display:none;'></div></div><p>By creating an account you agree to our <a href='#'>Terms & Privacy</a>.</p><div class='modal-footer'><div id='signinerror' class='alert alert-danger' style='display:none;'></div><div class='form-group btn-group float-right'><button type='submit' class='btn btn-success' onclick='signup()'>SignUp</button><button type='button' class='btn btn-danger' data-dismiss='modal'>Close</button></div></div></div></div></div></div></div>";
            $('body').append(signloginModal);
        }
		//sends session data back in callback.
		callback(session);
    });
}

//this function handles the post request and display of the signup modal input.
function signup() {
	//starts new request
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var signup = JSON.parse(this.responseText);
			//if the file returns error as true then display all alerts in the correct fields
			//mostly self explanatory.
            if (signup['error']) {
                if (signup['fnameErr']) {
                    $('#fnameErr').css('display', 'block');
                    $('#fnameErr').text(signup['fnameErr']);
                } else {
                    $('#fnameErr').css('display', 'none');
                    $('#fnameErr').text(signup['fnameErr']);
                }
                if (signup['surnameErr']) {
                    $('#surnameErr').css('display', 'block');
                    $('#surnameErr').text(signup['surnameErr']);
                } else {
                    $('#surnameErr').css('display', 'none');
                    $('#surnameErr').text(signup['surnameErr']);
                }
                if (signup['usernameErr']) {
                    $('#usernameErr').css('display', 'block');
                    $('#usernameErr').text(signup['usernameErr']);
                } else {
                    $('#usernameErr').css('display', 'none');
                    $('#usernameErr').text(signup['usernameErr']);
                }
                if (signup['emailErr']) {
                    $('#emailErr').css('display', 'block');
                    $('#emailErr').text(signup['emailErr']);
                } else {
                    $('#emailErr').css('display', 'none');
                    $('#emailErr').text(signup['emailErr']);
                }
                if (signup['passwordErr']) {
                    $('#passwordErr').css('display', 'block');
                    $('#passwordErr').text(signup['passwordErr']);
                } else {
                    $('#passwordErr').css('display', 'none');
                    $('#passwordErr').text(signup['passwordErr']);
                }
                if (signup['repasswordErr']) {
                    $('#repasswordErr').css('display', 'block');
                    $('#repasswordErr').text(signup['repasswordErr']);
                } else {
                    $('#repasswordErr').css('display', 'none');
                    $('#repasswordErr').text(signup['repasswordErr']);
                }
            } else {
				//if there was no error then the sign up was successful.
				// the users data is not saved in userdata.json and the signup modal fades away
                setTimeout(function () {
                    $('#signupModal').modal('hide');
                }, 500);
				//automaticly pulls up the login modal ready for the user to login.
                setTimeout(function () {
                    $('#loginModal').modal('show');
                }, 500);
				//sets the global msg to alert the user to if the signup was successful
                localStorage.setItem("message", "<div id='closemessage' class='alert alert-info alert-fixed alert-dismissable'>Sign up successful!<a  class='close' data-dismiss='alert' aria-label='close' onclick='closemessage()'>&times;</a></div>");
				//displays msg on screen
                message();
            }
        } else {
			//while the server is responding the modal changes to signingup...
            $('#signinerror').text("Signin up...");
        }
    }
	//sends post data after setting the string url
	//email, username, firstname, surname and password + repasswords are sent through the request
    request.open("POST", "php/signup.php", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send("email=" + $('#semail').val() + "&username=" + $('#susername').val() + "&password=" + $('#spassword').val() + "&repassword=" + $('#srepassword').val() + "&fname=" + $('#sfname').val() + "&surname=" + $('#ssurname').val());
}

//this function hadles the user pressing the edit post button on the post.html page
//this allows the user to change the contents of the post contents div directly
function editPost() {
	//gets the currently displaying posts username and userpostid
	//so that only the user (who created the post) and the admin can edit the content.
    var args = location.href.substring(location.href.indexOf("?") + 1, location.href.length);
    var username = args.substring(args.indexOf("=") + 1, args.indexOf("&"));
    var userpostid = args.substring(args.lastIndexOf("=") + 1, args.length);

	//gets the current session user login details and compares them to see if the user will be
	//able to access and change the posts content.
    handlePHP("getSession.php", function (session) {
        if (session['uname'] == username || session['accesslvl'] == 1) {
			//if the user is good to edit the post change the element to editable
            $('#postcontent').attr('contenteditable', true);
			//display extra buttons from save and cancel functionality
            $('#saveButton').show();
            $('#cancelButton').show();
			
			//sets the global msg to warn the user they are now editing the post
            localStorage.setItem("message", "<div id='closemessage' class='alert alert-warning alert-fixed alert-dismissable' >You are now EDITING this post... just press save to commit changes<a  class='close' data-dismiss='alert' aria-label='close' onclick='closemessage()'>&times;</a></div>");

            message();
        } else {
			//sets the global msg to warn the user that they can't edit this post
            localStorage.setItem("message", "<div id='closemessage' class='alert alert-warning alert-fixed alert-dismissable' >You can't edit a post that isn't yours...<a  class='close' data-dismiss='alert' aria-label='close' onclick='closemessage()'>&times;</a></div>");
            message();
        }
    });
}

//this function saves the new post content by updating the posts.json file with the changes
function saveEdit() {
	
	//gets the currently displaying posts username and userpostid
	//so that only the user (who created the post) and the admin can edit the content.
    var args = location.href.substring(location.href.indexOf("?") + 1, location.href.length);
    var username = args.substring(args.indexOf("=") + 1, args.indexOf("&"));
    var userpostid = args.substring(args.lastIndexOf("=") + 1, args.length);

	//maintains the line breaks of the edit -- this does not actually work, whoops!
    var content = $('#postcontent').html().replace(/\n/g,'<br/>');

	//new request started
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var updatepost = this.responseText;
			//notifys the user that the changes they made have been saved
            localStorage.setItem("message", "<div id='closemessage' class='alert alert-success alert-fixed alert-dismissable'>" + updatepost + "<a  class='close' data-dismiss='alert' aria-label='close' onclick='closemessage()'>&times;</a></div>");
            message();
            location.reload();
        }
    }
	//sends post data and the new content to be saved in the json file by the server calling the updatePost.php file.
    request.open("POST", "php/updatePost.php", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send("username=" + username + "&userpostid=" + userpostid + "&content=" + content);
}

//this function hadles the cancel edit button that appears once the user had chosen to edit the post.
function cancelEdit() {
	//reverts the div to not editable.
    $('#postcontent').attr('contenteditable', false);
	//hides save and cancel buttons
    $('#saveButton').hide();
    $('#cancelButton').hide();
	//warns the user that the changes where not saved and that they are no loger editting the post 
    localStorage.setItem("message", "<div id='closemessage' class='alert alert-warning alert-fixed alert-dismissable'>Editing canceled! no changes saved<a  class='close' data-dismiss='alert' aria-label='close' onclick='closemessage()'>&times;</a></div>");
    message();
    location.reload();
}

function deletePost() {
	//gets the currently displaying posts username and userpostid
	//so that only the user (who created the post) and the admin can edit the content.
    var args = location.href.substring(location.href.indexOf("?") + 1, location.href.length);
    var username = args.substring(args.indexOf("=") + 1, args.indexOf("&"));
    var userpostid = args.substring(args.lastIndexOf("=") + 1, args.length);

	//hadles very similar to the edit post function defined above.
    handlePHP("getSession.php", function (session) {
        if (session['uname'] == username || session['accesslvl'] == 1) {
			//if the user is able to access the post then start new request for the post to be deleted
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var deletepost = this.responseText;
                    //say that the post has been deleted
                    //location.href = "account.html";
                    localStorage.setItem("message", "<div id='closemessage' class='alert alert-danger alert-fixed alert-dismissable' >" + deletepost + "<a  class='close' data-dismiss='alert' aria-label='close' onclick='closemessage()'>&times;</a></div>");
                    message();
                    redirect("account.html");
                }
            }
			//sends the post data that is needed tot eh deletePost.php file to find and remove the post
            request.open("POST", "php/deletePost.php", true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.send("username=" + username + "&userpostid=" + userpostid);
        } else {
			//if the user can not edit the post then warn them
            localStorage.setItem("message", "<div id='closemessage' class='alert alert-warning alert-fixed alert-dismissable' >You can't delete a post that isn't yours...<a  class='close' data-dismiss='alert' aria-label='close' onclick='closemessage()'>&times;</a></div>");
            message();
        }
    });
}

//this function handles the new post modal input  with ajax request
function newpost() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var newpost = JSON.parse(this.responseText);
			//handle visual alerts if there was an error in validation
            if (newpost['error']) {
                if (newpost['titleErr']) {
                    $('#ptitleErr').css('display', 'block');
                    $('#ptitleErr').text(newpost['titleErr']);
                } else {
                    $('#ptitleErr').css('display', 'none');
                    $('#ptitleErr').text(newpost['titleErr']);
                }
                if (newpost['summaryErr']) {
                    $('#psummaryErr').css('display', 'block');
                    $('#psummaryErr').text(newpost['summaryErr']);
                } else {
                    $('#psummaryErr').css('display', 'none');
                    $('#psummaryErr').text(newpost['summaryErr']);
                }
                if (newpost['contentErr']) {
                    $('#pcontentErr').css('display', 'block');
                    $('#pcontentErr').text(newpost['contentErr']);
                } else {
                    $('#pcontentErr').css('display', 'none');
                    $('#pcontentErr').text(newpost['contentErr']);
                }
            } else {
				//otherwise the post was successful
                $('#newpostErr').show();
                $('#newpostErr').text('Uploading...');
				//hide the new post modal 
				setTimeout(function () {
					$('#newpostModal').modal('hide');
					$('#newpostErr').hide();
				}, 1500);
				//set global msg to tell the user that the post was successfully uploaded
                localStorage.setItem("message", "<div id='closemessage' class='alert alert-success alert-fixed alert-dismissable' >Post successfully uploaded!<a  class='close' data-dismiss='alert' aria-label='close' onclick='closemessage()'>&times;</a></div>");
                message();
            }
        } else {
			//while the server is responding change the alert to uploading...
            $('#newpostErr').text('Uploading...');
        }
    }
	//send the newpost.php file to the data needed for the new post to be saved.
	//the image is not rquired to be posted.
    request.open("POST", "php/newpost.php", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send("title=" + $('#ptitle').val() + "&content=" + $('#pcontent').val() + "&summary=" + $('#psummary').val() + "&image=" + $('#filename').text());
}

//handles login modal input with ajax request
//see any other modal handler, they are pretty much the same
//this one post to the login.php
function login() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var login = JSON.parse(this.responseText);
            if (login["error"]) {
                $('#loginerror').css('display', 'inline');
                $('#loginerror').text(login.error);
            }
            if (login["auth"]) {
                $('#loginerror').text("Logged In!");
                setTimeout(function () {
                    $('#loginModal').modal('hide');
                }, 500);
                localStorage.setItem("message", "<div id='closemessage' class='alert alert-success alert-fixed alert-dismissable'>Logged in!<a  class='close' data-dismiss='alert' aria-label='close' onclick='closemessage()'>&times;</a></div>");
                message();
                loggedin();
            }
        } else {
            $('#loginerror').css('display', 'inline');
            $('#loginerror').text("Logging in...");
        }
    }
    request.open("POST", "php/login.php", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send("username=" + $('#lusername').val() + "&password=" + $('#lpassword').val());
}

//this function handles the response then the user selects the logout opition in the drop down menu, if they are logged in
function logout() {
	//server requests the logout.php file which just unsets the PHP session variable
    handlePHP("logout.php", function (responseText) {
	//informs the user that they have logged out
        localStorage.setItem("message", "<div id='closemessage' class='alert alert-warning alert-fixed alert-dismissable' >"+ responseText +"<a  class='close' data-dismiss='alert' aria-label='close' onclick='closemessage()'>&times;</a></div>");
        location.reload();
    });
}

//this function fills an ELEMENT with the MAX number of summary blog posts from the USERNAME.
//this means that the function gets all the posts then filters the ones to diplay.
function displaySummaryPostList(element, max, username) {
    $(element).html('');
    handlePHP("getPosts.php", function(postdata) {
            //if the there are no posts to display then this notifys the user
            if (postdata.length == 0) {
                var post = "<div class='list-group-item list-group-item-warning flex-column'>No recent posts to see...</div>";
                $(element).append(post);
            } else {
                //if the username is not specified, the function fills the element with the number of post from ALL users
                if (username !== "") {
                    //if the username is not null then we need to limit the posts to just from that user
                    userposts = [];
                    //populate an empty array with the posts that are from that user
                    for (var i = 0; i < postdata.length; i++) {
                        if (postdata[i]['username'] == username) {
                            userposts.push(postdata[i]);
                        }
                    }
		    //limits the posts that need to be displayed to the users posts
                    postdata = userposts;
                }
                (function displayPost(i, count, max) {
                    if (i < 0 || (count >= max)) { //once the max has been reached or there are no posts left to display, then stop.
                        return;
                    } else {
                        //if there is still more posts to display then all the infomation in extraced from the postdata callback variable that the getPost.php responed with.
                        var username = postdata[i]['username'];
                        var tite = postdata[i]['title'];
                        var summary = postdata[i]['summary'];
                        var postcontent = postdata[i]['content'];
                        var userpostid = postdata[i]['userpostid'];
                        var dateposted = postdata[i]['datePosted'];

                        //gets the details of the user that posted this specific post
                        handlePHP("getUsersDetails.php?username=" + username, function(userdata) {
                            //fills the post element with the posters details so that the user can identify the user who posted it.
                            var post = "<a href='post.html?username=" + username + "&userpostid=" + userpostid + "' class='list-group-item list-group-item-action flex-column align-items-start'><p class='post-title'>" + tite + "</p><p class='post-summary'>" + summary + "</p><p class='post-content post-content-recent'>" + postcontent + "</p><div class='d-flex justify-content-start'><h5 class='post-footer mr-auto p-2'>" + userdata.fname + " " + userdata.surname + " ~" + username + "</h5><small class='text-muted m-2'> " + dateposted + " </small></div></a>";
                            $(element).append(post);
                            // recursively calls itself untill the if statement it met. 
                            count++;
                            displayPost(--i, count, max);
                        });
                    }
                })(postdata.length - 1, 0, max); //call the anonymousfunction.
            }
    });
}


//this function gets that populates the post.html page with all the infomation about that post
function displayFullPost() {
	//get the post that we are trying to view
    handlePHP("getPosts.php", function (postdata) {
        //get the post from username and userpostid;
        var args = location.href.substring(location.href.indexOf("?") + 1, location.href.length);
        var username = args.substring(args.indexOf("=") + 1, args.indexOf("&"));
        var userpostid = args.substring(args.lastIndexOf("=") + 1, args.length);
    	//searches the post list for the matching username and userpostid
        for (var i = 0; i < postdata.length; i++) {
            if (postdata[i]['userpostid'] == userpostid) {
                if (postdata[i]['username'] == username) {
                    //fill the page with the posts content!
                    //repalce newline char with break elements
                    var content = postdata[i]['content'].replace(/(?:\r\n|\r|\n)/g, '<br />');
                    var accountlink = "<a href='account.html?username=" + username + "'>~" + username + "</a>";
                    var title = postdata[i]['title'];
                    $('#posttitle').append(title);
                    $('#signoff').append("<small class='text-muted'> - written by: " + accountlink + "</small>");
                    $('#postsummary').text(postdata[i]['summary']);
                    if (postdata[i]['image'] !== "") {
                        $('#postimage').attr('src', "upload/" + postdata[i]['image']);
                    } else {
                        $('#postimage').hide();
                        $('#postcontent').removeClass('col-lg-8');
                        $('#postcontent').addClass('col-lg-12');
                    }
                    $('#postcontent').html(content);

                    $('#postdata').text(postdata[i]['datePosted']);
		    //eixt out of for loop
		    break;
                }
            }
        }
    });
}

//this function finds the users deatils that is passed to the server file getUsersDetails.php
function fillUserInfo(username) {
    $("#userInfo").html("");
    handlePHP("getUsersDetails.php?username=" + username, function (userdata) {
	//populates the user account info card on the account html page.
        var card = "<div class='card-header'><h2>" + userdata['fname'] + " " + userdata['surname'] + "</h2></div>" +
            "<div class='card-body'>" +
            "<strong>Email:</strong><a href='mailto:" + userdata['email'] + "'> " + userdata['email'] + "</a><br />" +
            "<strong>Date Joined:</strong> " + userdata['datejoined'] + "<br />" +
            "</div>";
        $("#userinfo").append(card);
    });
}

//redirect the user to the given url
function redirect(url) {
    location.href = url;
}

//work around for a button does calls the above function
function gotoAccount(){
	redirect("account.html");
}

//makes the global msg visable to the user
function message() {
    $('body').append(localStorage.getItem("message"));
}

//when the global msg is closed this function is called
function closemessage() {
	//unsets the global message item.
    localStorage.setItem("message", "");
}

//sets all the relevent header font sizes to a new value
function setFontSize(change) {
    var size = change;	
	//cap the amount of change or it will get too small/ large.
    if (size >= 16 && size <= 80) {
	//maintain the differance for each of the different size headers.
        $("h1").css('font-size', size + "px");
        $("h2").css('font-size', (size - 8) + "px");
        $("h3").css('font-size', (size - 4 - 8) + "px");
        $("h4").css('font-size', (size - 4 - 4 - 8) + "px");
    }
}

//returns the font-size of the h1 header
function getFontSize() {
    return parseInt($("h1").css('font-size'));
}

//sets the background color of the relevant headers
function setHeaderColor(change) {
    $("h1").css('background-color', change);
    $("h2").css('background-color', change);
    $("h3").css('background-color', change);
    $("h4").css('background-color', change);
}

//returns the current header backgrounds
function getHeaderColor() {
    return $("h1").css('background-color');
}

//this function is called when the user selects to save the options
//it will save the header setting in localstorage so that is can be loaded up that same way when the page refreshes
//or is the browser is shut down.
function saveOptions() {
    localStorage.setItem("headerSize", "" + getFontSize());
    localStorage.setItem("headerColor", getHeaderColor());
    setTimeout(function () {
        $('#pageoptionsModal').modal('hide');
    }, 500);
	//warn the user that the settings have been saved
    localStorage.setItem("message", "<div id='closemessage' class='alert alert-info alert-fixed alert-dismissable'>Preferences saved to localstorage<a  class='close' data-dismiss='alert' aria-label='close' onclick='closemessage()'>&times;</a></div>");
    message();
}