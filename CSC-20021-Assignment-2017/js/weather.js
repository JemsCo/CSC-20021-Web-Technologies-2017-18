var params = "url=open.live.bbc.co.uk/weather/feeds/en/2645897/3dayforecast.rss";
var request = new ajaxRequest();

request.open("POST", "urlpost.php", true);
request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
request.setRequestHeader("Content-length", params.length);
request.setRequestHeader("Connection", "close");

request.onreadystatechange = function () {
    if (this.readyState == 4) {
        if (this.status == 200) {
            if (this.responseText != null) {
                document.getElementById('weatherInfo').innerHTML = this.responseText;
            } else {
                alert("Ajax error: No data recevied");
            }
        } else {
            alert("Ajax error: " + this.statusText);
        }
    }
}


function ajaxRequest() {
    try {
        var request = new XMLHttpRequest();
    } catch (e1) {
        try {
            request = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e2) {
            try {
                request = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e3) {
                request = false;
            }
        }
    }
    return request;
}