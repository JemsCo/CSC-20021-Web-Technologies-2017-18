var myval;

function startTimer() {
    myval = setInterval(myTimer, 1000);
}

function myTimer(entity) {
    var d = new Date();
    var t = d.toLocaleTimeString();
    document.getElementById("time").innerHTML = t;
}