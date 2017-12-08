handlePHP("accountNeeded.php", function (session) {
    if (!session.auth) location.replace("index.html");
});