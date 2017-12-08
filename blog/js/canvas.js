var canvas = document.querySelector('canvas');
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
}

function draw() {
    c.fillStyle = "#343a40";
    c.fillRect(0, 0, canvas.width, canvas.height);
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