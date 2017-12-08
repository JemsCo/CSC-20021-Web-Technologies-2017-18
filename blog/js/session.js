$(document).ready(function () {
    loggedin();
    recentPosts();
    setInterval(recentPosts, 10000);
});

function handlePHP(url, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText) {
                callback(JSON.parse(this.responseText));
            } else {
                callback({});
            }
        } else {
            return false;
        }
    };
    request.open("GET", "php/" + url, true);
    request.send();
}

function loggedin() {
    handlePHP("getSession.php", function (session) {
        $('#navbarRight').html("");
        if (session['auth']) {

            var newPost = "<button class='btn btn-success' type='button' data-toggle='modal' data-target='#newpostModal'><i class='fa fa-plus-square' aria-hidden='true'></i> New Post</button>"
            var dropdown = "<div class='btn-group'><a type='button' class='btn btn-info' href='account.html'><i class='fa fa-user'></i> " + session.uname.toUpperCase() + "</a><button type='button' class='btn btn-info dropdown-toggle dropdown-toggle-split' data-toggle='dropdown'><span class='caret'></span></button><div class='dropdown-menu'><button class='dropdown-item' >Settings</button><div class='dropdown-divider'></div><button class='dropdown-item' onclick='logout()'>Logout</button></div></div>";

            var newpostModal = "<!-- Modal --><div class='modal fade' id='newpostModal' role='dialog'><div class='modal-dialog'><!-- Modal content--><div class='modal-content'><div class='modal-header'><h4 class='modal-title'>New Post Form</h4><button type='button' class='close' data-dismiss='modal'>&times;</button></div><div class='modal-body'><div id='newpostForm'><div class='form-group'><label class='control-label col-sm-offset-2' for='ptitle'>Title:</label><div class='col-sm-12'><input type='text' class='form-control' id='ptitle' placeholder='Enter title'><div id='ptitleErr' class='alert alert-danger' style='display:none;'></div></div></div><div class='form-group'><label class='control-label col-sm-offset-2' for='pcontent'>Post Content:</label><div class='col-sm-12'><textarea type='text' class='form-control' id='pcontent' placeholder='Enter content'></textarea><div id='pcontentErr' class='alert alert-danger' style='display:none;'></div></div></div><div class='modal-footer'><div id='newpostErr' class='alert alert-danger' style='display:none;'></div><div class='form-group btn-group float-right'><button type='submit' class='btn btn-success' onclick='newpost()'>Post</button><button type='button' class='btn btn-danger' data-dismiss='modal'>Close</button></div></div></div></div></div></div></div>"

            $('body').append(newpostModal);
            $('#navbarRight').append(newPost);
            $('#navbarRight').append(dropdown);
        } else {
            var signinButton = "<button type='button' class='btn btn-primary' data-toggle='modal' data-target='#signupModal'><i class='fa fa-user-plus' aria-hidden='true'></i>  Sign-Up</button>";
            var loginButton = "<button type='button' class='btn btn-primary' data-toggle='modal' data-target='#loginModal'><i class='fa fa-sign-in' aria-hidden='true'></i>  Login</button>";
            $('#navbarRight').append(signinButton);
            $('#navbarRight').append(loginButton);

            var signloginModal = "<!-- Modal --><div class='modal fade' id='loginModal' role='dialog'><div class='modal-dialog'><!-- Modal content--><div class='modal-content'><div class='modal-header'><h4 class='modal-title'>Login Form</h4><button type='button' class='close' data-dismiss='modal'>&times;</button></div><div class='modal-body'><div id='loginForm'><div class=' form-group'><label class='control-label col-sm-offset-2' for='lusername'>Username:</label><div class='col-sm-12'><input type='text' class='form-control' id='lusername' placeholder='Enter username'></div></div><div class='form-group'><label class='control-label col-sm-offset-2' for='lpassword'>Password:</label><div class='col-sm-12'><input type='password' class='form-control' id='lpassword' placeholder='Enter password'></div></div><div class='modal-footer'><div id='loginerror' class='alert alert-danger' style='display:none;'></div><div class='form-group btn-group float-right'><button type='submit' class='btn btn-success' onclick='login()'>Login</button><button type='button' class='btn btn-danger' data-dismiss='modal'>Close</button></div></div></div></div></div></div></div><!-- Modal --><div class='modal fade' id='signupModal' role='dialog'><div class='modal-dialog'><!-- Modal content--><div class='modal-content'><div class='modal-header'><h4 class='modal-title'>Sign-Up Form</h4><button type='button' class='close' data-dismiss='modal'>&times;</button></div><div class='modal-body'><div id='signinForm'><div class='form-group'><label class='control-label col-sm-offset-2' for='sfname'>First Name:</label><div class='col-sm-12'><input type='text' class='form-control' id='sfname' placeholder='Enter first name'></div><div id='fnameErr' class='alert alert-danger' style='display:none;'></div></div><div class='form-group'><label class='control-label col-sm-offset-2' for='ssurname'>Surname:</label><div class='col-sm-12'><input type='text' class='form-control' id='ssurname' placeholder='Enter surname'></div><div id='surnameErr' class='alert alert-danger' style='display:none;'></div></div><div class=' form-group'><label class='control-label col-sm-offset-2' for='semail'>Email:</label><div class='col-sm-12'><input type='email' class='form-control' id='semail' placeholder='Enter email'></div><div id='emailErr' class='alert alert-danger' style='display:none;'></div></div><div class='form-group'><label class='control-label col-sm-offset-2' for='susername'>Username:</label><div class='col-sm-12'><input type='text' class='form-control' id='susername' placeholder='Enter username'></div><div id='usernameErr' class='alert alert-danger' style='display:none;'></div></div><div class='form-group'><label class='control-label col-sm-offset-2' for='spassword'>Password:</label><div class='col-sm-12'><input type='password' class='form-control' id='spassword' placeholder='Enter Password'></div><div id='passwordErr' class='alert alert-danger' style='display:none;'></div></div><div class='form-group'><label class='control-label col-sm-offset-2' for='srepassword'>Re-enter Password:</label><div class='col-sm-12'><input type='password' class='form-control' id='srepassword' placeholder='Re-enter Password'></div><div id='repasswordErr' class='alert alert-danger' style='display:none;'></div></div><p>By creating an account you agree to our <a href='#'>Terms & Privacy</a>.</p><div class='modal-footer'><div id='signinerror' class='alert alert-danger' style='display:none;'></div><div class='form-group btn-group float-right'><button type='submit' class='btn btn-success' onclick='signup()'>SignUp</button><button type='button' class='btn btn-danger' data-dismiss='modal'>Close</button></div></div></div></div></div></div></div>";

            $('body').append(signloginModal);
        }
    });
}

