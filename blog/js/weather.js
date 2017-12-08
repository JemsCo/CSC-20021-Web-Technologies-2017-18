var url = "php/getJSON.php?url=http://open.live.bbc.co.uk/weather/feeds/en/2645897/3dayforecast.rss";
var weatherInfo = document.getElementById("weatherInfo").childNodes;
var request = new XMLHttpRequest();

loadWeatherInfo(url, weatherInfo, handleWeatherInfo);

function loadWeatherInfo(url, parent, callback) {
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            callback(this.responseText, parent);
        } else {
            weatherInfo[3].innerHTML = "Loading Data...";
        }
    }
    request.open("GET", url, true);
    request.send();
}

function handleWeatherInfo(json, parent) {
    var data = JSON.parse(json);
    var items = data.channel.item;
    weatherInfo[1].innerHTML = "<h3>"+data.channel.title+"</h3>";
    weatherInfo[3].innerHTML = "";
    var date = [];
    var info = [];
    for (var i = 0; i < items.length; i++) {
        date[i] = items[i].title.substr(0, items[i].title.indexOf(":"));
        info[i] = items[i].title.substr(items[i].title.indexOf(":") + 2, items[i].title.length);
    }
    for (var i = 0; i < items.length; i++) {
        weatherInfo[3].innerHTML += "<h3>" + date[i] + "</h3><p>" + info[i] + "</p>";
    }
}