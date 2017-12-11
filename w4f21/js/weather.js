window.onload = function () {
    var url = "php/getJSON.php?url=http://open.live.bbc.co.uk/weather/feeds/en/2645897/3dayforecast.rss";
    weatherInfo = document.getElementById("weatherInfo").childNodes;


    loadWeatherInfo(url, weatherInfo, handleWeatherInfo);
}

function loadWeatherInfo(url, parent, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            callback(this.responseText, parent);
        } else {
            parent[3].innerHTML = "Loading Data...";
        }
    }
    request.open("GET", url, true);
    request.send();
}

function handleWeatherInfo(json, parent) {
    var data = JSON.parse(json);
    var items = data.channel.item;
    var title = parent[1].childNodes;
    title[1].innerText = data.channel.title;
    parent[3].innerHTML = "";
    var date = [];
    var info = [];
    for (var i = 0; i < items.length; i++) {
        date[i] = items[i].title.substr(0, items[i].title.indexOf(":"));
        info[i] = items[i].title.substr(items[i].title.indexOf(":") + 2, items[i].title.length);
    }
    for (var i = 0; i < items.length; i++) {
        parent[3].innerHTML += "<h5>" + date[i] + "</h5><p>" + info[i] + "</p>";
    }
}