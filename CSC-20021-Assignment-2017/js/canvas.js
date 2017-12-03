console.log("Canvas Loading...")
var canvas = document.querySelector('canvas');
//console.log(canvas);

var c = canvas.getContext("2d");
var rain = [];
var boxWidth = 10;
initRain();
var anim = setInterval(draw, 20);

function initRain() {
    rain = [];
    for (var i = 0; i < 50; i++) {
        rain.push(new Box(Math.random() * canvas.width, -Math.random()*canvas.height, 1 * Math.random(), 10, 2+1*Math.random()));
    }
    // for (var i = 0; i < canvas.height / boxWidth; i++) {
    //     rain.push(new Box(0, i * boxWidth, boxWidth, boxWidth, 1 + ((i * 1)) / 5));
    //     //console.log(rain);
    // }
}

function draw() {
    //clear the canvas for each frame
    c.fillStyle = "#343a40";
    c.fillRect(0, 0, canvas.width, canvas.height);
    //display the current frame;
    // c.font = "10px Arial";
    // c.fillText("F: " + frame, canvas.width - 25, 10);
    for (var i = 0; i < rain.length; i++) {
        rain[i].draw(c);
    }
    update(canvas);
}

function update() {
    for (var i = 0; i < rain.length; i++) {
        rain[i].update(canvas);
    }
}

function resetAnimation() {
    stopAnimation();
    initRain();
    anim = setInterval(draw, 20);
}

function stopAnimation() {
    clearInterval(anim);
}