function signup() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var signup = JSON.parse(this.responseText);
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
                $('#signupModal').modal('hide');
                $('#loginModal').modal('show');
            }
        } else {
            $('#signinerror').text("Signin up...");
        }
    }
    request.open("POST", "php/signup.php", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send("email=" + $('#semail').val() + "&username=" + $('#susername').val() + "&password=" + $('#spassword').val() + "&repassword=" + $('#srepassword').val() + "&fname=" + $('#sfname').val() + "&surname=" + $('#ssurname').val());
}

function newpost() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var newpost = JSON.parse(this.responseText);
            if (newpost['error']) {
                if (newpost['titleErr']) {
                    $('#ptitleErr').css('display', 'block');
                    $('#ptitleErr').text(newpost['titleErr']);
                } else {
                    $('#ptitleErr').css('display', 'none');
                    $('#ptitleErr').text(newpost['titleErr']);
                }
                if (newpost['contentErr']) {
                    $('#pcontentErr').css('display', 'block');
                    $('#pcontentErr').text(newpost['contentErr']);
                } else {
                    $('#pcontentErr').css('display', 'none');
                    $('#pcontentErr').text(newpost['contentErr']);
                }
            } else {
                $('#newpostModal').modal('hide');
            }
        } else {
            $('#newpostErr').text("Posting...");
        }
    }
    request.open("POST", "php/newpost.php", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send("title=" + $('#ptitle').val() + "&content=" + $('#pcontent').val());
}

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
                $('#loginModal').modal('hide');
                $('#loginerror').text("Logged In!");
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

function logout() {
    handlePHP("logout.php", function (data) {
        location.reload();
    });
}

function recentPosts() {
    $('#recentposts').html('');
    handlePHP("getPosts.php", function (data) {
        if (!data) {
            var post = "<div class='list-group-item'>No recent posts to see...</div>";
            $('#recentposts').append(post);
        } else {
            for (var i = data.length - 1; i >= 0; i--) {

                var post = "<div class='list-group-item'><strong>" + getUsersName(data[i]['username']) + "</strong><a href='#'> ~" + data[i]['username'] + "</a><div><h3>" + data[i]['title'] + "</h3></div><div><p>" + data[i]['content'] + "</p></div></div>";
                $('#recentposts').append(post);
            }
        }

    });
}

function getUsersName(username) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var name = JSON.parse(this.responseText);
            return name;
        }
    }
    request.open("POST", "php/getUserDetails.php", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send("username=" + username);
}